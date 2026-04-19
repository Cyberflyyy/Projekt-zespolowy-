import { createClient } from "@/lib/supabase/server";
import type { Booking, Listing, Profile, AvailabilitySlot, Payment } from "@/types/database";

export type BookingRow = Booking & {
  listing: Pick<Listing, "title" | "duration_minutes"> | null;
  slot: Pick<AvailabilitySlot, "starts_at" | "ends_at"> | null;
  tutor: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
  student: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
};

const SELECT = `
  *,
  listing:listings(title, duration_minutes),
  slot:availability_slots(starts_at, ends_at),
  tutor:profiles!bookings_tutor_id_fkey(id, full_name, avatar_url),
  student:profiles!bookings_student_id_fkey(id, full_name, avatar_url)
`;

export async function listBookingsForStudent(studentId: string): Promise<BookingRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(SELECT)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .returns<BookingRow[]>();
  return data ?? [];
}

export async function listBookingsForTutor(tutorId: string): Promise<BookingRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(SELECT)
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false })
    .returns<BookingRow[]>();
  return data ?? [];
}

export async function getBooking(id: string): Promise<(BookingRow & { payment: Payment | null }) | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(`${SELECT}, payment:payments(*)`)
    .eq("id", id)
    .maybeSingle<BookingRow & { payment: Payment | Payment[] | null }>();

  if (!data) return null;
  return {
    ...data,
    payment: Array.isArray(data.payment) ? (data.payment[0] ?? null) : data.payment,
  };
}
