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
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">

        {/* Logo + nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-black text-lg text-ink tracking-tight hover:opacity-80 transition-opacity"
          >
            {/* Airtable-style colorful logo mark */}
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-black shadow-card">
              K
            </span>
            Korepetytorzy
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm text-ink-muted">
            <Link
              href="/tutors"
              className="rounded-md px-3 py-1.5 hover:bg-surface hover:text-ink transition-colors font-medium"
            >
              Korepetytorzy
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-md px-3 py-1.5 hover:bg-surface hover:text-ink transition-colors font-medium"
            >
              Jak to działa
            </Link>
          </nav>
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-2">
          {profile ? (
            <Link
              href={ROLE_HOME[profile.role]}
              className="flex items-center gap-2.5 rounded-md px-3 py-1.5 hover:bg-surface transition-colors"
            >
              <Avatar src={profile.avatar_url} name={profile.full_name ?? profile.email} size={28} />
              <span className="hidden sm:inline text-sm font-medium text-ink">
                {profile.full_name ?? profile.email}
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="notion-btn-ghost text-sm">
                Zaloguj się
              </Link>
              <Link href="/register" className="notion-btn-primary text-sm">
                Utwórz konto
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
