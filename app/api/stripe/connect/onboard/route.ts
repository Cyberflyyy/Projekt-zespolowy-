import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { ensureConnectedAccount, createOnboardingLink } from "@/lib/stripe/connect";
import type { TutorProfile } from "@/types/database";

export async function POST() {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();
  const { data: tp } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .single<TutorProfile>();

  const accountId = await ensureConnectedAccount({
    tutorId: profile.id,
    email: profile.email,
    existingAccountId: tp?.stripe_account_id ?? null,
  });
  const url = await createOnboardingLink(accountId);
  return NextResponse.json({ url });
}
