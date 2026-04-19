import { NextResponse, type NextRequest } from "next/server";
import { createOnboardingLink } from "@/lib/stripe/connect";

export async function GET(req: NextRequest) {
  const account = new URL(req.url).searchParams.get("account");
  if (!account) return NextResponse.redirect(new URL("/tutor/payouts", req.url));
  const url = await createOnboardingLink(account);
  return NextResponse.redirect(url);
}
