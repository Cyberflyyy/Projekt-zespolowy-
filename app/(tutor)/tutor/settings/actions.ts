"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";

export async function updateTutorAccountAction(formData: FormData) {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ full_name: String(formData.get("full_name") ?? profile.full_name) })
    .eq("id", profile.id);
  revalidatePath("/tutor/settings");
}
