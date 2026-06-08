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
        eyebrow="// panel · tutor.dashboard"
        title={`Witaj, ${profile.full_name?.split(" ")[0] ?? "Korepetytorze"}!`}
        description="Zarządzaj profilem, ofertami, dostępnością i wypłatami."
        action={
          !tp?.stripe_onboarded ? (
            <Link href="/tutor/payouts" className="kp-btn kp-btn-primary">
              Dokończ konfigurację wypłat
            </Link>
          ) : !tp?.is_published ? (
            <Link href="/tutor/profile" className="kp-btn kp-btn-primary">
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

      <div className="kp-card mt-8 p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// nadchodzące lekcje</div>
        <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)" }}>
          Najbliższe lekcje
        </h3>
        {upcoming.length === 0 ? (
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--fg-3)" }}>Brak zaplanowanych lekcji.</p>
        ) : (
          <ul style={{ marginTop: 16, borderTop: "1px solid var(--border)", listStyle: "none", padding: 0, margin: 0 }}>
            {upcoming.slice(0, 5).map((b) => (
              <li
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{b.listing?.title}</p>
                  <p style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>
                    z {b.student?.full_name} · {b.slot && formatDateShort(b.slot.starts_at)}
                  </p>
                </div>
                <span className="kp-mono" style={{ fontSize: 13, color: "var(--fg-2)" }}>
                  {formatMoney(b.tutor_share, b.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
