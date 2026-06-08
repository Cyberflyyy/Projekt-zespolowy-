import { PageHeader } from "@/components/ui/PageHeader";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { Listing, Subject } from "@/types/database";
import { formatMoney } from "@/lib/utils/format";
import { createListingAction, deleteListingAction, toggleListingAction } from "./actions";
import { Badge } from "@/components/ui/Badge";

export default async function TutorListingsPage() {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();
  const [{ data: listings }, { data: subjects }] = await Promise.all([
    supabase
      .from("listings")
      .select("*, subjects(name)")
      .eq("tutor_id", profile.id)
      .order("created_at", { ascending: false })
      .returns<(Listing & { subjects: Pick<Subject, "name"> })[]>(),
    supabase.from("subjects").select("*").order("name").returns<Subject[]>(),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="// oferty · listings.manage"
        title="Twoje oferty"
        description="Utwórz ofertę dla każdego przedmiotu, który prowadzisz."
      />

      <form action={createListingAction} className="kp-card p-6 mb-8 grid gap-4 md:grid-cols-5">
        <select name="subject_id" required className="kp-input md:col-span-1">
          <option value="">Przedmiot</option>
          {(subjects ?? []).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input name="title" placeholder="Tytuł oferty" required className="kp-input md:col-span-2" />
        <input name="price" type="number" min={5} step={0.5} placeholder="Cena (zł)" required className="kp-input" />
        <select name="level" className="kp-input">
          <option value="primary">Podstawówka</option>
          <option value="secondary">Liceum (kl. 1–2)</option>
          <option value="high_school">Matura</option>
          <option value="university">Studia</option>
          <option value="adult">Dorośli</option>
        </select>
        <textarea name="description" placeholder="Opis (opcjonalnie)" className="kp-input md:col-span-4" rows={2} style={{ height: "auto", paddingTop: 8 }} />
        <input name="duration_minutes" type="number" defaultValue={60} min={30} step={15} className="kp-input" />
        <div className="md:col-span-5">
          <button className="kp-btn kp-btn-primary">Dodaj ofertę</button>
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(listings ?? []).map((l) => (
          <div key={l.id} className="kp-card p-5" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>{l.title}</p>
                <Badge tone={l.is_active ? "green" : "neutral"}>
                  {l.is_active ? "Aktywna" : "Wyłączona"}
                </Badge>
              </div>
              <p style={{ fontSize: 12, color: "var(--fg-3)" }}>
                {l.subjects.name} · {l.duration_minutes} min · {formatMoney(l.price, l.currency)}
              </p>
              {l.description && (
                <p style={{ marginTop: 6, fontSize: 13, color: "var(--fg-3)", maxWidth: "60ch" }}
                   className="line-clamp-2">
                  {l.description}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <form action={toggleListingAction}>
                <input type="hidden" name="id" value={l.id} />
                <input type="hidden" name="is_active" value={l.is_active ? "false" : "true"} />
                <button className="kp-btn kp-btn-secondary">{l.is_active ? "Wyłącz" : "Włącz"}</button>
              </form>
              <form action={deleteListingAction}>
                <input type="hidden" name="id" value={l.id} />
                <button className="kp-btn kp-btn-ghost" style={{ color: "var(--danger)" }}>Usuń</button>
              </form>
            </div>
          </div>
        ))}
        {(listings ?? []).length === 0 && (
          <div className="kp-card p-10 text-center">
            <p style={{ fontSize: "1.375rem", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)" }}>Brak ofert</p>
            <p style={{ marginTop: 6, fontSize: 13, color: "var(--fg-3)" }}>
              Dodaj pierwszą ofertę, aby uczniowie mogli Cię zarezerwować.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
