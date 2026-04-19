import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-widest text-ink-subtle">403</p>
      <h1 className="mt-3 font-serif text-display">Brak dostępu</h1>
      <p className="mt-3 max-w-prose text-ink-muted">
        Nie masz uprawnień do tej strony.
      </p>
      <Link href="/" className="notion-btn-primary mt-6">Wróć na stronę główną</Link>
    </main>
  );
}
