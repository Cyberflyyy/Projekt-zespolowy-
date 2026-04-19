import { headers } from "next/headers";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { requireRole } from "@/lib/auth/guards";

const NAV: NavItem[] = [
  { label: "Przegląd", href: "/admin/dashboard" },
  { label: "Użytkownicy", href: "/admin/users" },
  { label: "Oferty", href: "/admin/listings" },
  { label: "Rezerwacje", href: "/admin/bookings" },
  { label: "Płatności", href: "/admin/payments" },
  { label: "Analityka", href: "/admin/analytics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole("admin");
  const h = await headers();
  const currentPath = h.get("x-pathname") ?? "/admin/dashboard";

  return (
    <DashboardShell profile={profile} nav={NAV} currentPath={currentPath}>
      {children}
    </DashboardShell>
  );
}
