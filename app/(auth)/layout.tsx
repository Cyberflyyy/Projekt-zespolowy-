import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--surface-2)" }}>
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="kp-nav-brand">
            <span className="kp-logo-mark">K</span>
            Korepetytorzy
          </Link>
          <Link href="/tutors" className="kp-nav-link">
            Przeglądaj korepetytorów
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
