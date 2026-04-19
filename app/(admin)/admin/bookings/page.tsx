import { PageHeader } from "@/components/ui/PageHeader";
import { Table, THead, TBody, Th, Tr, Td, EmptyState } from "@/components/ui/Table";
import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Booking, Listing, AvailabilitySlot, Profile } from "@/types/database";
import { formatDateShort, formatMoney } from "@/lib/utils/format";

type Row = Booking & {
  listing: Pick<Listing, "title"> | null;
  slot: Pick<AvailabilitySlot, "starts_at"> | null;
  student: Pick<Profile, "full_name"> | null;
  tutor: Pick<Profile, "full_name"> | null;
};

export default async function AdminBookingsPage() {
  await requireRole("admin");
  const db = createAdminClient();

  const { data: bookings } = await db
    .from("bookings")
    .select(`
      *,
      listing:listings(title),
      slot:availability_slots(starts_at),
      student:profiles!bookings_student_id_fkey(full_name),
      tutor:profiles!bookings_tutor_id_fkey(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<Row[]>();

  return (
    <div>
      <PageHeader eyebrow="Moderacja" title="Rezerwacje" description={`${bookings?.length ?? 0} łącznie`} />

      <Table>
        <THead>
          <tr>
            <Th>Termin</Th>
            <Th>Uczeń</Th>
            <Th>Korepetytor</Th>
            <Th>Oferta</Th>
            <Th>Kwota</Th>
            <Th>Status</Th>
          </tr>
        </THead>
        <TBody>
          {(bookings ?? []).length === 0 ? (
            <tr><Td colSpan={6}><EmptyState title="Brak rezerwacji" /></Td></tr>
          ) : (
            (bookings ?? []).map((b) => (
              <Tr key={b.id}>
                <Td>{b.slot ? formatDateShort(b.slot.starts_at) : "—"}</Td>
                <Td>{b.student?.full_name ?? "—"}</Td>
                <Td>{b.tutor?.full_name ?? "—"}</Td>
                <Td>{b.listing?.title ?? "—"}</Td>
                <Td>{formatMoney(b.amount_total, b.currency)}</Td>
                <Td><BookingStatusBadge status={b.status} /></Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
