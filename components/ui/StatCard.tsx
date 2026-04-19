import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="notion-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-ink-subtle">{label}</span>
        {icon && <span className="text-ink-subtle">{icon}</span>}
      </div>
      <div className="mt-2 font-serif text-heading-1 text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}
