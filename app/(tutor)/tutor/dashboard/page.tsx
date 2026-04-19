import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth/guards";
import { listBookingsForTutor } from "@/lib/db/bookings";
import { listEarningsForTutor } from "@/lib/db/payments";
import { createClient } from "@/lib/supabase/server";
import type { TutorProfile } from "@/types/database";
import { formatMoney, formatDateShort } from "@/lib/utils/format";

export default async function TutorDashboardPage() {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();

  const [{ data: tp }, bookings, earnings] = await Promise.all([
    supabase.from("tutor_profiles").select("*").eq("user_id", profile.id).single<TutorProfile>(),
    listBookingsForTutor(profile.id),
    listEarningsForTutor(profile.id),
  ]);

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && b.slot && new Date(b.slot.starts_at) > new Date(),
  );
  const totalEarned = earnings
    .filter((p) => p.status === "succeeded")
    .reduce((s, p) => s + p.tutor_share, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Panel korepetytora"
        title={`Witaj, ${profile.full_name?.split(" ")[0] ?? "Korepetytorze"}!`}
        description="Zarządzaj profilem, ofertami, dostępnością i wypłatami."
        action={
          !tp?.stripe_onboarded ? (
            <Link href="/tutor/payouts" className="notion-btn-primary">
              Dokończ konfigurację wypłat
            </Link>
          ) : !tp?.is_published ? (
            <Link href="/tutor/profile" className="notion-btn-primary">
              Opublikuj profil
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Nadchodzące" value={upcoming.length} hint="lekcje" />
        <StatCard label="Rezerwacje" value={bookings.length} hint="łącznie" />
        <StatCard label="Zarobiono" value={formatMoney(totalEarned)} hint="po prowizji" />
        <StatCard
          label="Status wypłat"
          value={tp?.stripe_onboarded ? "Aktywne" : "Brak"}
          hint={tp?.stripe_onboarded ? "Stripe Connect" : "Wymaga aktywacji"}
        />
      </div>

      <div className="notion-card mt-8 p-6">
        <h3 className="font-serif text-heading-3">Najbliższe lekcje</h3>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">Brak zaplanowanych lekcji.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {upcoming.slice(0, 5).map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{b.listing?.title}</p>
                  <p className="text-xs text-ink-muted">
                    z {b.student?.full_name} · {b.slot && formatDateShort(b.slot.starts_at)}
                  </p>
                </div>
                <span className="text-sm text-ink">{formatMoney(b.tutor_share, b.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
