import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-line bg-canvas">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="font-serif text-lg font-semibold text-ink">
            Korepetytorzy
          </Link>
          <Link href="/tutors" className="text-sm text-ink-muted hover:text-ink">
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
