"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { ensureConnectedAccount, createOnboardingLink } from "@/lib/stripe/connect";
import type { TutorProfile } from "@/types/database";

export async function startOnboardingAction() {
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

  if (tp?.stripe_onboarded) {
    const login = await stripe.accounts.createLoginLink(accountId);
    redirect(login.url);
  }

  const link = await createOnboardingLink(accountId);
  redirect(link);
}
