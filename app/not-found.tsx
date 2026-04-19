import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-widest text-ink-subtle">404</p>
      <h1 className="mt-3 text-display font-serif">Strona nie istnieje</h1>
      <p className="mt-3 max-w-prose text-ink-muted">
        Nie mogliśmy znaleźć tego, czego szukasz. Być może link jest nieaktualny.
      </p>
      <Link href="/" className="notion-btn-primary mt-6">
        Wróć na stronę główną
      </Link>
    </main>
  );
}
