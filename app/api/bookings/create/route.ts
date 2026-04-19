import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeCommission } from "@/lib/stripe/fees";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { bookingCreateSchema } from "@/lib/utils/validation";
import type { AvailabilitySlot, Listing, Profile, TutorProfile } from "@/types/database";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nie jesteś zalogowany." }, { status: 401 });

  const { data: me } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();
  if (!me || me.role !== "student")
    return NextResponse.json({ error: "Tylko uczeń może rezerwować lekcje." }, { status: 403 });

  const parsed = bookingCreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success)
    return NextResponse.json({ error: "Nieprawidłowe dane rezerwacji." }, { status: 400 });

  const { listing_id, slot_id, notes } = parsed.data;

  const [{ data: listing }, { data: slot }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", listing_id).eq("is_active", true).single<Listing>(),
    supabase.from("availability_slots").select("*").eq("id", slot_id).eq("is_booked", false).single<AvailabilitySlot>(),
  ]);
  if (!listing) return NextResponse.json({ error: "Oferta nie istnieje." }, { status: 404 });
  if (!slot || slot.tutor_id !== listing.tutor_id)
    return NextResponse.json({ error: "Termin niedostępny." }, { status: 409 });

  const { data: tp } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", listing.tutor_id)
    .single<TutorProfile>();
  if (!tp?.stripe_account_id || !tp.stripe_onboarded)
    return NextResponse.json(
      { error: "Korepetytor nie ma jeszcze aktywnego konta wypłat." },
      { status: 409 },
    );

  const { platformFee, tutorShare } = computeCommission(listing.price);

  // Reserve the slot and create booking as draft (admin client — atomic, bypasses RLS for this server flow).
  const admin = createAdminClient();

  const { data: reserve, error: reserveErr } = await admin
    .from("availability_slots")
    .update({ is_booked: true })
    .eq("id", slot.id)
    .eq("is_booked", false)
    .select("id")
    .single();
  if (reserveErr || !reserve)
    return NextResponse.json({ error: "Termin został właśnie zarezerwowany." }, { status: 409 });

  const { data: booking, error: bookingErr } = await admin
    .from("bookings")
    .insert({
      student_id: me.id,
      tutor_id: listing.tutor_id,
      listing_id: listing.id,
      slot_id: slot.id,
      status: "draft",
      amount_total: listing.price,
      platform_fee: platformFee,
      tutor_share: tutorShare,
      currency: listing.currency,
      notes: notes ?? null,
    })
    .select("*")
    .single();

  if (bookingErr || !booking) {
    await admin.from("availability_slots").update({ is_booked: false }).eq("id", slot.id);
    return NextResponse.json({ error: "Nie udało się utworzyć rezerwacji." }, { status: 500 });
  }

  try {
    const session = await createCheckoutSession({
      bookingId: booking.id,
      studentEmail: me.email,
      tutorStripeAccountId: tp.stripe_account_id,
      listingTitle: listing.title,
      amount: listing.price,
      platformFee,
      currency: listing.currency,
    });

    await admin
      .from("bookings")
      .update({ status: "pending_payment", stripe_checkout_session_id: session.id })
      .eq("id", booking.id);

    return NextResponse.json({ url: session.url });
  } catch (e) {
    await admin.from("bookings").update({ status: "cancelled" }).eq("id", booking.id);
    await admin.from("availability_slots").update({ is_booked: false }).eq("id", slot.id);
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
