import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-6 pb-6 border-b border-line mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-widest text-ink-subtle mb-2">{eyebrow}</p>
        )}
        <h1 className="font-serif text-heading-1 text-ink">{title}</h1>
        {description && (
          <p className="mt-2 max-w-prose text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}
