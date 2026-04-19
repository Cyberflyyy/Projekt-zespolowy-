import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { TutorCard } from "@/components/marketplace/TutorCard";
import { TutorFilters } from "@/components/marketplace/TutorFilters";
import { PageHeader } from "@/components/ui/PageHeader";
import { listTutors } from "@/lib/db/tutors";
import { createClient } from "@/lib/supabase/server";
import type { Subject } from "@/types/database";

export const metadata: Metadata = { title: "Korepetytorzy" };

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const subjectSlug = typeof sp.subject === "string" ? sp.subject : undefined;
  const format = typeof sp.format === "string" ? (sp.format as "online" | "in_person" | "both") : undefined;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const minPrice = typeof sp.min === "string" && sp.min ? Number(sp.min) * 100 : undefined;
  const maxPrice = typeof sp.max === "string" && sp.max ? Number(sp.max) * 100 : undefined;

  const supabase = await createClient();
  const [{ data: subjects }, tutors] = await Promise.all([
    supabase.from("subjects").select("*").order("name").returns<Subject[]>(),
    listTutors({ subjectSlug, lessonFormat: format, search, minPrice, maxPrice }),
  ]);

  return (
    <>
      <SiteHeader />
      <div className="container py-10">
        <PageHeader
          eyebrow="Marketplace"
          title="Znajdź korepetytora"
          description="Przeglądaj zweryfikowane profile. Wybierz przedmiot, formę lekcji i cenę, która Ci odpowiada."
        />

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <TutorFilters subjects={subjects ?? []} />

          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-ink-muted">
                Znaleziono <span className="text-ink font-medium">{tutors.length}</span> korepetytorów
              </p>
            </div>

            {tutors.length === 0 ? (
              <div className="notion-card p-10 text-center">
                <p className="font-serif text-heading-3">Brak wyników</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Spróbuj zmienić filtry lub wyczyścić wyszukiwanie.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tutors.map((t) => (
                  <TutorCard key={t.user_id} tutor={t} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
