"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";

export async function createListingAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();

  const payload = {
    tutor_id: profile.id,
    subject_id: String(formData.get("subject_id") ?? ""),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "") || null,
    level: String(formData.get("level") ?? "high_school") as
      | "primary" | "secondary" | "high_school" | "university" | "adult",
    price: Number(formData.get("price") ?? 0),
    duration_minutes: Number(formData.get("duration_minutes") ?? 60),
    currency: process.env.DEFAULT_CURRENCY ?? "pln",
    is_active: true,
  };
  if (!payload.subject_id || !payload.title || payload.price <= 0) return;

  await supabase.from("listings").insert(payload);
  revalidatePath("/tutor/listings");
}

export async function toggleListingAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const id = String(formData.get("id"));
  const next = String(formData.get("is_active")) === "true";
  const supabase = await createClient();
  await supabase
    .from("listings")
    .update({ is_active: next })
    .eq("id", id)
    .eq("tutor_id", profile.id);
  revalidatePath("/tutor/listings");
}

export async function deleteListingAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("listings").delete().eq("id", id).eq("tutor_id", profile.id);
  revalidatePath("/tutor/listings");
}
