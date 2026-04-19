import { headers } from "next/headers";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth/guards";

const NAV: NavItem[] = [
  { label: "Przegląd", href: "/student/dashboard" },
  { label: "Rezerwacje", href: "/student/bookings" },
  { label: "Płatności", href: "/student/payments" },
  { label: "Ustawienia", href: "/student/settings" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole("student");
  const h = await headers();
  const currentPath = h.get("x-pathname") ?? "/student/dashboard";

  return (
    <DashboardShell profile={profile} nav={NAV} currentPath={currentPath}>
      {children}
    </DashboardShell>
  );
}
