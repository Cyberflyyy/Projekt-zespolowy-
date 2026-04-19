"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

export async function blockUserAction(formData: FormData) {
  await requireRole("admin");
  const userId = String(formData.get("user_id"));
  const db = createAdminClient();
  await db.from("profiles").update({ is_blocked: true }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function unblockUserAction(formData: FormData) {
  await requireRole("admin");
  const userId = String(formData.get("user_id"));
  const db = createAdminClient();
  await db.from("profiles").update({ is_blocked: false }).eq("id", userId);
  revalidatePath("/admin/users");
}
