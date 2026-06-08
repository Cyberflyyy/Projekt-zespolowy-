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
    <header
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 24,
        paddingBottom: 24,
        borderBottom: "1px solid var(--border)",
        marginBottom: 32,
      }}
    >
      <div>
        {eyebrow && (
          <div className="kp-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>
        )}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
          }}
        >
          {title}
        </h1>
        {description && (
          <p style={{ marginTop: 6, maxWidth: "56ch", fontSize: 14, color: "var(--fg-3)", lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}
