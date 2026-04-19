import { PageHeader } from "@/components/ui/PageHeader";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { PaymentStatusBadge } from "@/components/dashboard/PaymentStatusBadge";
import { requireRole } from "@/lib/auth/guards";
import { listPaymentsForStudent } from "@/lib/db/payments";
import { formatDateShort, formatMoney } from "@/lib/utils/format";

export default async function StudentPaymentsPage() {
  const { profile } = await requireRole("student");
  const payments = await listPaymentsForStudent(profile.id);

  return (
    <div>
      <PageHeader eyebrow="Historia" title="Płatności" description="Wszystkie opłacone lekcje i ich status." />

      {payments.length === 0 ? (
        <div className="notion-card p-10">
          <EmptyState title="Brak płatności" description="Gdy zapłacisz za lekcję, pojawi się tutaj." />
        </div>
      ) : (
        <Table>
          <THead>
            <tr>
              <Th>Data</Th>
              <Th>Korepetytor</Th>
              <Th>Kwota</Th>
              <Th>Status</Th>
              <Th>ID Stripe</Th>
            </tr>
          </THead>
          <TBody>
            {payments.map((p) => (
              <Tr key={p.id}>
                <Td>{formatDateShort(p.created_at)}</Td>
                <Td>{p.booking?.tutor?.full_name ?? "—"}</Td>
                <Td>{formatMoney(p.amount, p.currency)}</Td>
                <Td><PaymentStatusBadge status={p.status} /></Td>
                <Td className="text-xs text-ink-subtle">{p.stripe_charge_id ?? "—"}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
