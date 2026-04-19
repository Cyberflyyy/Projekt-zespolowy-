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
        eyebrow="Panel ucznia"
        title={`Cześć, ${profile.full_name?.split(" ")[0] ?? "uczniu"}!`}
        description="Zarządzaj rezerwacjami, przeglądaj historię płatności i znajdź nowych korepetytorów."
        action={
          <Link href="/tutors" className="notion-btn-primary">
            Znajdź korepetytora
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Rezerwacje" value={bookings.length} hint="łącznie" />
        <StatCard label="Zaplanowane" value={upcoming.length} hint="nadchodzące lekcje" />
        <StatCard label="Wydano" value={formatMoney(totalSpent)} hint="za lekcje" />
      </div>

      <div className="notion-card mt-8 p-6">
        <h3 className="font-serif text-heading-3">Najbliższa lekcja</h3>
        {next ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">{next.listing?.title ?? "Lekcja"}</p>
              <p className="mt-1 text-sm text-ink-muted">
                z {next.tutor?.full_name} · {next.slot && formatDateShort(next.slot.starts_at)}
              </p>
            </div>
            <Link href={`/student/bookings/${next.id}`} className="notion-btn-secondary">
              Szczegóły
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">
            Nie masz jeszcze zaplanowanych lekcji. <Link href="/tutors" className="notion-link">Znajdź korepetytora</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
