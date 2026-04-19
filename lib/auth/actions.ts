"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/auth/roles";
import type { UserRole } from "@/types/database";

export type AuthState = { error?: string } | undefined;

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) return { error: "Podaj e-mail i hasło." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: mapAuthError(error.message) };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Nie udało się pobrać sesji." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: UserRole }>();

  redirect(next || ROLE_HOME[profile?.role ?? "student"]);
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = (String(formData.get("role") ?? "student") as UserRole);

  if (!email || !password || !fullName)
    return { error: "Uzupełnij wszystkie pola." };
  if (password.length < 8)
    return { error: "Hasło musi mieć co najmniej 8 znaków." };
  if (!["student", "tutor"].includes(role))
    return { error: "Nieprawidłowa rola." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });
  if (error) return { error: mapAuthError(error.message) };

  redirect(ROLE_HOME[role]);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

function mapAuthError(msg: string): string {
  if (/Invalid login credentials/i.test(msg)) return "Nieprawidłowy e-mail lub hasło.";
  if (/User already registered/i.test(msg)) return "Konto z tym e-mailem już istnieje.";
  if (/Email not confirmed/i.test(msg)) return "Potwierdź adres e-mail, aby się zalogować.";
  return msg;
}
