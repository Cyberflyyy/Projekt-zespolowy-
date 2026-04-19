import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { PaymentStatusBadge } from "@/components/dashboard/PaymentStatusBadge";
import { requireRole } from "@/lib/auth/guards";
import { listEarningsForTutor } from "@/lib/db/payments";
import { formatDateShort, formatMoney } from "@/lib/utils/format";

export default async function TutorEarningsPage() {
  const { profile } = await requireRole("tutor");
  const payments = await listEarningsForTutor(profile.id);

  const succeeded = payments.filter((p) => p.status === "succeeded");
  const gross = succeeded.reduce((s, p) => s + p.amount, 0);
  const commission = succeeded.reduce((s, p) => s + p.platform_fee, 0);
  const net = succeeded.reduce((s, p) => s + p.tutor_share, 0);

  return (
    <div>
      <PageHeader eyebrow="Finanse" title="Zarobki" description="Zestawienie płatności i prowizji platformy." />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard label="Brutto" value={formatMoney(gross)} hint="łączna wartość opłaconych lekcji" />
        <StatCard label="Prowizja" value={formatMoney(commission)} hint="pobrana przez platformę" />
        <StatCard label="Do wypłaty" value={formatMoney(net)} hint="Twoja część po prowizji" />
      </div>

      {payments.length === 0 ? (
        <div className="notion-card p-10">
          <EmptyState title="Jeszcze nic nie zarobiłeś" description="Tu pojawią się transakcje po pierwszej opłaconej lekcji." />
        </div>
      ) : (
        <Table>
          <THead>
            <tr>
              <Th>Data</Th>
              <Th>Uczeń</Th>
              <Th>Brutto</Th>
              <Th>Prowizja</Th>
              <Th>Dla Ciebie</Th>
              <Th>Status</Th>
            </tr>
          </THead>
          <TBody>
            {payments.map((p) => (
              <Tr key={p.id}>
                <Td>{formatDateShort(p.created_at)}</Td>
                <Td>{p.booking?.student?.full_name ?? "—"}</Td>
                <Td>{formatMoney(p.amount, p.currency)}</Td>
                <Td className="text-ink-muted">{formatMoney(p.platform_fee, p.currency)}</Td>
                <Td className="font-medium">{formatMoney(p.tutor_share, p.currency)}</Td>
                <Td><PaymentStatusBadge status={p.status} /></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
