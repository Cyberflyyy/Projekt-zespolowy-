import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "var(--surface)" }}>
      {/* Big wordmark */}
      <div style={{ padding: "32px 0 0", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div className="container">
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 12vw, 11rem)",
            fontWeight: 600,
            letterSpacing: "-0.06em",
            lineHeight: 0.85,
            paddingBottom: 8,
            background: "linear-gradient(180deg, var(--fg) 0%, var(--accent) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}>
            Korepetytorzy<span style={{ color: "var(--accent)", WebkitTextFillColor: "var(--accent)" }}>.</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container" style={{ padding: "40px 1.5rem 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 48 }}>
          {/* Brand column */}
          <div>
            <span className="kp-nav-brand" style={{ marginBottom: 12, display: "inline-flex" }}>
              <span className="kp-logo-mark">K</span>
              Korepetytorzy
            </span>
            <p style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 14, lineHeight: 1.55, maxWidth: 280 }}>
              Marketplace łączący uczniów z korepetytorami. Rezerwuj lekcje i płać online.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 999,
                fontSize: 11, color: "var(--fg-3)", width: "fit-content",
              }}>
                <span className="kp-badge-dot kp-pulse" style={{ background: "#16A34A" }} />
                <span style={{ fontFamily: "var(--font-mono)" }}>Wszystkie systemy działają · 99.98%</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
                Stripe Connect · Google Meet · RODO compliant
              </div>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <div className="kp-eyebrow" style={{ marginBottom: 16 }}>// {title}</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="kp-nav-link" style={{ fontSize: 13 }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 1.5rem", fontSize: 12, color: "var(--fg-4)" }}>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} Korepetytorzy sp. z o.o. · v2.4.0
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
            <span>🌐 Polski (PL)</span>
            <span>·</span>
            <span>Made with care in Wrocław</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

const FOOTER_COLS = [
  {
    title: "Platforma",
    links: [
      { label: "Korepetytorzy", href: "/tutors" },
      { label: "Jak to działa", href: "/how-it-works" },
      { label: "Cennik", href: "#" },
      { label: "Bezpieczeństwo", href: "#" },
    ],
  },
  {
    title: "Konto",
    links: [
      { label: "Zaloguj się", href: "/login" },
      { label: "Zarejestruj się", href: "/register" },
      { label: "Zostań korepetytorem", href: "/register" },
      { label: "Pomoc", href: "#" },
    ],
  },
  {
    title: "Społeczność",
    links: [
      { label: "Blog", href: "#" },
      { label: "Newsletter", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Kariera", href: "#" },
    ],
  },
  {
    title: "Prawne",
    links: [
      { label: "Regulamin", href: "#" },
      { label: "Prywatność", href: "#" },
      { label: "RODO", href: "#" },
      { label: "Kontakt", href: "#" },
    ],
  },
];
