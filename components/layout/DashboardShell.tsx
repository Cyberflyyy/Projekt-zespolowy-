import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import type { Profile } from "@/types/database";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { signOutAction } from "@/lib/auth/actions";

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export function DashboardShell({
  profile,
  nav,
  currentPath,
  children,
}: {
  profile: Profile;
  nav: NavItem[];
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <aside className="hidden md:flex w-60 shrink-0 border-r border-line bg-canvas min-h-screen flex-col">
          <div className="px-5 py-4 border-b border-line">
            <Link href="/" className="kp-nav-brand">
              <span className="kp-logo-mark">K</span>
              Korepetytorzy
            </Link>
            <p className="mt-0.5 text-xs text-ink-subtle">{ROLE_LABELS[profile.role]}</p>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {nav.map((item) => {
              const active = currentPath === item.href || currentPath.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors",
                    active ? "bg-surface text-ink" : "text-ink-muted hover:bg-surface hover:text-ink",
                  )}
                >
                  {item.icon && <span className="text-ink-subtle">{item.icon}</span>}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-line">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar src={profile.avatar_url} name={profile.full_name ?? profile.email} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{profile.full_name ?? profile.email}</p>
                <p className="truncate text-xs text-ink-subtle">{profile.email}</p>
              </div>
            </div>
            <form action={signOutAction}>
              <button className="kp-btn kp-btn-ghost w-full justify-start mt-1 text-xs">
                Wyloguj się
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="container max-w-content py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
