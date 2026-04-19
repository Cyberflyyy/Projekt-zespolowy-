import { PageHeader } from "@/components/ui/PageHeader";
import { requireRole } from "@/lib/auth/guards";
import { updateTutorAccountAction } from "./actions";

export default async function TutorSettingsPage() {
  const { profile } = await requireRole("tutor");

  return (
    <div>
      <PageHeader eyebrow="Konto" title="Ustawienia" description="Zarządzaj danymi konta." />

      <form action={updateTutorAccountAction} className="notion-card p-6 space-y-5 max-w-lg">
        <div className="space-y-1.5">
          <label className="text-sm">Imię i nazwisko</label>
          <input name="full_name" defaultValue={profile.full_name ?? ""} className="notion-input" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm">E-mail</label>
          <input name="email" defaultValue={profile.email} disabled className="notion-input opacity-60" />
        </div>
        <button className="notion-btn-primary">Zapisz</button>
      </form>
    </div>
  );
}
