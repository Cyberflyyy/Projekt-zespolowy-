import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatMoney } from "@/lib/utils/format";
import type { TutorListRow } from "@/lib/db/tutors";

const FORMAT_LABEL: Record<string, string> = {
  online: "Online",
  in_person: "Stacjonarnie",
  both: "Online i stacjonarnie",
};

export function TutorCard({ tutor }: { tutor: TutorListRow }) {
  return (
    <Link
      href={`/tutors/${tutor.user_id}`}
      className="kp-card kp-card-hover"
      style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, textDecoration: "none", height: "100%" }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar src={tutor.profiles.avatar_url} name={tutor.profiles.full_name} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {tutor.profiles.full_name}
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
            {tutor.city ?? "—"} · {tutor.years_experience} lat
          </div>
        </div>
      </div>

      {tutor.headline && (
        <p style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.45, minHeight: 38 }}>
          {tutor.headline}
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <span className="kp-badge">{FORMAT_LABEL[tutor.lesson_format]}</span>
        {tutor.languages?.slice(0, 2).map((l) => (
          <span key={l} className="kp-badge" style={{ background: "var(--surface)" }}>{l}</span>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--fg-3)" }}>
          ★ <span className="kp-mono" style={{ fontWeight: 600, color: "var(--fg)" }}>{Number(tutor.rating_avg).toFixed(1)}</span>
          <span style={{ color: "var(--fg-4)" }}> ({tutor.rating_count})</span>
        </span>
        <span className="kp-mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>
          {formatMoney(tutor.hourly_rate, tutor.currency)}
          <span style={{ fontSize: 11, color: "var(--fg-4)", fontWeight: 400 }}> / h</span>
        </span>
      </div>
    </Link>
  );
}
