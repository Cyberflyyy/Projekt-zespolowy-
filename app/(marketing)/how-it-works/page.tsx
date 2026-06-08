import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Jak to działa" };

const studentSteps = [
  { n: "01", title: "Znajdź korepetytora", body: "Filtruj po przedmiocie, cenie, poziomie i formie lekcji. Otwórz profil, który Ci pasuje." },
  { n: "02", title: "Wybierz termin", body: "Wybierz wolny slot z kalendarza dostępności." },
  { n: "03", title: "Zapłać bezpiecznie", body: "Płatność odbywa się przez Stripe. Rezerwacja zostaje potwierdzona automatycznie." },
  { n: "04", title: "Ucz się", body: "Dołącz do lekcji online lub spotkaj się osobiście. Zarządzaj rezerwacjami w swoim panelu." },
];

const tutorSteps = [
  { n: "01", title: "Stwórz profil", body: "Opisz doświadczenie, dodaj zdjęcie i opublikuj ofertę." },
  { n: "02", title: "Ustaw dostępność", body: "Wybierz sloty, w których możesz prowadzić zajęcia." },
  { n: "03", title: "Podłącz Stripe", body: "Aktywuj konto Stripe Connect, aby odbierać wypłaty za lekcje." },
  { n: "04", title: "Ucz i zarabiaj", body: "Platforma pobiera prowizję — reszta trafia prosto na Twoje konto." },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <div style={{ background: "var(--surface)", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
          <div className="kp-eyebrow" style={{ marginBottom: 12 }}>// 06 — proces</div>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            marginBottom: 8,
            fontFamily: "var(--font-display)",
            color: "var(--fg)",
          }}>
            Prosty sposób na dobre lekcje.
          </h1>
          <p style={{ fontSize: 15, color: "var(--fg-3)", maxWidth: 580, marginBottom: 48, lineHeight: 1.6 }}>
            Platforma obsługuje rezerwacje, płatności i wypłaty. Ty skup się na nauce albo uczeniu.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            {/* Uczniowie */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span style={{
                  display: "inline-flex", width: 24, height: 24,
                  alignItems: "center", justifyContent: "center",
                  borderRadius: 6,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--fg-2)",
                  fontSize: 13,
                }}>👤</span>
                <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--fg)" }}>
                  Dla uczniów
                </h2>
              </div>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {studentSteps.map((s) => (
                  <li key={s.n} className="kp-card" style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start" }}>
                    <span className="kp-mono" style={{ fontSize: 12, color: "var(--fg-4)", marginTop: 2, minWidth: 24 }}>{s.n}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}>{s.title}</div>
                      <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4, lineHeight: 1.55 }}>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/tutors" className="kp-btn kp-btn-primary" style={{ marginTop: 20 }}>
                Znajdź korepetytora →
              </Link>
            </div>

            {/* Korepetytorzy */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span style={{
                  display: "inline-flex", width: 24, height: 24,
                  alignItems: "center", justifyContent: "center",
                  borderRadius: 6,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--fg-2)",
                  fontSize: 13,
                }}>⊞</span>
                <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--fg)" }}>
                  Dla korepetytorów
                </h2>
              </div>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {tutorSteps.map((s) => (
                  <li key={s.n} className="kp-card" style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start" }}>
                    <span className="kp-mono" style={{ fontSize: 12, color: "var(--fg-4)", marginTop: 2, minWidth: 24 }}>{s.n}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}>{s.title}</div>
                      <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4, lineHeight: 1.55 }}>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/register" className="kp-btn kp-btn-secondary" style={{ marginTop: 20 }}>
                Załóż konto korepetytora
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
