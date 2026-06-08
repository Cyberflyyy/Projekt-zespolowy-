import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

export const getUserAndProfile = cache(async (): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return { user, profile };
});

export async function requireUser() {
  const { user, profile } = await getUserAndProfile();
  if (!user || !profile) redirect("/login");
  if (profile.is_blocked) redirect("/blocked");
  return { user, profile };
}

export async function requireRole(role: UserRole | UserRole[]) {
  const { user, profile } = await requireUser();
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(profile.role)) redirect("/403");
  return { user, profile };
}
