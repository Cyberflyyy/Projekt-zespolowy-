import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { TutorProfile } from "@/types/database";
import { startOnboardingAction } from "./actions";

export default async function TutorPayoutsPage() {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();
  const { data: tp } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .single<TutorProfile>();

  const onboarded = !!tp?.stripe_onboarded;
  const hasAccount = !!tp?.stripe_account_id;

  return (
    <div>
      <PageHeader eyebrow="Wypłaty" title="Konto Stripe Connect" description="Aktywuj konto, aby odbierać wypłaty za lekcje." />

      <div className="notion-card p-6 max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">Status</p>
            <div className="mt-1">
              {onboarded ? (
                <Badge tone="green">Aktywne — przyjmuje płatności</Badge>
              ) : hasAccount ? (
                <Badge tone="yellow">Onboarding niezakończony</Badge>
              ) : (
                <Badge tone="red">Brak konta</Badge>
              )}
            </div>
          </div>

          <form action={startOnboardingAction}>
            <button className="notion-btn-primary">
              {onboarded ? "Zarządzaj kontem" : hasAccount ? "Dokończ onboarding" : "Rozpocznij onboarding"}
            </button>
          </form>
        </div>

        <div className="rounded-md border border-line bg-surface p-4 text-sm text-ink-muted space-y-2">
          <p>Dlaczego Stripe Connect?</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Płatność uczniów trafia bezpośrednio do Stripe i dzielona jest między Ciebie i platformę.</li>
            <li>Weryfikacja tożsamości i zgodność z przepisami po stronie Stripe.</li>
            <li>Wypłaty na Twoje konto bankowe automatycznie.</li>
          </ul>
        </div>

        <p className="text-xs text-ink-subtle">
          Masz pytania? Zajrzyj do <Link href="/how-it-works" className="notion-link">sekcji pomocy</Link>.
        </p>
      </div>
    </div>
  );
}
