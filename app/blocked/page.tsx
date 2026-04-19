import { signOutAction } from "@/lib/auth/actions";

export default function BlockedPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="font-serif text-display text-ink">Konto zablokowane</h1>
      <p className="mt-3 max-w-prose text-ink-muted">
        Twoje konto zostało tymczasowo zablokowane przez administratora. Skontaktuj się z pomocą techniczną.
      </p>
      <form action={signOutAction} className="mt-6">
        <button className="notion-btn-secondary">Wyloguj się</button>
      </form>
    </main>
  );
}
