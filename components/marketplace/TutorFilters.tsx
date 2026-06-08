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
    <aside className="kp-card" style={{ padding: 18, position: "sticky", top: 76 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Filtry</span>
        {pending && (
          <span className="kp-mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-4)" }}>…</span>
        )}
      </div>

      <FilterRow label="szukaj">
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--fg-4)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <input
            type="search"
            defaultValue={sp.get("search") ?? ""}
            placeholder="np. matura"
            onBlur={(e) => update({ search: e.target.value })}
            className="kp-input"
            style={{ paddingLeft: 30 }}
          />
        </div>
      </FilterRow>

      <FilterRow label="przedmiot">
        <select
          defaultValue={sp.get("subject") ?? ""}
          onChange={(e) => update({ subject: e.target.value || undefined })}
          className="kp-input"
        >
          <option value="">Wszystkie</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </FilterRow>

      <FilterRow label="forma">
        <select
          defaultValue={sp.get("format") ?? ""}
          onChange={(e) => update({ format: e.target.value || undefined })}
          className="kp-input"
        >
          <option value="">Dowolna</option>
          <option value="online">Online</option>
          <option value="in_person">Stacjonarnie</option>
          <option value="both">Online i stacjonarnie</option>
        </select>
      </FilterRow>

      <FilterRow label="cena / h">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <input
            type="number"
            placeholder="od"
            defaultValue={sp.get("min") ?? ""}
            onBlur={(e) => update({ min: e.target.value })}
            className="kp-input"
          />
          <input
            type="number"
            placeholder="do"
            defaultValue={sp.get("max") ?? ""}
            onBlur={(e) => update({ max: e.target.value })}
            className="kp-input"
          />
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 6, fontFamily: "var(--font-mono)" }}>
          średnio 102 zł / h
        </div>
      </FilterRow>

      <button
        className="kp-btn kp-btn-secondary"
        style={{ width: "100%", marginTop: 8 }}
        onClick={() => {
          update({ search: undefined, subject: undefined, format: undefined, min: undefined, max: undefined });
        }}
      >
        Wyczyść filtry
      </button>
    </aside>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// {label}</div>
      {children}
    </div>
  );
}
