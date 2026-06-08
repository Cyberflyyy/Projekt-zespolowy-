import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
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
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]" style={{ alignItems: "start" }}>
          <article style={{ minWidth: 0 }}>
            {/* Profile header card */}
            <div className="kp-card p-6" style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
              <Avatar src={tutor.profiles.avatar_url} name={tutor.profiles.full_name} size={80} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="kp-eyebrow" style={{ marginBottom: 6 }}>// profil korepetytora</div>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--fg)",
                    marginBottom: 4,
                  }}
                >
                  {tutor.profiles.full_name}
                </h1>
                <p style={{ fontSize: 14, color: "var(--fg-3)", marginBottom: 12 }}>{tutor.headline}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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

            {/* Bio card */}
            <div className="kp-card p-6" style={{ marginBottom: 20 }}>
              <div className="kp-eyebrow" style={{ marginBottom: 10 }}>// o mnie</div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--fg)",
                  marginBottom: 12,
                }}
              >
                O mnie
              </h2>
              <p style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                {tutor.bio ?? "Korepetytor nie uzupełnił jeszcze opisu."}
              </p>
            </div>

            {/* Listings card */}
            <div className="kp-card p-6" style={{ marginBottom: 20 }}>
              <div className="kp-eyebrow" style={{ marginBottom: 10 }}>// oferty</div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--fg)",
                  marginBottom: 16,
                }}
              >
                Oferty
              </h2>
              {activeListings.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--fg-3)" }}>Brak aktywnych ofert.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {activeListings.map((l) => (
                    <div
                      key={l.id}
                      style={{
                        padding: 16,
                        background: "var(--surface-2)",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 16,
                          flexWrap: "wrap",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>
                            {l.title}
                          </p>
                          <p style={{ fontSize: 12, color: "var(--fg-3)" }}>
                            {l.subjects.name} · {l.duration_minutes} min · poziom {l.level}
                          </p>
                          {l.description && (
                            <p style={{ marginTop: 8, fontSize: 13, color: "var(--fg-3)", maxWidth: "48ch" }}>
                              {l.description}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p
                            className="kp-mono"
                            style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.03em" }}
                          >
                            {formatMoney(l.price, l.currency)}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 2 }}>za lekcję</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Languages card */}
            {tutor.languages?.length > 0 && (
              <div className="kp-card p-6">
                <div className="kp-eyebrow" style={{ marginBottom: 10 }}>// języki</div>
                <h2
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--fg)",
                    marginBottom: 12,
                  }}
                >
                  Języki
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tutor.languages.map((l) => (
                    <Badge key={l} tone="neutral">{l}</Badge>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside style={{ position: "sticky", top: 80 }}>
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
