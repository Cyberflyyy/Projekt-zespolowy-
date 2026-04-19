import { Badge } from "@/components/ui/Badge";
import type { BookingStatus } from "@/types/database";

const MAP: Record<BookingStatus, { tone: "neutral" | "blue" | "green" | "red" | "yellow"; label: string }> = {
  draft:           { tone: "neutral", label: "Szkic" },
  pending_payment: { tone: "yellow",  label: "Oczekuje na płatność" },
  confirmed:       { tone: "green",   label: "Potwierdzona" },
  cancelled:       { tone: "red",     label: "Anulowana" },
  completed:       { tone: "blue",    label: "Zakończona" },
  refunded:        { tone: "neutral", label: "Zwrot" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { tone, label } = MAP[status];
  return <Badge tone={tone}>{label}</Badge>;
}
