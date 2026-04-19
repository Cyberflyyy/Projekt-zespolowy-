import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container py-10 grid gap-8 md:grid-cols-4">
        <div>
          <p className="font-serif text-lg font-semibold text-ink">Korepetytorzy</p>
          <p className="mt-2 text-sm text-ink-muted max-w-xs">
            Marketplace łączący uczniów i korepetytorów. Rezerwuj lekcje i płać online.
          </p>
        </div>
        <FooterCol title="Platforma" links={[
          { label: "Korepetytorzy", href: "/tutors" },
          { label: "Jak to działa", href: "/how-it-works" },
        ]} />
        <FooterCol title="Konto" links={[
          { label: "Zaloguj się", href: "/login" },
          { label: "Zarejestruj się", href: "/register" },
        ]} />
        <FooterCol title="Prawo" links={[
          { label: "Regulamin", href: "#" },
          { label: "Prywatność", href: "#" },
        ]} />
      </div>
      <div className="border-t border-line">
        <div className="container flex items-center justify-between py-4 text-xs text-ink-subtle">
          <span>© {new Date().getFullYear()} Korepetytorzy</span>
          <span>Made with care.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-ink-subtle mb-3">{title}</p>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-ink-muted hover:text-ink">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
