import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "bad signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;
        if (!bookingId) break;

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        const { data: booking } = await admin
          .from("bookings")
          .update({
            status: "confirmed",
            stripe_payment_intent_id: paymentIntentId,
          })
          .eq("id", bookingId)
          .select("amount_total, platform_fee, tutor_share, currency")
          .single();

        if (booking) {
          let chargeId: string | null = null;
          let transferId: string | null = null;
          if (paymentIntentId) {
            const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
              expand: ["latest_charge", "latest_charge.transfer"],
            });
            const charge = pi.latest_charge as Stripe.Charge | null;
            chargeId = charge?.id ?? null;
            transferId =
              typeof charge?.transfer === "string"
                ? charge.transfer
                : charge?.transfer?.id ?? null;
          }

          await admin.from("payments").upsert(
            {
              booking_id: bookingId,
              status: "succeeded",
              amount: booking.amount_total,
              platform_fee: booking.platform_fee,
              tutor_share: booking.tutor_share,
              currency: booking.currency,
              stripe_charge_id: chargeId,
              stripe_transfer_id: transferId,
              raw_event: event as unknown as Record<string, unknown>,
            },
            { onConflict: "booking_id" },
          );
        }
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;
        if (!bookingId) break;

        const { data: b } = await admin
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", bookingId)
          .select("slot_id")
          .single();
        if (b?.slot_id)
          await admin.from("availability_slots").update({ is_booked: false }).eq("id", b.slot_id);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntent =
          typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (!paymentIntent) break;

        const { data: booking } = await admin
          .from("bookings")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", paymentIntent)
          .select("id")
          .single();
        if (booking)
          await admin.from("payments").update({ status: "refunded" }).eq("booking_id", booking.id);
        break;
      }

      case "account.updated": {
        const acct = event.data.object as Stripe.Account;
        const onboarded = !!(acct.charges_enabled && acct.payouts_enabled && acct.details_submitted);
        await admin
          .from("tutor_profiles")
          .update({ stripe_onboarded: onboarded })
          .eq("stripe_account_id", acct.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "handler error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
