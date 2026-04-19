import { Badge } from "@/components/ui/Badge";
import type { PaymentStatus } from "@/types/database";

const MAP: Record<PaymentStatus, { tone: "neutral" | "blue" | "green" | "red" | "yellow"; label: string }> = {
  pending:   { tone: "yellow",  label: "W trakcie" },
  succeeded: { tone: "green",   label: "Opłacono" },
  failed:    { tone: "red",     label: "Błąd" },
  refunded:  { tone: "neutral", label: "Zwrot" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { tone, label } = MAP[status];
  return <Badge tone={tone}>{label}</Badge>;
}
