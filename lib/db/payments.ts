import { createClient } from "@/lib/supabase/server";
import type { Payment, Booking, Profile } from "@/types/database";

export type PaymentRow = Payment & {
  booking: (Pick<Booking, "id" | "student_id" | "tutor_id" | "listing_id"> & {
    tutor: Pick<Profile, "full_name"> | null;
    student: Pick<Profile, "full_name"> | null;
  }) | null;
};

export async function listPaymentsForStudent(studentId: string): Promise<PaymentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select(`*, booking:bookings!inner(id, student_id, tutor_id, listing_id,
      tutor:profiles!bookings_tutor_id_fkey(full_name),
      student:profiles!bookings_student_id_fkey(full_name))`)
    .eq("booking.student_id", studentId)
    .order("created_at", { ascending: false })
    .returns<PaymentRow[]>();
  return data ?? [];
}

export async function listEarningsForTutor(tutorId: string): Promise<PaymentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select(`*, booking:bookings!inner(id, student_id, tutor_id, listing_id,
      tutor:profiles!bookings_tutor_id_fkey(full_name),
      student:profiles!bookings_student_id_fkey(full_name))`)
    .eq("booking.tutor_id", tutorId)
    .order("created_at", { ascending: false })
    .returns<PaymentRow[]>();
  return data ?? [];
}
