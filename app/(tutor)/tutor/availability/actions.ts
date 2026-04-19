"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";

export async function addSlotAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const starts = new Date(String(formData.get("starts_at") ?? ""));
  const ends = new Date(String(formData.get("ends_at") ?? ""));
  if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime())) return;
  if (ends <= starts) return;

  const supabase = await createClient();
  await supabase.from("availability_slots").insert({
    tutor_id: profile.id,
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
  });
  revalidatePath("/tutor/availability");
}

export async function deleteSlotAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase
    .from("availability_slots")
    .delete()
    .eq("id", id)
    .eq("tutor_id", profile.id)
    .eq("is_booked", false);
  revalidatePath("/tutor/availability");
}
