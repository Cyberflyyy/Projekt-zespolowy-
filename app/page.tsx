import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/Avatar";
import { formatMoney } from "@/lib/utils/format";
import type { Profile, TutorProfile, Subject } from "@/types/database";

type FeaturedRow = TutorProfile & {
  profiles: Pick<Profile, "full_name" | "avatar_url">;
};

const SUBJECT_GLYPHS: Record<string, string> = {
  matematyka: "∑", fizyka: "ƒ", chemia: "⌬", informatyka: "{ }",
  biologia: "✿", polski: "¶", angielski: "EN", niemiecki: "DE",
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("tutor_profiles")
    .select("user_id, headline, hourly_rate, currency, city, rating_avg, rating_count, years_experience, profiles:profiles!inner(full_name, avatar_url)")
    .eq("is_published", true)
    .order("rating_avg", { ascending: false })
    .limit(4)
    .returns<FeaturedRow[]>();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .limit(8)
    .returns<Subject[]>();

  return (
    <>
      <SiteHeader />

      {/* ── Live status bar ─────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "8px 0",
        borderBottom: "1px solid var(--border)",
        fontSize: 11,
        color: "var(--fg-3)",
        fontFamily: "var(--font-mono)",
        background: "linear-gradient(90deg, var(--accent-tint), var(--surface))",
      }}>
        <div className="container flex items-center" style={{ gap: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span className="kp-badge-dot kp-pulse" style={{ background: "#16A34A", boxShadow: "0 0 0 3px rgba(22,163,74,0.18)" }} />
            LIVE · 142 lekcji w toku
          </span>
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span>↗ 1 247 zweryfikowanych korepetytorów</span>
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span className="hidden sm:inline">Średni czas rezerwacji 1m 42s</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-4)" }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--fg-4)", display: "inline-block" }} />
            v2.4.0 · stable
          </span>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--surface)" }}>
        <div className="kp-aurora" style={{ animation: "kpAurora 14s ease-in-out infinite" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 64, paddingBottom: 80 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "start" }}>

            {/* Left copy */}
            <div>
              <div className="kp-eyebrow" style={{ marginBottom: 24 }}>
                <span style={{ color: "var(--fg-2)" }}>// dla 30 102 uczniów / mies.</span>
              </div>
              <h1 style={{
                fontSize: "clamp(2.5rem, 5vw, 4.75rem)",
                lineHeight: 0.96,
                fontWeight: 600,
                letterSpacing: "-0.05em",
                marginBottom: 24,
                fontFamily: "var(--font-display)",
              }}>
                Ucz się<br />
                z&nbsp;korepetytorem,<br />
                <span style={{ color: "var(--fg-4)" }}>którego</span><br />
                <span className="kp-accent-text">cenisz.</span>
              </h1>
              <p style={{ fontSize: 17, color: "var(--fg-2)", maxWidth: 460, lineHeight: 1.55, marginBottom: 32 }}>
                Marketplace, gdzie każdy korepetytor jest sprawdzony, a każda płatność zabezpieczona.
                Rezerwujesz w 2 minuty, uczysz się od jutra.
              </p>
              <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
                <Link href="/tutors" className="kp-btn kp-btn-primary kp-btn-lg">
                  Znajdź korepetytora →
                </Link>
                <Link href="/how-it-works" className="kp-btn kp-btn-secondary kp-btn-lg">
                  Jak to działa
                </Link>
              </div>

              {/* Stats */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "auto 1px auto 1px auto",
                gap: 24,
                alignItems: "end",
                paddingTop: 24,
                borderTop: "1px solid var(--border)",
              }}>
                <div>
                  <div className="kp-mono" style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1 }}>1 247</div>
                  <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 6, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textTransform: "uppercase" }}>korepetytorów</div>
                </div>
                <div style={{ height: 36, background: "var(--border)" }} />
                <div>
                  <div className="kp-mono" style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1 }}>30 102</div>
                  <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 6, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textTransform: "uppercase" }}>lekcji / mies.</div>
                </div>
                <div style={{ height: 36, background: "var(--border)" }} />
                <div>
                  <div className="kp-mono" style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1 }}>4.92 ★</div>
                  <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 6, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", textTransform: "uppercase" }}>średnia ocena</div>
                </div>
              </div>
            </div>

            {/* Right: booking card */}
            <div className="hidden lg:block" style={{ position: "relative", paddingTop: 16 }}>
              <HeroBookingCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted-by marquee ───────────────────────────────── */}
      <div style={{
        padding: "20px 0",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}>
        <div className="kp-marquee-track" style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 500,
          color: "var(--fg-3)",
          letterSpacing: "-0.02em",
        }}>
          {[...UNIVERSITIES, ...UNIVERSITIES].map((u, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 48 }}>
              {u}<span style={{ color: "var(--fg-4)" }}>★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Subjects ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "linear-gradient(180deg, var(--surface) 0%, var(--accent-tint) 100%)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, gap: 24 }}>
            <div>
              <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// katalog · directory.json</div>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", letterSpacing: "-0.04em", fontWeight: 600, fontFamily: "var(--font-display)" }}>
                Wybierz przedmiot,<br />
                <span style={{ color: "var(--fg-3)" }}>znajdź korepetytora.</span>
              </h2>
            </div>
            <Link href="/tutors" className="kp-nav-link" style={{ whiteSpace: "nowrap", fontSize: 13, flexShrink: 0 }}>
              Cały katalog →
            </Link>
          </div>

          {/* Bento grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {/* Featured big tile */}
            <Link href="/tutors" className="kp-card" style={{
              gridRow: "span 2",
              padding: 24,
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
              color: "var(--accent-fg)",
              borderColor: "var(--accent-2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 20px 40px -10px rgba(93,107,181,0.5)",
              textDecoration: "none",
              minHeight: 300,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>// featured</span>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.5)" }}>ścisłe</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 160, lineHeight: 0.9, fontWeight: 500, letterSpacing: "-0.06em", color: "rgba(255,255,255,0.08)", position: "absolute", right: -10, top: 30, pointerEvents: "none" }}>∑</div>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.035em", marginBottom: 8 }}>Matematyka</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, marginBottom: 20 }}>
                  412 zweryfikowanych nauczycieli · od 70 zł / 60 min
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Przeglądaj →</span>
              </div>
            </Link>

            {/* Subject tiles */}
            {(subjects ?? FALLBACK_SUBJECTS).slice(0, 7).map((s, i) => {
              const slug = "slug" in s ? s.slug : (s as any).name?.toLowerCase();
              const glyph = SUBJECT_GLYPHS[slug] ?? SUBJECT_GLYPHS[(s as any).name?.toLowerCase()] ?? "#";
              return (
                <Link key={i} href={`/tutors?subject=${slug}`} className="kp-card kp-card-hover" style={{
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  minHeight: 130,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="kp-mono" style={{ fontSize: 11, color: "var(--fg-4)" }}>0{i + 2}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, lineHeight: 1, color: "var(--fg-4)", letterSpacing: "-0.04em", marginTop: 4, marginBottom: 8 }}>{glyph}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 4, color: "var(--fg)" }}>
                      {(s as any).name}
                    </div>
                    <div className="kp-mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>od 70 zł</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, color: "var(--fg-4)" }}>
            <span className="kp-mono" style={{ fontSize: 11 }}>$ ls -la subjects/ → {subjects?.length ?? 8} aktywnych przedmiotów</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span className="kp-mono" style={{ fontSize: 11 }}>aktualizacja co 60s</span>
          </div>
        </div>
      </section>

      {/* ── Top tutors ───────────────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "var(--surface-2)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, gap: 24 }}>
            <div>
              <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// ranking · top_tutors.csv</div>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", letterSpacing: "-0.04em", fontWeight: 600, fontFamily: "var(--font-display)" }}>
                Korepetytorzy<br />
                <span style={{ color: "var(--fg-3)" }}>z najwyższą oceną.</span>
              </h2>
            </div>
            <Link href="/tutors" className="kp-nav-link" style={{ whiteSpace: "nowrap", fontSize: 13, flexShrink: 0 }}>
              Cały ranking →
            </Link>
          </div>

          {(!featured || featured.length === 0) ? (
            <EmptyTutors />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {featured.map((t, i) => (
                <Link key={t.user_id} href={`/tutors/${t.user_id}`} className="kp-card kp-card-hover" style={{
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  textDecoration: "none",
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Avatar src={t.profiles.avatar_url} name={t.profiles.full_name} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}>{t.profiles.full_name}</div>
                      <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                        {t.city ?? "Online"} · {(t as any).years_experience ?? "—"} lat
                      </div>
                    </div>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 8px",
                      background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                      color: "var(--accent-fg)",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}>
                      ★ Top {i + 1}%
                    </span>
                  </div>
                  {t.headline && (
                    <p style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.45, paddingLeft: 12, borderLeft: "2px solid var(--accent-soft)" }}>
                      "{t.headline}"
                    </p>
                  )}
                  <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--fg-3)" }}>
                      ★ <span className="kp-mono" style={{ fontWeight: 600, color: "var(--fg)" }}>{Number(t.rating_avg).toFixed(1)}</span>
                      <span style={{ color: "var(--fg-4)" }}> ({t.rating_count})</span>
                    </span>
                    <span className="kp-mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>
                      {formatMoney(t.hourly_rate, t.currency)}<span style={{ fontSize: 11, color: "var(--fg-4)", fontWeight: 400 }}> / h</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "var(--surface)" }}>
        <div className="container">
          <div style={{ marginBottom: 56 }}>
            <div className="kp-eyebrow" style={{ marginBottom: 12 }}>// proces · onboarding.flow</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1, fontFamily: "var(--font-display)" }}>
              Trzy kroki.<br />
              <span style={{ color: "var(--fg-3)" }}>Pięć minut.</span> Pierwsza lekcja jutro.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }}>
            {/* Timeline line */}
            <div style={{ position: "absolute", top: 28, left: "8%", right: "8%", height: 1, background: "var(--border)", zIndex: 0 }}>
              {[0, 50, 100].map((p) => (
                <div key={p} style={{ position: "absolute", left: `${p}%`, top: -3, width: 7, height: 7, borderRadius: "50%", background: "var(--fg)", transform: "translateX(-50%)" }} />
              ))}
            </div>

            {STEPS.map((s, i) => (
              <div key={s.n} style={{ position: "relative", padding: "0 24px", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24, paddingRight: 16, background: "var(--surface)" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 56, height: 56, borderRadius: 12,
                    background: "var(--surface)", border: "1px solid var(--border)",
                    fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 500,
                    boxShadow: "var(--shadow-sm)", color: "var(--fg)",
                  }}>
                    {s.n}
                  </span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em", marginBottom: 10, fontFamily: "var(--font-display)", color: "var(--fg)" }}>{s.title}</div>
                <p style={{ fontSize: 14, color: "var(--fg-3)", lineHeight: 1.55, marginBottom: 16, maxWidth: 300 }}>{s.body}</p>
                <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
                  czas: {s.time} · {s.tech}
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--surface-2)",
          }}>
            {TRUST_ITEMS.map(({ icon, title, body }, i) => (
              <div key={i} style={{
                padding: 20,
                borderRight: i < 3 ? "1px solid var(--border)" : "0",
                background: "var(--surface)",
              }}>
                <span style={{
                  display: "inline-flex", width: 32, height: 32, borderRadius: 8,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  alignItems: "center", justifyContent: "center", marginBottom: 12, color: "var(--fg)",
                }}>{icon}</span>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4, color: "var(--fg)" }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials + CTA ───────────────────────────────── */}
      <section style={{ padding: "80px 0", background: "var(--surface)", position: "relative", overflow: "hidden" }}>
        <div className="kp-aurora" style={{ animation: "kpAurora 14s ease-in-out infinite" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Testimonials */}
          <div style={{ marginBottom: 64 }}>
            <div className="kp-eyebrow" style={{ marginBottom: 24, textAlign: "center" }}>// głosy uczniów · testimonials.json</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="kp-card" style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transform: `rotate(${(i - 1) * 0.6}deg)`,
                }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(n => <span key={n} style={{ color: "var(--fg)", fontSize: 13 }}>★</span>)}
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.5, letterSpacing: "-0.01em", color: "var(--fg)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    "{t.quote}"
                  </p>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <span className="kp-avatar" style={{ fontSize: 10 }}>{t.initials}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{t.who}</div>
                      <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>{t.what}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="kp-card" style={{
            padding: 0,
            overflow: "hidden",
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 60%, #2D3672 100%)",
            color: "var(--accent-fg)",
            borderColor: "var(--accent-2)",
            boxShadow: "0 32px 64px -12px rgba(93,107,181,0.55), 0 8px 24px rgba(26,31,58,0.15)",
            position: "relative",
          }}>
            {/* Terminal bar */}
            <div style={{
              display: "flex", alignItems: "center", padding: "12px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.08)", gap: 8,
            }}>
              <span style={{ display: "flex", gap: 6 }}>
                {[1,2,3].map(i => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />)}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 12 }}>
                ~/korepetytorzy &gt; ./start.sh
              </span>
              <span className="kp-mono" style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>● gotowe za ~2 min</span>
            </div>

            {/* Background glyph */}
            <div style={{
              position: "absolute", right: -40, bottom: -80,
              fontFamily: "var(--font-display)", fontSize: 380, fontWeight: 600, lineHeight: 1,
              color: "rgba(255,255,255,0.04)", letterSpacing: "-0.06em",
              pointerEvents: "none", userSelect: "none",
            }}>K</div>

            <div style={{ padding: "56px 56px 48px", position: "relative", display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>// gotowy?</div>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1, marginBottom: 18, fontFamily: "var(--font-display)" }}>
                  Pierwsza lekcja —<br />jeszcze dziś.
                </h2>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 440, marginBottom: 28, lineHeight: 1.55 }}>
                  Dołącz do 30 102 uczniów, którzy uczą się szybciej niż w szkole. Bez subskrypcji, bez ukrytych opłat.
                </p>
                <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                  <Link href="/tutors" className="kp-btn kp-btn-lg" style={{ background: "var(--surface)", color: "var(--fg)", borderColor: "var(--surface)" }}>
                    Znajdź korepetytora →
                  </Link>
                  <Link href="/register" className="kp-btn kp-btn-lg" style={{ background: "transparent", color: "var(--accent-fg)", borderColor: "rgba(255,255,255,0.2)" }}>
                    Zostań korepetytorem
                  </Link>
                </div>
                <div style={{ display: "inline-flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,0.5)", flexWrap: "wrap" }}>
                  {["bez subskrypcji", "płatność po lekcji", "darmowa rejestracja"].map(t => (
                    <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>✓ {t}</span>
                  ))}
                </div>
              </div>

              {/* Email card */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div className="kp-card" style={{ padding: 20, minWidth: 280, transform: "rotate(1.5deg)" }}>
                  <div className="kp-eyebrow" style={{ marginBottom: 12 }}>// szybki start</div>
                  <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 14, color: "var(--fg)" }}>Wyślij sobie link do startu</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <input className="kp-input" placeholder="ty@email.pl" style={{ flex: 1 }} />
                    <button className="kp-btn kp-btn-primary">Wyślij</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--fg-3)" }}>
                    <span className="kp-pulse kp-badge-dot" style={{ background: "#16A34A" }} />
                    Dołączyło dziś <span className="kp-mono" style={{ color: "var(--fg)", fontWeight: 600 }}>+ 142 osoby</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ── Static data ───────────────────────────────────────────── */
const UNIVERSITIES = [
  "Politechnika Warszawska", "UJ", "UW", "AGH", "SGGW",
  "UAM Poznań", "PWr", "Akademia Leona Koźmińskiego", "UMK Toruń", "SGH",
];

const FALLBACK_SUBJECTS = [
  { name: "Fizyka", slug: "fizyka" },
  { name: "Chemia", slug: "chemia" },
  { name: "Informatyka", slug: "informatyka" },
  { name: "Biologia", slug: "biologia" },
  { name: "Język polski", slug: "polski" },
  { name: "Angielski", slug: "angielski" },
  { name: "Język niemiecki", slug: "niemiecki" },
];

const STEPS = [
  { n: "01", title: "Wybierz korepetytora", body: "Filtruj po przedmiocie, cenie, opiniach i regionie. Otwórz profil i decyduj świadomie.", time: "~ 90s", tech: "bez logowania" },
  { n: "02", title: "Zarezerwuj termin", body: "Kliknij wolny slot z kalendarza. Płatność trafia do bezpiecznego depozytu Stripe.", time: "~ 60s", tech: "Stripe Connect" },
  { n: "03", title: "Ucz się", body: "Dołącz do lekcji online jednym kliknięciem albo spotkaj się stacjonarnie.", time: "—", tech: "Google Meet / IRL" },
];

const TRUST_ITEMS = [
  { icon: "🛡", title: "Płatność po lekcji", body: "Środki uwalniają się dopiero po potwierdzeniu zajęć." },
  { icon: "⚡", title: "Bez subskrypcji", body: "Płacisz tylko za lekcje, które się odbyły." },
  { icon: "✦", title: "Gwarancja jakości", body: "Pierwsza lekcja niezadowalająca? Zwracamy 100%." },
  { icon: "✓", title: "Weryfikacja w 24h", body: "Każdy korepetytor sprawdzony pod kątem doświadczenia." },
];

const TESTIMONIALS = [
  { quote: "Zdałam maturę rozszerzoną z matematyki na 92%. Anna wytłumaczyła mi w 6 miesięcy to, czego nie zrozumiałam przez 3 lata liceum.", who: "Julia, 19 lat", what: "→ studia na PW", initials: "JS" },
  { quote: "Tomasz przeprowadził mnie przez cały bootcamp i pierwszy projekt. Po pół roku dostałem ofertę juniora.", who: "Marek, 24 lata", what: "→ developer", initials: "MN" },
  { quote: "Native speaker, który naprawdę słucha. Po roku zdałam IELTS 7.5.", who: "Olivia, 22 lata", what: "→ Erasmus Wiedeń", initials: "OL" },
];

/* ── Hero booking card (static demo) ───────────────────────── */
function HeroBookingCard() {
  const slots = ["09:00", "10:30", "14:00", "16:00", "17:30", "19:00"];
  const days = [
    { d: "Pon", n: "27" }, { d: "Wt", n: "28" },
    { d: "Śr", n: "29" }, { d: "Czw", n: "30", active: true },
    { d: "Pt", n: "01" }, { d: "Sob", n: "02" }, { d: "Nie", n: "03" },
  ];

  return (
    <div className="kp-card" style={{ boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
      {/* Window chrome */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)", gap: 8 }}>
        <span style={{ display: "flex", gap: 6 }}>
          {[1,2,3].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border-strong)" }} />)}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-4)", marginLeft: 8 }}>
          korepetytorzy.pl/anna-kowalska
        </span>
        <span className="kp-badge" style={{ marginLeft: "auto", fontSize: 10, height: 20 }}>
          <span className="kp-badge-dot kp-pulse" style={{ background: "#16A34A" }} />
          online
        </span>
      </div>

      {/* Tutor row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
        <span className="kp-avatar kp-avatar-lg">AK</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}>Anna Kowalska</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>Matematyka · matura · olimpiady</div>
        </div>
        <span style={{ fontSize: 12, color: "var(--fg)" }}>★ <span className="kp-mono" style={{ fontWeight: 600 }}>4.9</span> <span style={{ color: "var(--fg-4)" }}>(147)</span></span>
      </div>

      {/* Week strip */}
      <div style={{ padding: "16px 18px 8px" }}>
        <div className="kp-eyebrow" style={{ marginBottom: 10 }}>// kwiecień 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {days.map((d, i) => (
            <div key={i} style={{
              padding: "8px 0 6px", textAlign: "center",
              border: `1px solid ${d.active ? "var(--fg)" : "var(--border)"}`,
              borderRadius: 6,
              background: d.active ? "var(--fg)" : "var(--surface)",
              color: d.active ? "var(--accent-fg)" : "var(--fg)",
            }}>
              <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>{d.d}</div>
              <div className="kp-mono" style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{d.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slots */}
      <div style={{ padding: "10px 18px 16px" }}>
        <div className="kp-eyebrow" style={{ marginBottom: 10 }}>// 6 wolnych slotów</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {slots.map((s, i) => (
            <div key={s} className="kp-mono" style={{
              height: 38, borderRadius: 6,
              border: `1px solid ${i === 3 ? "var(--fg)" : "var(--border)"}`,
              background: i === 3 ? "var(--fg)" : "var(--surface)",
              color: i === 3 ? "var(--accent-fg)" : "var(--fg-2)",
              fontSize: 12, fontWeight: 500,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{s}</div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderTop: "1px solid var(--border)",
        background: "var(--surface-2)",
      }}>
        <div>
          <div className="kp-mono" style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)" }}>120 zł</div>
          <div style={{ fontSize: 10, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>60 MIN · STRIPE</div>
        </div>
        <Link href="/tutors" className="kp-btn kp-btn-primary kp-btn-sm">Zarezerwuj →</Link>
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────── */
function EmptyTutors() {
  return (
    <div className="kp-card" style={{ padding: 48, textAlign: "center", color: "var(--fg-3)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, marginBottom: 8 }}>// brak danych</div>
      <p style={{ fontSize: 15, color: "var(--fg)" }}>Jeszcze tu pusto.</p>
      <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>Gdy korepetytorzy opublikują profile, pojawią się tutaj.</p>
    </div>
  );
}
