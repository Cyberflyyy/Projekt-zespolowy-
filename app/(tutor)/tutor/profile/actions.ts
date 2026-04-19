"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";

export async function saveTutorProfileAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const languages = String(formData.get("languages") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const patch = {
    headline: String(formData.get("headline") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    hourly_rate: Number(formData.get("hourly_rate") ?? 0),
    years_experience: Number(formData.get("years_experience") ?? 0),
    lesson_format: String(formData.get("lesson_format") ?? "online") as "online" | "in_person" | "both",
    city: String(formData.get("city") ?? "") || null,
    languages,
  };

  const supabase = await createClient();
  await supabase.from("tutor_profiles").update(patch).eq("user_id", profile.id);
  revalidatePath("/tutor/profile");
}

export async function togglePublishedAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const next = String(formData.get("is_published")) === "true";
  const supabase = await createClient();
  await supabase.from("tutor_profiles").update({ is_published: next }).eq("user_id", profile.id);
  revalidatePath("/tutor/profile");
}

export async function uploadAvatarAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return;

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${profile.id}/avatar-${Date.now()}.${ext}`;

  const arrayBuf = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, new Uint8Array(arrayBuf), { contentType: file.type, upsert: true });
  if (error) return;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", profile.id);
  revalidatePath("/tutor/profile");
}
