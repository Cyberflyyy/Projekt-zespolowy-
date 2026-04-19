import { PageHeader } from "@/components/ui/PageHeader";
import { requireRole } from "@/lib/auth/guards";
import { updateProfileAction } from "./actions";

export default async function StudentSettingsPage() {
  const { profile } = await requireRole("student");

  return (
    <div>
      <PageHeader eyebrow="Konto" title="Ustawienia" description="Zmień swoje dane kontaktowe." />

      <form action={updateProfileAction} className="notion-card p-6 space-y-5 max-w-lg">
        <div className="space-y-1.5">
          <label htmlFor="full_name" className="text-sm">Imię i nazwisko</label>
          <input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} className="notion-input" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm">E-mail</label>
          <input id="email" name="email" type="email" defaultValue={profile.email} disabled className="notion-input opacity-60" />
          <p className="text-xs text-ink-subtle">Zmiana adresu e-mail wkrótce.</p>
        </div>
        <button className="notion-btn-primary">Zapisz</button>
      </form>
    </div>
  );
}
