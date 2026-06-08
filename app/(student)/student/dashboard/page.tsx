import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth/guards";
import { listBookingsForStudent } from "@/lib/db/bookings";
import { formatMoney, formatDateShort } from "@/lib/utils/format";

export default async function StudentDashboardPage() {
  const { profile } = await requireRole("student");
  const bookings = await listBookingsForStudent(profile.id);

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && b.slot && new Date(b.slot.starts_at) > new Date(),
  );
  const totalSpent = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((acc, b) => acc + b.amount_total, 0);

  const next = upcoming[0];

  return (
    <div>
      <PageHeader
        eyebrow="// panel · student.dashboard"
        title={`Cześć, ${profile.full_name?.split(" ")[0] ?? "uczniu"}!`}
        description="Zarządzaj rezerwacjami, przeglądaj historię płatności i znajdź nowych korepetytorów."
        action={
          <Link href="/tutors" className="kp-btn kp-btn-primary">
            Znajdź korepetytora
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Rezerwacje" value={bookings.length} hint="łącznie" />
        <StatCard label="Zaplanowane" value={upcoming.length} hint="nadchodzące lekcje" />
        <StatCard label="Wydano" value={formatMoney(totalSpent)} hint="za lekcje" />
      </div>

      <div className="kp-card mt-8 p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// najbliższa lekcja</div>
        <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)" }}>
          Najbliższa lekcja
        </h3>
        {next ? (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>{next.listing?.title ?? "Lekcja"}</p>
              <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>
                z {next.tutor?.full_name} · {next.slot && formatDateShort(next.slot.starts_at)}
              </p>
            </div>
            <Link href={`/student/bookings/${next.id}`} className="kp-btn kp-btn-secondary">
              Szczegóły
            </Link>
          </div>
        ) : (
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--fg-3)" }}>
            Nie masz jeszcze zaplanowanych lekcji.{" "}
            <Link href="/tutors" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
              Znajdź korepetytora
            </Link>.
          </p>
        )}
      </div>
    </div>
  );
}
