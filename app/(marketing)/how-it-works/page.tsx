import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Jak to działa" };

const studentSteps = [
  { t: "Znajdź korepetytora", d: "Filtruj po przedmiocie, cenie, poziomie i formie lekcji. Otwórz profil, który Ci pasuje." },
  { t: "Wybierz termin", d: "Wybierz wolny slot z kalendarza dostępności." },
  { t: "Zapłać bezpiecznie", d: "Płatność odbywa się przez Stripe. Rezerwacja zostaje potwierdzona automatycznie." },
  { t: "Ucz się", d: "Dołącz do lekcji online lub spotkaj się osobiście. Zarządzaj rezerwacjami w swoim panelu." },
];

const tutorSteps = [
  { t: "Stwórz profil", d: "Opisz doświadczenie, dodaj zdjęcie i opublikuj ofertę." },
  { t: "Ustaw dostępność", d: "Wybierz sloty, w których możesz prowadzić zajęcia." },
  { t: "Podłącz Stripe", d: "Aktywuj konto Stripe Connect, aby odbierać wypłaty za lekcje." },
  { t: "Ucz i zarabiaj", d: "Platforma pobiera prowizję — reszta trafia prosto na Twoje konto." },
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <section className="container py-20 max-w-content">
        <p className="text-xs uppercase tracking-widest text-ink-subtle">Jak to działa</p>
        <h1 className="mt-3 font-serif text-display text-ink">
          Prosty sposób na dobre lekcje.
        </h1>
        <p className="mt-4 max-w-prose text-lg text-ink-muted">
          Platforma obsługuje rezerwacje, płatności i wypłaty. Ty skup się na nauce albo uczeniu.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-heading-1">Dla uczniów</h2>
            <ol className="mt-6 space-y-5">
              {studentSteps.map((s, i) => (
                <li key={i} className="notion-card p-5">
                  <p className="font-serif text-heading-3 text-ink-faint">0{i + 1}</p>
                  <p className="mt-1 font-medium text-ink">{s.t}</p>
                  <p className="mt-1 text-sm text-ink-muted">{s.d}</p>
                </li>
              ))}
            </ol>
            <Link href="/tutors" className="notion-btn-primary mt-6">Znajdź korepetytora</Link>
          </div>

          <div>
            <h2 className="font-serif text-heading-1">Dla korepetytorów</h2>
            <ol className="mt-6 space-y-5">
              {tutorSteps.map((s, i) => (
                <li key={i} className="notion-card p-5">
                  <p className="font-serif text-heading-3 text-ink-faint">0{i + 1}</p>
                  <p className="mt-1 font-medium text-ink">{s.t}</p>
                  <p className="mt-1 text-sm text-ink-muted">{s.d}</p>
                </li>
              ))}
            </ol>
            <Link href="/register" className="notion-btn-secondary mt-6">Załóż konto korepetytora</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
