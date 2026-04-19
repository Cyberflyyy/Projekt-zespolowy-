import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { AvailabilityPicker } from "@/components/marketplace/AvailabilityPicker";
import { getTutor } from "@/lib/db/tutors";
import { listUpcomingSlots } from "@/lib/db/availability";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/format";

const FORMAT_LABEL: Record<string, string> = {
  online: "Online",
  in_person: "Stacjonarnie",
  both: "Online i stacjonarnie",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tutor = await getTutor(id);
  return { title: tutor?.profiles.full_name ?? "Profil korepetytora" };
}

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await getTutor(id);
  if (!tutor) notFound();

  const slots = await listUpcomingSlots(id);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const activeListings = tutor.listings.filter((l) => l.is_active);

  return (
    <>
      <SiteHeader />
      <div className="container py-10 max-w-content">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="min-w-0">
            <div className="flex items-start gap-5">
              <Avatar src={tutor.profiles.avatar_url} name={tutor.profiles.full_name} size={96} />
              <div>
                <h1 className="font-serif text-display text-ink">{tutor.profiles.full_name}</h1>
                <p className="mt-1 text-ink-muted">{tutor.headline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <Badge tone="neutral">
                    ★ {Number(tutor.rating_avg).toFixed(1)} ({tutor.rating_count})
                  </Badge>
                  <Badge tone="neutral">{FORMAT_LABEL[tutor.lesson_format]}</Badge>
                  {tutor.city && <Badge tone="neutral">{tutor.city}</Badge>}
                  {tutor.years_experience > 0 && (
                    <Badge tone="neutral">{tutor.years_experience} lat doświadczenia</Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <section>
              <h2 className="font-serif text-heading-2">O mnie</h2>
              <div className="notion-prose mt-4 whitespace-pre-line">
                {tutor.bio ?? "Korepetytor nie uzupełnił jeszcze opisu."}
              </div>
            </section>

            <Separator className="my-8" />

            <section>
              <h2 className="font-serif text-heading-2">Oferty</h2>
              {activeListings.length === 0 ? (
                <p className="mt-4 text-sm text-ink-muted">Brak aktywnych ofert.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {activeListings.map((l) => (
                    <div key={l.id} className="notion-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-ink">{l.title}</p>
                          <p className="mt-1 text-xs text-ink-muted">
                            {l.subjects.name} · {l.duration_minutes} min · poziom {l.level}
                          </p>
                          {l.description && (
                            <p className="mt-3 text-sm text-ink-muted max-w-prose">{l.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-heading-2 text-ink">
                            {formatMoney(l.price, l.currency)}
                          </p>
                          <p className="text-xs text-ink-subtle">za lekcję</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {tutor.languages?.length > 0 && (
              <>
                <Separator className="my-8" />
                <section>
                  <h2 className="font-serif text-heading-2">Języki</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.languages.map((l) => (
                      <Badge key={l} tone="neutral">{l}</Badge>
                    ))}
                  </div>
                </section>
              </>
            )}
          </article>

          <aside>
            <AvailabilityPicker
              slots={slots}
              listings={activeListings}
              tutorId={tutor.user_id}
              isAuthenticated={!!user}
            />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
