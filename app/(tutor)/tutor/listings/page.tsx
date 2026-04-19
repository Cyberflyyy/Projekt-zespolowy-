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
      <PageHeader eyebrow="Oferty" title="Twoje oferty" description="Utwórz ofertę dla każdego przedmiotu, który prowadzisz." />

      <form action={createListingAction} className="notion-card p-6 mb-8 grid gap-4 md:grid-cols-5">
        <select name="subject_id" required className="notion-input md:col-span-1">
          <option value="">Przedmiot</option>
          {(subjects ?? []).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input name="title" placeholder="Tytuł oferty" required className="notion-input md:col-span-2" />
        <input name="price" type="number" min={500} step={100} placeholder="Cena (grosze)" required className="notion-input" />
        <select name="level" className="notion-input">
          <option value="primary">Podstawówka</option>
          <option value="secondary">Liceum (kl. 1–2)</option>
          <option value="high_school" selected>Matura</option>
          <option value="university">Studia</option>
          <option value="adult">Dorośli</option>
        </select>
        <textarea name="description" placeholder="Opis (opcjonalnie)" className="notion-input md:col-span-4" rows={2} />
        <input name="duration_minutes" type="number" defaultValue={60} min={30} step={15} className="notion-input" />
        <div className="md:col-span-5">
          <button className="notion-btn-primary">Dodaj ofertę</button>
        </div>
      </form>

      <div className="space-y-3">
        {(listings ?? []).map((l) => (
          <div key={l.id} className="notion-card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink">{l.title}</p>
                <Badge tone={l.is_active ? "green" : "neutral"}>
                  {l.is_active ? "Aktywna" : "Wyłączona"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {l.subjects.name} · {l.duration_minutes} min · {formatMoney(l.price, l.currency)}
              </p>
              {l.description && (
                <p className="mt-2 text-sm text-ink-muted line-clamp-2 max-w-prose">{l.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <form action={toggleListingAction}>
                <input type="hidden" name="id" value={l.id} />
                <input type="hidden" name="is_active" value={l.is_active ? "false" : "true"} />
                <button className="notion-btn-secondary">{l.is_active ? "Wyłącz" : "Włącz"}</button>
              </form>
              <form action={deleteListingAction}>
                <input type="hidden" name="id" value={l.id} />
                <button className="notion-btn-ghost text-accent-red">Usuń</button>
              </form>
            </div>
          </div>
        ))}
        {(listings ?? []).length === 0 && (
          <div className="notion-card p-10 text-center">
            <p className="font-serif text-heading-3">Brak ofert</p>
            <p className="mt-1 text-sm text-ink-muted">Dodaj pierwszą ofertę, aby uczniowie mogli Cię zarezerwować.</p>
          </div>
        )}
      </div>
    </div>
  );
}
