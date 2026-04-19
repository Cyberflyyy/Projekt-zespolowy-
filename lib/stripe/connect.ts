import "server-only";
import { stripe } from "./client";
import { createAdminClient } from "@/lib/supabase/admin";

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function ensureConnectedAccount(params: {
  tutorId: string;
  email: string;
  existingAccountId: string | null;
}): Promise<string> {
  if (params.existingAccountId) return params.existingAccountId;

  const account = await stripe.accounts.create({
    type: "express",
    email: params.email,
    capabilities: {
      transfers: { requested: true },
      card_payments: { requested: true },
    },
    metadata: { tutor_id: params.tutorId },
  });

  const admin = createAdminClient();
  await admin
    .from("tutor_profiles")
    .update({ stripe_account_id: account.id })
    .eq("user_id", params.tutorId);

  return account.id;
}

export async function createOnboardingLink(accountId: string): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl()}/api/stripe/connect/refresh?account=${accountId}`,
    return_url: `${appUrl()}/tutor/payouts`,
    type: "account_onboarding",
  });
  return link.url;
}
