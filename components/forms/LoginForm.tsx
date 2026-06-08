"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction, type AuthState } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAction, undefined);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="kp-card p-8" style={{ boxShadow: "var(--shadow-md)" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// konto · auth.login</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: 4 }}>
          Zaloguj się
        </h1>
        <p style={{ fontSize: 13, color: "var(--fg-3)" }}>
          Witaj z powrotem. Wpisz dane konta, aby kontynuować.
        </p>
      </div>

      <input type="hidden" name="next" value={next} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="email" style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="kp-input" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="password" style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>Hasło</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="kp-input" />
        </div>
      </div>

      {state?.error && (
        <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 6, fontSize: 13, color: "var(--danger)" }}>
          {state.error}
        </div>
      )}

      <button type="submit" disabled={pending} className="kp-btn kp-btn-primary kp-btn-lg" style={{ width: "100%", marginBottom: 16 }}>
        {pending ? "Logowanie..." : "Zaloguj się"}
      </button>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--fg-3)" }}>
        Nie masz konta?{" "}
        <Link href="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
          Zarejestruj się
        </Link>
      </p>
    </form>
  );
}
