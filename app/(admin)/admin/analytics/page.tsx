import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils/format";

export default async function AdminAnalyticsPage() {
  await requireRole("admin");
  const db = createAdminClient();

  const [
    { count: students },
    { count: tutors },
    { count: publishedTutors },
    { count: confirmedBookings },
    { count: completedBookings },
    { data: payments },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    db.from("profiles").select("*", { count: "exact", head: true }).eq("role", "tutor"),
    db.from("tutor_profiles").select("*", { count: "exact", head: true }).eq("is_published", true),
    db.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    db.from("bookings").select("*", { count: "exact", head: true }).eq("status", "completed"),
    db.from("payments").select("amount, platform_fee, tutor_share").eq("status", "succeeded"),
  ]);

  const gross = (payments ?? []).reduce((s: number, p: { amount: number }) => s + p.amount, 0);
  const commission = (payments ?? []).reduce((s: number, p: { platform_fee: number }) => s + p.platform_fee, 0);
  const tutorsPaid = (payments ?? []).reduce((s: number, p: { tutor_share: number }) => s + p.tutor_share, 0);

  return (
    <div>
      <PageHeader eyebrow="Analityka" title="Statystyki platformy" />

      <section className="mb-8">
        <p className="text-xs uppercase tracking-widest text-ink-subtle mb-4">Użytkownicy</p>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Uczniowie" value={students ?? 0} />
          <StatCard label="Korepetytorzy (łącznie)" value={tutors ?? 0} />
          <StatCard label="Opublikowane profile" value={publishedTutors ?? 0} />
        </div>
      </section>

      <section className="mb-8">
        <p className="text-xs uppercase tracking-widest text-ink-subtle mb-4">Rezerwacje</p>
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard label="Potwierdzone" value={confirmedBookings ?? 0} />
          <StatCard label="Zakończone" value={completedBookings ?? 0} />
        </div>
      </section>

      <section>
        <p className="text-xs uppercase tracking-widest text-ink-subtle mb-4">Finanse</p>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Obrót brutto" value={formatMoney(gross)} />
          <StatCard label="Prowizje platformy" value={formatMoney(commission)} />
          <StatCard label="Wypłacono korepetytorów" value={formatMoney(tutorsPaid)} />
        </div>
      </section>
    </div>
  );
}
