import { PageHeader } from "@/components/ui/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { TutorProfile } from "@/types/database";
import { saveTutorProfileAction, uploadAvatarAction, togglePublishedAction } from "./actions";

export default async function TutorProfileEditorPage() {
  const { profile } = await requireRole("tutor");
  const supabase = await createClient();
  const { data: tp } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", profile.id)
    .single<TutorProfile>();

  return (
    <div>
      <PageHeader
        eyebrow="Profil publiczny"
        title="Edycja profilu"
        description="Te informacje zobaczą uczniowie przeglądający Twój profil."
        action={
          <form action={togglePublishedAction}>
            <input type="hidden" name="is_published" value={tp?.is_published ? "false" : "true"} />
            <button className={tp?.is_published ? "notion-btn-secondary" : "notion-btn-primary"}>
              {tp?.is_published ? "Ukryj profil" : "Opublikuj profil"}
            </button>
          </form>
        }
      />

      <div className="mb-6 flex items-center gap-2">
        <Badge tone={tp?.is_published ? "green" : "yellow"}>
          {tp?.is_published ? "Opublikowany" : "Szkic"}
        </Badge>
        <Badge tone={tp?.stripe_onboarded ? "green" : "red"}>
          {tp?.stripe_onboarded ? "Wypłaty aktywne" : "Wypłaty nieaktywne"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form action={saveTutorProfileAction} className="notion-card p-6 space-y-5">
          <Field label="Nagłówek (tytuł)" name="headline" defaultValue={tp?.headline ?? ""} placeholder="Matematyka — matura podstawowa i rozszerzona" />
          <div className="space-y-1.5">
            <label className="text-sm">Bio</label>
            <textarea
              name="bio"
              defaultValue={tp?.bio ?? ""}
              rows={6}
              className="notion-input"
              placeholder="Opowiedz o swoim doświadczeniu, metodyce, sukcesach uczniów..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stawka (w groszach)" type="number" name="hourly_rate" defaultValue={String(tp?.hourly_rate ?? 8000)} />
            <Field label="Lata doświadczenia" type="number" name="years_experience" defaultValue={String(tp?.years_experience ?? 0)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm">Forma</label>
              <select name="lesson_format" defaultValue={tp?.lesson_format ?? "online"} className="notion-input">
                <option value="online">Online</option>
                <option value="in_person">Stacjonarnie</option>
                <option value="both">Online i stacjonarnie</option>
              </select>
            </div>
            <Field label="Miasto (opcjonalnie)" name="city" defaultValue={tp?.city ?? ""} />
          </div>

          <Field
            label="Języki (oddzielone przecinkiem)"
            name="languages"
            defaultValue={(tp?.languages ?? []).join(", ")}
            placeholder="Polski, Angielski"
          />

          <button className="notion-btn-primary">Zapisz zmiany</button>
        </form>

        <aside className="space-y-6">
          <div className="notion-card p-6">
            <p className="text-xs uppercase tracking-widest text-ink-subtle">Zdjęcie profilowe</p>
            <div className="mt-4 flex items-center gap-4">
              <Avatar src={profile.avatar_url} name={profile.full_name} size={64} />
              <form action={uploadAvatarAction}>
                <input type="file" name="file" accept="image/*" className="text-xs" />
                <button className="notion-btn-secondary mt-3">Wgraj nowe zdjęcie</button>
              </form>
            </div>
          </div>

          <div className="notion-card p-6 text-sm text-ink-muted">
            <p className="text-xs uppercase tracking-widest text-ink-subtle">Podpowiedź</p>
            <p className="mt-2">
              Profile z uzupełnionym bio, zdjęciem i co najmniej jedną ofertą są 4× częściej wybierane przez uczniów.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm">{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="notion-input" />
    </div>
  );
}
