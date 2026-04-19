import { PageHeader } from "@/components/ui/PageHeader";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { PaymentStatusBadge } from "@/components/dashboard/PaymentStatusBadge";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Payment, Booking, Profile } from "@/types/database";
import { formatDateShort, formatMoney } from "@/lib/utils/format";

type Row = Payment & {
  booking: (Pick<Booking, "id"> & {
    student: Pick<Profile, "full_name"> | null;
    tutor: Pick<Profile, "full_name"> | null;
  }) | null;
};

export default async function AdminPaymentsPage() {
  await requireRole("admin");
  const db = createAdminClient();

  const { data: payments } = await db
    .from("payments")
    .select(`
      *,
      booking:bookings(id,
        student:profiles!bookings_student_id_fkey(full_name),
        tutor:profiles!bookings_tutor_id_fkey(full_name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<Row[]>();

  const total = (payments ?? [])
    .filter((p) => p.status === "succeeded")
    .reduce((s, p) => s + p.platform_fee, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Finanse"
        title="Płatności"
        description={`Prowizje platformy: ${formatMoney(total)}`}
      />

      <Table>
        <THead>
          <tr>
            <Th>Data</Th>
            <Th>Uczeń</Th>
            <Th>Korepetytor</Th>
            <Th>Kwota</Th>
            <Th>Prowizja</Th>
            <Th>Dla korepetytora</Th>
            <Th>Status</Th>
          </tr>
        </THead>
        <TBody>
          {(payments ?? []).length === 0 ? (
            <tr><Td colSpan={7}><EmptyState title="Brak transakcji" /></Td></tr>
          ) : (
            (payments ?? []).map((p) => (
              <Tr key={p.id}>
                <Td>{formatDateShort(p.created_at)}</Td>
                <Td>{p.booking?.student?.full_name ?? "—"}</Td>
                <Td>{p.booking?.tutor?.full_name ?? "—"}</Td>
                <Td>{formatMoney(p.amount, p.currency)}</Td>
                <Td className="text-accent-green">{formatMoney(p.platform_fee, p.currency)}</Td>
                <Td>{formatMoney(p.tutor_share, p.currency)}</Td>
                <Td><PaymentStatusBadge status={p.status} /></Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
