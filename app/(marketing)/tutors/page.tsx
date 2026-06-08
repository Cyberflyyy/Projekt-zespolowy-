import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { TutorCard } from "@/components/marketplace/TutorCard";
import { TutorFilters } from "@/components/marketplace/TutorFilters";
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
      <div style={{ background: "var(--surface)", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 56 }}>
          <div className="kp-eyebrow" style={{ marginBottom: 12 }}>// marketplace</div>
          <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.035em", marginBottom: 8, fontFamily: "var(--font-display)", color: "var(--fg)" }}>
            Znajdź korepetytora
          </h1>
          <p style={{ fontSize: 14, color: "var(--fg-3)", maxWidth: 540, marginBottom: 32, lineHeight: 1.6 }}>
            Przeglądaj zweryfikowane profile. Wybierz przedmiot, formę lekcji i cenę, która Ci odpowiada.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, alignItems: "start" }}>
            <TutorFilters subjects={subjects ?? []} />

            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "var(--fg-3)" }}>
                  Znaleziono{" "}
                  <span className="kp-mono" style={{ color: "var(--fg)", fontWeight: 600 }}>{tutors.length}</span>
                  {" "}korepetytorów
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>Sortuj:</span>
                  <button className="kp-btn kp-btn-secondary kp-btn-sm">
                    Najwyższa ocena ↓
                  </button>
                </div>
              </div>

              {tutors.length === 0 ? (
                <div className="kp-card" style={{ padding: 32, textAlign: "center", color: "var(--fg-3)" }}>
                  <div className="kp-mono" style={{ fontSize: 12, marginBottom: 8 }}>// brak wyników</div>
                  <p style={{ fontSize: 15, color: "var(--fg)" }}>Brak korepetytorów spełniających kryteria.</p>
                  <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>Spróbuj zmienić filtry lub wyczyścić wyszukiwanie.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {tutors.map((t) => (
                    <TutorCard key={t.user_id} tutor={t} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
