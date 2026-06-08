import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/auth/roles";
import type { Profile } from "@/types/database";
import { Avatar } from "@/components/ui/Avatar";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();
    profile = data;
  }

  return (
    <header
      className="sticky top-0 z-30 border-b border-line"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        height: 60,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container flex items-center justify-between" style={{ height: "100%" }}>

        {/* Logo + nav */}
        <div className="flex items-center" style={{ gap: 24 }}>
          <Link href="/" className="kp-nav-brand">
            <span className="kp-logo-mark">K</span>
            Korepetytorzy
          </Link>

          <div style={{ width: 1, height: 18, background: "var(--border)" }} />

          <nav className="hidden md:flex items-center" style={{ gap: 4 }}>
            <Link
              href="/tutors"
              className="kp-nav-link"
              style={{ padding: "4px 8px", borderRadius: 6 }}
            >
              Korepetytorzy
            </Link>
            <Link
              href="/how-it-works"
              className="kp-nav-link"
              style={{ padding: "4px 8px", borderRadius: 6 }}
            >
              Jak to działa
            </Link>
            <span
              className="kp-nav-link"
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                cursor: "default",
              }}
            >
              Dla firm
              <span style={{
                fontSize: 9,
                padding: "1px 5px",
                background: "var(--fg)",
                color: "var(--accent-fg)",
                borderRadius: 3,
                fontFamily: "var(--font-mono)",
                letterSpacing: 0,
              }}>NEW</span>
            </span>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center" style={{ gap: 8 }}>
          {/* Search hint — hidden on mobile */}
          <div
            className="hidden lg:flex items-center"
            style={{
              gap: 8,
              padding: "0 10px",
              height: 32,
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--surface)",
              color: "var(--fg-4)",
              fontSize: 12,
              minWidth: 200,
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Szukaj korepetytora…</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
              <span className="kp-kbd">⌘</span>
              <span className="kp-kbd">K</span>
            </span>
          </div>

          {profile ? (
            <Link
              href={ROLE_HOME[profile.role]}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 6 }}
              className="kp-nav-link"
            >
              <Avatar src={profile.avatar_url} name={profile.full_name ?? profile.email} size={28} />
              <span className="hidden sm:inline" style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
                {profile.full_name ?? profile.email}
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="kp-nav-link" style={{ padding: "4px 8px" }}>
                Zaloguj
              </Link>
              <Link href="/register" className="kp-btn kp-btn-primary kp-btn-sm">
                Zarejestruj się →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

