"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

export async function toggleAdminListingAction(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id"));
  const next = String(formData.get("is_active")) === "true";
  const db = createAdminClient();
  await db.from("listings").update({ is_active: next }).eq("id", id);
  revalidatePath("/admin/listings");
}
