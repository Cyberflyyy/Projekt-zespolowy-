import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils/format";

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const db = createAdminClient();

  const [
    { count: userCount },
    { count: tutorCount },
    { count: bookingCount },
    { data: revenue },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("tutor_profiles").select("*", { count: "exact", head: true }).eq("is_published", true),
    db.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    db.from("payments").select("platform_fee").eq("status", "succeeded"),
  ]);

  const totalCommission = (revenue ?? []).reduce((s: number, r: { platform_fee: number }) => s + r.platform_fee, 0);

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Przegląd platformy" />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Użytkownicy" value={userCount ?? 0} />
        <StatCard label="Aktywni korepetytorzy" value={tutorCount ?? 0} />
        <StatCard label="Potwierdzone rezerwacje" value={bookingCount ?? 0} />
        <StatCard label="Prowizje platformy" value={formatMoney(totalCommission)} hint="łącznie" />
      </div>
    </div>
  );
}
