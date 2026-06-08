import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { requireRole } from "@/lib/auth/guards";
import { listBookingsForStudent } from "@/lib/db/bookings";
import { formatDateShort, formatMoney } from "@/lib/utils/format";
import { cancelBookingAction } from "./actions";
import { CancelBookingButton } from "@/components/dashboard/CancelBookingButton";

export default async function StudentBookingsPage() {
  const { profile } = await requireRole("student");
  const bookings = await listBookingsForStudent(profile.id);

  return (
    <div>
      <PageHeader eyebrow="Rezerwacje" title="Moje rezerwacje" description="Wszystkie lekcje w jednym miejscu." />

      {bookings.length === 0 ? (
        <div className="notion-card p-10">
          <EmptyState
            title="Nie masz jeszcze żadnych rezerwacji"
            description="Zarezerwuj swoją pierwszą lekcję, aby zobaczyć ją tutaj."
          />
          <div className="mt-4 text-center">
            <Link href="/tutors" className="notion-btn-primary">
              Znajdź korepetytora
            </Link>
          </div>
        </div>
      ) : (
        <Table>
          <THead>
            <tr>
              <Th>Lekcja</Th>
              <Th>Korepetytor</Th>
              <Th>Termin</Th>
              <Th>Kwota</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </THead>
          <TBody>
            {bookings.map((b) => (
              <Tr key={b.id}>
                <Td className="font-medium">{b.listing?.title ?? "Lekcja"}</Td>
                <Td>{b.tutor?.full_name ?? "—"}</Td>
                <Td>{b.slot ? formatDateShort(b.slot.starts_at) : "—"}</Td>
                <Td>{formatMoney(b.amount_total, b.currency)}</Td>
                <Td><BookingStatusBadge status={b.status} /></Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/student/bookings/${b.id}`} className="notion-link text-sm">
                      Szczegóły →
                    </Link>
                    {(b.status === "pending_payment" || b.status === "confirmed") && (
                      <CancelBookingButton action={cancelBookingAction} bookingId={b.id} />
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
