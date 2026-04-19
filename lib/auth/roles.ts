import type { UserRole } from "@/types/database";

export const ROLES: Record<UserRole, UserRole> = {
  student: "student",
  tutor: "tutor",
  admin: "admin",
};

export const ROLE_HOME: Record<UserRole, string> = {
  student: "/student/dashboard",
  tutor: "/tutor/dashboard",
  admin: "/admin/dashboard",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Uczeń",
  tutor: "Korepetytor",
  admin: "Administrator",
};
