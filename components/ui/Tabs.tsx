import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Tabs({ tabs, current }: { tabs: { label: string; href: string }[]; current: string }) {
  return (
    <div className="border-b border-line">
      <nav className="container flex gap-6 overflow-x-auto">
        {tabs.map((t) => {
          const active = t.href === current;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "py-3 text-sm transition-colors border-b-2 -mb-px",
                active
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
