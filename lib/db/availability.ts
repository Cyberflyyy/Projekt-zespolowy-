import { createClient } from "@/lib/supabase/server";
import type { AvailabilitySlot } from "@/types/database";

export async function listUpcomingSlots(tutorId: string): Promise<AvailabilitySlot[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("tutor_id", tutorId)
    .eq("is_booked", false)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(60)
    .returns<AvailabilitySlot[]>();
  return data ?? [];
}
