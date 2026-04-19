"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Subject } from "@/types/database";

export function TutorFilters({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(patch: Record<string, string | undefined>) {
    const params = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "") params.delete(k);
      else params.set(k, v);
    }
    startTransition(() => router.replace(`/tutors?${params.toString()}`));
  }

  return (
    <aside className="notion-card p-5 space-y-5 sticky top-20">
      <div>
        <label className="text-xs uppercase tracking-widest text-ink-subtle">Szukaj</label>
        <input
          type="search"
          defaultValue={sp.get("search") ?? ""}
          placeholder="np. Matematyka matura"
          onBlur={(e) => update({ search: e.target.value })}
          className="notion-input mt-2"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-ink-subtle">Przedmiot</label>
        <select
          defaultValue={sp.get("subject") ?? ""}
          onChange={(e) => update({ subject: e.target.value || undefined })}
          className="notion-input mt-2"
        >
          <option value="">Wszystkie</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-ink-subtle">Forma</label>
        <select
          defaultValue={sp.get("format") ?? ""}
          onChange={(e) => update({ format: e.target.value || undefined })}
          className="notion-input mt-2"
        >
          <option value="">Dowolna</option>
          <option value="online">Online</option>
          <option value="in_person">Stacjonarnie</option>
          <option value="both">Online i stacjonarnie</option>
        </select>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-ink-subtle">Cena / h</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="od"
            defaultValue={sp.get("min") ?? ""}
            onBlur={(e) => update({ min: e.target.value })}
            className="notion-input"
          />
          <input
            type="number"
            placeholder="do"
            defaultValue={sp.get("max") ?? ""}
            onBlur={(e) => update({ max: e.target.value })}
            className="notion-input"
          />
        </div>
        <p className="mt-1 text-xs text-ink-subtle">Wartości w PLN (pełne złote).</p>
      </div>

      {pending && <p className="text-xs text-ink-subtle">Aktualizuję wyniki…</p>}
    </aside>
  );
}
