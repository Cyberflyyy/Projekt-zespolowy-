"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/auth/actions";
import { cn } from "@/lib/utils/cn";

const ROLES = [
  { value: "student", label: "Szukam korepetytora", sub: "Rezerwuj lekcje i zarządzaj nimi w panelu ucznia." },
  { value: "tutor", label: "Chcę uczyć", sub: "Opublikuj profil, ustal dostępność i przyjmuj płatności." },
] as const;

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUpAction, undefined);
  const [role, setRole] = useState<"student" | "tutor">("student");

  return (
    <form action={action} className="notion-card p-8 space-y-6">
      <div>
        <h1 className="font-serif text-heading-1">Utwórz konto</h1>
        <p className="mt-1 text-sm text-ink-muted">Wybierz rolę i uzupełnij dane.</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {ROLES.map((r) => (
          <label
            key={r.value}
            className={cn(
              "cursor-pointer rounded-md border p-3 transition-colors",
              role === r.value ? "border-ink bg-surface" : "border-line hover:bg-surface",
            )}
          >
            <input
              type="radio"
              name="role"
              value={r.value}
              checked={role === r.value}
              onChange={() => setRole(r.value)}
              className="sr-only"
            />
            <div className="text-sm font-medium text-ink">{r.label}</div>
            <div className="text-xs text-ink-muted mt-0.5">{r.sub}</div>
          </label>
        ))}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="full_name" className="text-sm text-ink">Imię i nazwisko</label>
        <input id="full_name" name="full_name" type="text" autoComplete="name" required className="notion-input" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm text-ink">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="notion-input" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm text-ink">Hasło</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="notion-input" />
        <p className="text-xs text-ink-subtle">Minimum 8 znaków.</p>
      </div>

      {state?.error && (
        <p className="text-sm text-accent-red bg-accent-red-soft px-3 py-2 rounded">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="notion-btn-primary w-full">
        {pending ? "Tworzenie konta..." : "Utwórz konto"}
      </button>

      <p className="text-sm text-ink-muted text-center">
        Masz już konto?{" "}
        <Link href="/login" className="notion-link">Zaloguj się</Link>
      </p>
    </form>
  );
}
