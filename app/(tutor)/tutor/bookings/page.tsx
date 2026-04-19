import { PageHeader } from "@/components/ui/PageHeader";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { requireRole } from "@/lib/auth/guards";
import { listBookingsForTutor } from "@/lib/db/bookings";
import { formatDateShort, formatMoney } from "@/lib/utils/format";

export default async function TutorBookingsPage() {
  const { profile } = await requireRole("tutor");
  const bookings = await listBookingsForTutor(profile.id);

  return (
    <div>
      <PageHeader eyebrow="Rezerwacje" title="Twoje rezerwacje" description="Pełna historia lekcji zarezerwowanych u Ciebie." />

      {bookings.length === 0 ? (
        <div className="notion-card p-10">
          <EmptyState title="Brak rezerwacji" description="Pierwsza rezerwacja pojawi się tutaj." />
        </div>
      ) : (
        <Table>
          <THead>
            <tr>
              <Th>Termin</Th>
              <Th>Uczeń</Th>
              <Th>Oferta</Th>
              <Th>Dla Ciebie</Th>
              <Th>Status</Th>
            </tr>
          </THead>
          <TBody>
            {bookings.map((b) => (
              <Tr key={b.id}>
                <Td>{b.slot ? formatDateShort(b.slot.starts_at) : "—"}</Td>
                <Td>{b.student?.full_name ?? "—"}</Td>
                <Td>{b.listing?.title ?? "—"}</Td>
                <Td>{formatMoney(b.tutor_share, b.currency)}</Td>
                <Td><BookingStatusBadge status={b.status} /></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
