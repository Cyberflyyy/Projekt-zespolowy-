import { headers } from "next/headers";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth/guards";

const NAV: NavItem[] = [
  { label: "Przegląd", href: "/tutor/dashboard" },
  { label: "Profil publiczny", href: "/tutor/profile" },
  { label: "Oferty", href: "/tutor/listings" },
  { label: "Dostępność", href: "/tutor/availability" },
  { label: "Rezerwacje", href: "/tutor/bookings" },
  { label: "Zarobki", href: "/tutor/earnings" },
  { label: "Wypłaty", href: "/tutor/payouts" },
  { label: "Ustawienia", href: "/tutor/settings" },
];

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole("tutor");
  const h = await headers();
  const currentPath = h.get("x-pathname") ?? "/tutor/dashboard";

  return (
    <DashboardShell profile={profile} nav={NAV} currentPath={currentPath}>
      {children}
    </DashboardShell>
  );
}
