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
    <div className="kp-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="kp-eyebrow">{label}</span>
        {icon && <span style={{ color: "var(--fg-3)" }}>{icon}</span>}
      </div>
      <div
        className="kp-mono"
        style={{ marginTop: 12, fontSize: 28, fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.03em" }}
      >
        {value}
      </div>
      {hint && (
        <div style={{ marginTop: 4, fontSize: 12, color: "var(--fg-4)" }}>{hint}</div>
      )}
    </div>
  );
}
