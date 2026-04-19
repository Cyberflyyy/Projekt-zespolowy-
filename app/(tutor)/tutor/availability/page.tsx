import { PageHeader } from "@/components/ui/PageHeader";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { AvailabilitySlot } from "@/types/database";
import { formatDateLong } from "@/lib/utils/format";
import { addSlotAction, deleteSlotAction } from "./actions";
import { Badge } from "@/components/ui/Badge";

export default async function TutorAvailabilityPage() {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();

  const { data: slots } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("tutor_id", profile.id)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at")
    .returns<AvailabilitySlot[]>();

  return (
    <div>
      <PageHeader eyebrow="Kalendarz" title="Dostępność" description="Dodawaj sloty, w których jesteś dostępny dla uczniów." />

      <form action={addSlotAction} className="notion-card p-6 mb-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="text-sm">Początek</label>
          <input type="datetime-local" name="starts_at" required className="notion-input mt-1" />
        </div>
        <div>
          <label className="text-sm">Koniec</label>
          <input type="datetime-local" name="ends_at" required className="notion-input mt-1" />
        </div>
        <div className="self-end">
          <button className="notion-btn-primary">Dodaj slot</button>
        </div>
      </form>

      <div className="space-y-2">
        {(slots ?? []).map((s) => (
          <div key={s.id} className="notion-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">{formatDateLong(s.starts_at)}</p>
              <p className="text-xs text-ink-muted">do {formatDateLong(s.ends_at)}</p>
            </div>
            <div className="flex items-center gap-3">
              {s.is_booked ? (
                <Badge tone="blue">Zarezerwowany</Badge>
              ) : (
                <Badge tone="green">Wolny</Badge>
              )}
              {!s.is_booked && (
                <form action={deleteSlotAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="notion-btn-ghost text-accent-red">Usuń</button>
                </form>
              )}
            </div>
          </div>
        ))}
        {(slots ?? []).length === 0 && (
          <div className="notion-card p-10 text-center text-sm text-ink-muted">
            Brak zaplanowanych slotów. Dodaj pierwszy powyżej.
          </div>
        )}
      </div>
    </div>
  );
}
