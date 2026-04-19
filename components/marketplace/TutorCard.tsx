import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
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
      className="notion-card flex flex-col p-5 hover:border-line-hover"
    >
      <div className="flex items-start gap-4">
        <Avatar src={tutor.profiles.avatar_url} name={tutor.profiles.full_name} size={56} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{tutor.profiles.full_name}</p>
          <p className="text-xs text-ink-muted">
            {tutor.city ?? "—"} · {tutor.years_experience} lat doświadczenia
          </p>
          <div className="mt-1 text-sm text-ink-muted">
            ★ {Number(tutor.rating_avg).toFixed(1)}
            <span className="text-ink-subtle"> ({tutor.rating_count})</span>
          </div>
        </div>
      </div>

      {tutor.headline && (
        <p className="mt-4 text-sm text-ink line-clamp-3 min-h-[60px]">{tutor.headline}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{FORMAT_LABEL[tutor.lesson_format]}</Badge>
        {tutor.languages?.slice(0, 2).map((l) => (
          <Badge key={l} tone="neutral">
            {l}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-ink-subtle">od</span>
        <span className="font-serif text-heading-3 text-ink">
          {formatMoney(tutor.hourly_rate, tutor.currency)}
          <span className="text-sm text-ink-muted"> / h</span>
        </span>
      </div>
    </Link>
  );
}
