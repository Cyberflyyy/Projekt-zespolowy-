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
        eyebrow="// profil · public.edit"
        title="Edycja profilu"
        description="Te informacje zobaczą uczniowie przeglądający Twój profil."
        action={
          <form action={togglePublishedAction}>
            <input type="hidden" name="is_published" value={tp?.is_published ? "false" : "true"} />
            <button className={tp?.is_published ? "kp-btn kp-btn-secondary" : "kp-btn kp-btn-primary"}>
              {tp?.is_published ? "Ukryj profil" : "Opublikuj profil"}
            </button>
          </form>
        }
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Badge tone={tp?.is_published ? "green" : "yellow"}>
          {tp?.is_published ? "Opublikowany" : "Szkic"}
        </Badge>
        <Badge tone={tp?.stripe_onboarded ? "green" : "red"}>
          {tp?.stripe_onboarded ? "Wypłaty aktywne" : "Wypłaty nieaktywne"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form action={saveTutorProfileAction} className="kp-card p-6" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Field
            label="Nagłówek (tytuł)"
            name="headline"
            defaultValue={tp?.headline ?? ""}
            placeholder="Matematyka — matura podstawowa i rozszerzona"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>Bio</label>
            <textarea
              name="bio"
              defaultValue={tp?.bio ?? ""}
              rows={6}
              className="kp-input"
              style={{ height: "auto", paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
              placeholder="Opowiedz o swoim doświadczeniu, metodyce, sukcesach uczniów..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stawka (w groszach)" type="number" name="hourly_rate" defaultValue={String(tp?.hourly_rate ?? 8000)} />
            <Field label="Lata doświadczenia" type="number" name="years_experience" defaultValue={String(tp?.years_experience ?? 0)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>Forma</label>
              <select name="lesson_format" defaultValue={tp?.lesson_format ?? "online"} className="kp-input">
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

          <button className="kp-btn kp-btn-primary" style={{ alignSelf: "flex-start" }}>
            Zapisz zmiany
          </button>
        </form>

        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="kp-card p-6">
            <div className="kp-eyebrow" style={{ marginBottom: 16 }}>// zdjęcie profilowe</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar src={profile.avatar_url} name={profile.full_name} size={64} />
              <form action={uploadAvatarAction} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input type="file" name="file" accept="image/*" style={{ fontSize: 12, color: "var(--fg-3)" }} />
                <button className="kp-btn kp-btn-secondary kp-btn-sm">Wgraj nowe zdjęcie</button>
              </form>
            </div>
          </div>

          <div className="kp-card p-6">
            <div className="kp-eyebrow" style={{ marginBottom: 8 }}>// podpowiedź</div>
            <p style={{ fontSize: 13, color: "var(--fg-3)", lineHeight: 1.6 }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={name} style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="kp-input" />
    </div>
  );
}
