import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/Avatar";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";
import { formatMoney } from "@/lib/utils/format";
import type { Profile, TutorProfile, Subject } from "@/types/database";

type FeaturedRow = TutorProfile & {
  profiles: Pick<Profile, "full_name" | "avatar_url">;
};

const SUBJECT_COLORS = [
  { bg: "bg-accent-blue-soft", text: "text-accent-blue", border: "border-accent-blue/20", dot: "bg-accent-blue" },
  { bg: "bg-accent-purple-soft", text: "text-accent-purple", border: "border-accent-purple/20", dot: "bg-accent-purple" },
  { bg: "bg-accent-green-soft", text: "text-accent-green", border: "border-accent-green/20", dot: "bg-accent-green" },
  { bg: "bg-accent-orange-soft", text: "text-accent-orange", border: "border-accent-orange/20", dot: "bg-accent-orange" },
  { bg: "bg-accent-teal-soft", text: "text-accent-teal", border: "border-accent-teal/20", dot: "bg-accent-teal" },
  { bg: "bg-accent-red-soft", text: "text-accent-red", border: "border-accent-red/20", dot: "bg-accent-red" },
  { bg: "bg-accent-yellow-soft", text: "text-accent-yellow", border: "border-accent-yellow/20", dot: "bg-accent-yellow" },
  { bg: "bg-accent-pink-soft", text: "text-accent-pink", border: "border-accent-pink/20", dot: "bg-accent-pink" },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("tutor_profiles")
    .select("user_id, headline, hourly_rate, currency, city, rating_avg, rating_count, profiles:profiles!inner(full_name, avatar_url)")
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

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden hero-gradient border-b border-line">
        {/* Background orbs */}
        <div className="orb w-[500px] h-[500px] bg-primary/30 -top-40 -right-20" />
        <div className="orb w-[350px] h-[350px] bg-accent-purple/25 top-20 -left-32" />
        <div className="orb w-[250px] h-[250px] bg-accent-teal/20 bottom-10 right-1/3" />

        <div className="container relative z-10 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div>
              {/* Badge */}
              <div
                className="animate-fade-up opacity-0"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="inline-flex items-center gap-2 rounded-pill bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary mb-6">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                  Nowe: natychmiastowe rezerwacje
                </span>
              </div>

              {/* Headline */}
              <div
                className="animate-fade-up opacity-0 delay-150"
                style={{ animationFillMode: "forwards" }}
              >
                <h1 className="text-display-lg text-ink leading-[1.08]">
                  Ucz się z korepetytorem,{" "}
                  <span className="gradient-text">
                    którego cenisz.
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div
                className="animate-fade-up opacity-0 delay-300"
                style={{ animationFillMode: "forwards" }}
              >
                <p className="mt-6 text-lg text-ink-muted max-w-prose leading-relaxed">
                  Przeglądaj zweryfikowane profile, wybierz termin i zapłać online.
                  Platforma zajmie się resztą — od potwierdzenia po wypłatę.
                </p>
              </div>

              {/* CTAs */}
              <div
                className="animate-fade-up opacity-0 delay-400 mt-8 flex flex-wrap gap-3"
                style={{ animationFillMode: "forwards" }}
              >
                <Link href="/tutors" className="notion-btn-primary text-base px-6 py-3">
                  Znajdź korepetytora
                </Link>
                <Link href="/register" className="notion-btn-secondary text-base px-6 py-3">
                  Zostań korepetytorem
                </Link>
              </div>

              {/* Stats */}
              <div
                className="animate-fade-up opacity-0 delay-500 mt-10 flex flex-wrap gap-x-8 gap-y-4"
                style={{ animationFillMode: "forwards" }}
              >
                {[
                  { n: "1 200+", label: "korepetytorów" },
                  { n: "30 000+", label: "lekcji / mies." },
                  { n: "4.9 ★", label: "średnia ocena" },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl font-bold text-ink tracking-tight">{s.n}</span>
                    <span className="text-sm text-ink-muted">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3D floating visual */}
            <div
              className="hidden lg:flex justify-center items-center animate-fade-in opacity-0 delay-300"
              style={{ animationFillMode: "forwards" }}
            >
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── Subjects ────────────────────────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="container py-20">
          <div
            className="animate-fade-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
              Przedmioty
            </p>
            <div className="mt-3 flex items-end justify-between">
              <h2 className="text-heading-1">Popularne kierunki nauki</h2>
              <Link href="/tutors" className="notion-link text-sm hidden sm:block">
                Zobacz wszystkie →
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(subjects ?? []).map((s, i) => {
              const c = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
              return (
                <Tilt3DCard key={s.id} intensity={10}>
                  <Link
                    href={`/tutors?subject=${s.slug}`}
                    className={`notion-card p-5 block border ${c.border} animate-fade-up opacity-0`}
                    style={{
                      animationFillMode: "forwards",
                      animationDelay: `${80 * i}ms`,
                    }}
                  >
                    <span className={`inline-block h-2 w-2 rounded-full ${c.dot} mb-3`} />
                    <p className={`text-[11px] uppercase tracking-widest font-semibold ${c.text}`}>
                      {s.category ?? "Przedmiot"}
                    </p>
                    <p className="mt-1 font-semibold text-ink">{s.name}</p>
                  </Link>
                </Tilt3DCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured tutors ──────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="container py-20">
          <div
            className="animate-fade-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">
              Polecani
            </p>
            <div className="mt-3 flex items-end justify-between">
              <h2 className="text-heading-1">Korepetytorzy z najwyższą oceną</h2>
              <Link href="/tutors" className="notion-link text-sm hidden sm:block">
                Zobacz wszystkich →
              </Link>
            </div>
          </div>

          {(!featured || featured.length === 0) ? (
            <div className="notion-card mt-8 p-12 text-center">
              <p className="text-heading-3 text-ink">Jeszcze tu pusto.</p>
              <p className="mt-2 text-sm text-ink-muted">
                Gdy korepetytorzy opublikują profile, pojawią się tutaj.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {featured.map((t, i) => (
                <Tilt3DCard key={t.user_id}>
                  <Link
                    href={`/tutors/${t.user_id}`}
                    className={`notion-card p-5 block animate-fade-up opacity-0`}
                    style={{
                      animationFillMode: "forwards",
                      animationDelay: `${100 * i}ms`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={t.profiles.avatar_url} name={t.profiles.full_name} size={44} />
                      <div>
                        <p className="font-semibold text-ink">{t.profiles.full_name}</p>
                        <p className="text-xs text-ink-muted">{t.city ?? "Online"}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-ink-muted line-clamp-2 min-h-[40px]">
                      {t.headline ?? "Korepetytor"}
                    </p>
                    <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-yellow bg-accent-yellow-soft px-2 py-1 rounded-pill">
                        ★ {Number(t.rating_avg).toFixed(1)}
                        <span className="text-ink-subtle font-normal">({t.rating_count})</span>
                      </span>
                      <span className="text-sm font-bold text-ink">
                        {formatMoney(t.hourly_rate, t.currency)}<span className="text-ink-muted font-normal"> / h</span>
                      </span>
                    </div>
                  </Link>
                </Tilt3DCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="bg-surface border-b border-line">
        <div className="container py-24">
          <div
            className="text-center mb-14 animate-fade-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-subtle">Jak to działa</p>
            <h2 className="mt-3 text-heading-1">Trzy kroki do nauki</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Wybierz korepetytora",
                d: "Przeglądaj profile, filtruj po przedmiocie, cenie i opiniach.",
                color: "bg-accent-blue-soft border-accent-blue/20",
                nColor: "text-accent-blue",
              },
              {
                n: "02",
                t: "Zarezerwuj termin",
                d: "Wybierz wolny slot z kalendarza i potwierdź płatność online.",
                color: "bg-accent-purple-soft border-accent-purple/20",
                nColor: "text-accent-purple",
              },
              {
                n: "03",
                t: "Ucz się",
                d: "Dołącz do lekcji online lub spotkaj się osobiście.",
                color: "bg-accent-green-soft border-accent-green/20",
                nColor: "text-accent-green",
              },
            ].map((s, i) => (
              <Tilt3DCard key={s.n} intensity={8}>
                <div
                  className={`${s.color} border rounded-xl p-8 animate-fade-up opacity-0`}
                  style={{
                    animationFillMode: "forwards",
                    animationDelay: `${150 * i}ms`,
                  }}
                >
                  <p className={`text-5xl font-black ${s.nColor} mb-4 tracking-tight`}>{s.n}</p>
                  <h3 className="text-heading-3 text-ink mb-2">{s.t}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{s.d}</p>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="container py-24">
        <div
          className="gradient-border rounded-2xl p-12 text-center animate-fade-up opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <h2 className="text-display text-ink">Zacznij uczyć się już dziś</h2>
          <p className="mt-4 text-lg text-ink-muted">
            Dołącz do tysięcy uczniów, którzy już znaleźli swojego korepetytora.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/tutors" className="notion-btn-primary text-base px-8 py-3">
              Znajdź korepetytora
            </Link>
            <Link href="/how-it-works" className="notion-btn-secondary text-base px-8 py-3">
              Jak to działa
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ── Hero 3D visual – floating "database card" ─────────────── */
function HeroVisual() {
  const ROWS = [
    { name: "Anna K.", subject: "Matematyka", rating: "4.9", price: "80 zł", c: "bg-accent-blue-soft text-accent-blue" },
    { name: "Piotr M.", subject: "Angielski", rating: "5.0", price: "90 zł", c: "bg-accent-green-soft text-accent-green" },
    { name: "Julia W.", subject: "Fizyka", rating: "4.8", price: "75 zł", c: "bg-accent-purple-soft text-accent-purple" },
    { name: "Marek S.", subject: "Chemia", rating: "4.7", price: "70 zł", c: "bg-accent-orange-soft text-accent-orange" },
  ];

  return (
    <div className="relative" style={{ perspective: "1100px" }}>
      {/* Shadow backdrop card */}
      <div
        className="absolute inset-0 rounded-2xl bg-primary/10 animate-float-slow"
        style={{ transform: "rotateX(6deg) rotateY(-10deg) translateZ(-28px) translate(18px, 14px)", filter: "blur(2px)" }}
      />

      {/* Main card */}
      <div
        className="relative w-[360px] rounded-2xl bg-canvas shadow-float border border-line overflow-hidden animate-float"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(6deg) rotateY(-10deg)" }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-line bg-surface">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-red/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-yellow/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-green/60" />
          <span className="ml-3 text-xs font-semibold text-ink-muted">Korepetytorzy — baza danych</span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-4 px-5 py-2.5 border-b border-line bg-surface/60 text-[11px] font-semibold text-ink-subtle uppercase tracking-wide">
          <span>Imię</span>
          <span>Przedmiot</span>
          <span>Ocena</span>
          <span>Cena/h</span>
        </div>

        {/* Data rows */}
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center gap-2 px-5 py-3 border-b border-line/60 text-sm hover:bg-surface/50 transition-colors"
          >
            <span className="font-medium text-ink truncate">{row.name}</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.c} truncate`}>
              {row.subject}
            </span>
            <span className="text-ink-muted">★ {row.rating}</span>
            <span className="font-semibold text-ink">{row.price}</span>
          </div>
        ))}

        {/* Add row hint */}
        <div className="px-5 py-3 text-xs text-ink-subtle flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Dodaj korepetytora
        </div>
      </div>

      {/* Floating badges */}
      <div
        className="absolute -top-5 -right-8 animate-bounce-subtle delay-200 glass shadow-pop rounded-pill px-3 py-2"
        style={{ transform: "translateZ(40px)" }}
      >
        <span className="text-xs font-bold text-accent-green flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
          Zweryfikowany korepetytor
        </span>
      </div>

      <div
        className="absolute -bottom-4 -left-8 animate-bounce-subtle delay-500 glass shadow-card rounded-pill px-3 py-2"
        style={{ transform: "translateZ(32px)" }}
      >
        <span className="text-xs font-bold text-accent-yellow flex items-center gap-1">
          ★ 4.9 / 5.0 · 312 ocen
        </span>
      </div>

      <div
        className="absolute top-1/2 -right-10 animate-bounce-subtle delay-300 glass shadow-card rounded-pill px-3 py-2"
        style={{ transform: "translateZ(24px)" }}
      >
        <span className="text-xs font-bold text-primary">
          💳 Płatność online
        </span>
      </div>
    </div>
  );
}
