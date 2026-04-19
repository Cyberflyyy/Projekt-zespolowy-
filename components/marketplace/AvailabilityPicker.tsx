"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import type { AvailabilitySlot, Listing } from "@/types/database";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/format";

interface Props {
  slots: AvailabilitySlot[];
  listings: Listing[];
  tutorId: string;
  isAuthenticated: boolean;
}

export function AvailabilityPicker({ slots, listings, tutorId, isAuthenticated }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [slotId, setSlotId] = useState<string | null>(null);
  const [listingId, setListingId] = useState<string>(listings[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  const selectedListing = listings.find((l) => l.id === listingId);

  const grouped = useMemo(() => {
    const byDay = new Map<string, AvailabilitySlot[]>();
    for (const s of slots) {
      const day = format(new Date(s.starts_at), "yyyy-MM-dd");
      byDay.set(day, [...(byDay.get(day) ?? []), s]);
    }
    return [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  async function book() {
    if (!isAuthenticated) {
      router.push(`/login?next=/tutors/${tutorId}`);
      return;
    }
    if (!slotId || !listingId) {
      setError("Wybierz ofertę i termin.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, slot_id: slotId }),
      });
      const payload = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) {
        setError(payload.error ?? "Nie udało się rozpocząć rezerwacji.");
        return;
      }
      if (payload.url) window.location.href = payload.url;
    });
  }

  if (listings.length === 0) {
    return (
      <div className="notion-card p-5 text-sm text-ink-muted">
        Korepetytor nie opublikował jeszcze oferty.
      </div>
    );
  }

  return (
    <div className="notion-card p-5 space-y-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-subtle">Oferta</p>
        <select
          className="notion-input mt-2"
          value={listingId}
          onChange={(e) => setListingId(e.target.value)}
        >
          {listings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title} — {formatMoney(l.price, l.currency)} / {l.duration_minutes} min
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-ink-subtle">Wybierz termin</p>
        {slots.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">Brak wolnych terminów w najbliższym czasie.</p>
        ) : (
          <div className="mt-3 max-h-72 overflow-y-auto space-y-4 pr-1">
            {grouped.map(([day, daySlots]) => (
              <div key={day}>
                <p className="text-xs text-ink-muted mb-2">
                  {format(new Date(day), "EEEE, d MMMM", { locale: pl })}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {daySlots.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlotId(s.id)}
                      className={cn(
                        "rounded border px-2 py-1.5 text-xs transition-colors",
                        slotId === s.id
                          ? "border-ink bg-ink text-canvas"
                          : "border-line bg-canvas text-ink hover:bg-surface",
                      )}
                    >
                      {format(new Date(s.starts_at), "HH:mm")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedListing && (
        <div className="rounded-md border border-line bg-surface p-3 text-sm">
          <div className="flex justify-between text-ink">
            <span>Do zapłaty</span>
            <span className="font-medium">
              {formatMoney(selectedListing.price, selectedListing.currency)}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            Płatność jest bezpiecznie obsługiwana przez Stripe. Po opłaceniu rezerwacja zostanie potwierdzona.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-accent-red">{error}</p>}

      <button type="button" onClick={book} disabled={pending || !slotId} className="notion-btn-primary w-full">
        {pending ? "Przekierowuję..." : isAuthenticated ? "Zarezerwuj i zapłać" : "Zaloguj się, aby zarezerwować"}
      </button>
    </div>
  );
}
