"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction, type AuthState } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAction, undefined);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="notion-card p-8 space-y-6">
      <div>
        <h1 className="font-serif text-heading-1">Zaloguj się</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Witaj z powrotem. Wpisz dane konta, aby kontynuować.
        </p>
      </div>

      <input type="hidden" name="next" value={next} />

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm text-ink">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="notion-input" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm text-ink">Hasło</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="notion-input" />
      </div>

      {state?.error && (
        <p className="text-sm text-accent-red bg-accent-red-soft px-3 py-2 rounded">{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="notion-btn-primary w-full">
        {pending ? "Logowanie..." : "Zaloguj się"}
      </button>

      <p className="text-sm text-ink-muted text-center">
        Nie masz konta?{" "}
        <Link href="/register" className="notion-link">Zarejestruj się</Link>
      </p>
    </form>
  );
}
