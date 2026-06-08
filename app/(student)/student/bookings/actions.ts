"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/guards";

export async function cancelBookingAction(formData: FormData) {
  const { profile } = await requireRole("student");
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) return;

  const admin = createAdminClient();

  const { data: booking } = await admin
    .from("bookings")
    .select("id, status, slot_id")
    .eq("id", bookingId)
    .eq("student_id", profile.id)
    .single();

  if (!booking) return;
  if (!["pending_payment", "confirmed"].includes(booking.status)) return;

  await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (booking.slot_id) {
    await admin
      .from("availability_slots")
      .update({ is_booked: false })
      .eq("id", booking.slot_id);
  }

  revalidatePath("/student/bookings");
  revalidatePath("/student/dashboard");
}
