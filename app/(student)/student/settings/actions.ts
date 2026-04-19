"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/guards";

export async function updateProfileAction(formData: FormData) {
  const { user } = await requireUser();
  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) return;

  const supabase = await createClient();
  await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  revalidatePath("/student/settings");
}
