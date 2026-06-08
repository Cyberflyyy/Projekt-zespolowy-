import { signOutAction } from "@/lib/auth/actions";

export default function BlockedPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center text-center">
      <div className="kp-eyebrow" style={{ marginBottom: 12 }}>// konto · blocked</div>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, letterSpacing: "-0.045em", color: "var(--fg)" }}>
        Konto zablokowane
      </h1>
      <p style={{ marginTop: 12, maxWidth: "42ch", color: "var(--fg-3)", fontSize: 15 }}>
        Twoje konto zostało tymczasowo zablokowane przez administratora. Skontaktuj się z pomocą techniczną.
      </p>
      <form action={signOutAction} style={{ marginTop: 24 }}>
        <button className="kp-btn kp-btn-secondary kp-btn-lg">Wyloguj się</button>
      </form>
    </main>
  );
}
