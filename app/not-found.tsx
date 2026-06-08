import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center text-center">
      <div className="kp-eyebrow" style={{ marginBottom: 12 }}>404</div>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, letterSpacing: "-0.045em", color: "var(--fg)" }}>
        Strona nie istnieje
      </h1>
      <p style={{ marginTop: 12, maxWidth: "42ch", color: "var(--fg-3)", fontSize: 15 }}>
        Nie mogliśmy znaleźć tego, czego szukasz. Być może link jest nieaktualny.
      </p>
      <Link href="/" className="kp-btn kp-btn-primary kp-btn-lg" style={{ marginTop: 24 }}>
        Wróć na stronę główną
      </Link>
    </main>
  );
}
