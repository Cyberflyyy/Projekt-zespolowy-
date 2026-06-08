"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/auth/actions";

const ROLES = [
  { value: "student", label: "Szukam korepetytora", sub: "Rezerwuj lekcje i zarządzaj nimi w panelu ucznia." },
  { value: "tutor", label: "Chcę uczyć", sub: "Opublikuj profil, ustal dostępność i przyjmuj płatności." },
] as const;

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUpAction, undefined);
  const [role, setRole] = useState<"student" | "tutor">("student");

  return (
    <form action={action} className="kp-card p-8" style={{ boxShadow: "var(--shadow-md)" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// konto · auth.register</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: 4 }}>
          Utwórz konto
        </h1>
        <p style={{ fontSize: 13, color: "var(--fg-3)" }}>Wybierz rolę i uzupełnij dane.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {ROLES.map((r) => (
          <label
            key={r.value}
            style={{
              cursor: "pointer",
              borderRadius: 8,
              border: `1px solid ${role === r.value ? "var(--accent)" : "var(--border)"}`,
              padding: "10px 14px",
              background: role === r.value ? "var(--accent-tint)" : "var(--surface)",
              transition: "all 120ms",
            }}
          >
            <input
              type="radio"
              name="role"
              value={r.value}
              checked={role === r.value}
              onChange={() => setRole(r.value)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{r.label}</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{r.sub}</div>
          </label>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="full_name" style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>Imię i nazwisko</label>
          <input id="full_name" name="full_name" type="text" autoComplete="name" required className="kp-input" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="email" style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="kp-input" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="password" style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>Hasło</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="kp-input" />
          <p style={{ fontSize: 11, color: "var(--fg-4)" }}>Minimum 8 znaków.</p>
        </div>
      </div>

      {state?.error && (
        <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 6, fontSize: 13, color: "var(--danger)" }}>
          {state.error}
        </div>
      )}

      <button type="submit" disabled={pending} className="kp-btn kp-btn-primary kp-btn-lg" style={{ width: "100%", marginBottom: 16 }}>
        {pending ? "Tworzenie konta..." : "Utwórz konto"}
      </button>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--fg-3)" }}>
        Masz już konto?{" "}
        <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
          Zaloguj się
        </Link>
      </p>
    </form>
  );
}
