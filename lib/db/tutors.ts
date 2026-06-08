import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Listing, Profile, Subject, TutorProfile } from "@/types/database";

export interface TutorListFilters {
  subjectSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  lessonFormat?: "online" | "in_person" | "both";
  search?: string;
}

export type TutorListRow = TutorProfile & {
  profiles: Pick<Profile, "full_name" | "avatar_url">;
};

export async function listTutors(filters: TutorListFilters = {}): Promise<TutorListRow[]> {
  const supabase = await createClient();

  let tutorIds: string[] | undefined;
  if (filters.subjectSlug) {
    const { data: subject } = await supabase
      .from("subjects")
      .select("id")
      .eq("slug", filters.subjectSlug)
      .maybeSingle<Pick<Subject, "id">>();
    if (!subject) return [];
    const { data: lst } = await supabase
      .from("listings")
      .select("tutor_id")
      .eq("subject_id", subject.id)
      .eq("is_active", true);
    tutorIds = [...new Set((lst ?? []).map((r) => r.tutor_id))];
    if (tutorIds.length === 0) return [];
  }

  let q = supabase
    .from("tutor_profiles")
    .select(
      "user_id, headline, bio, hourly_rate, currency, lesson_format, years_experience, city, languages, is_published, rating_avg, rating_count, stripe_onboarded, created_at, updated_at, stripe_account_id, profiles:profiles!inner(full_name, avatar_url)",
    )
    .eq("is_published", true)
    .order("rating_avg", { ascending: false })
    .limit(48);

  if (tutorIds) q = q.in("user_id", tutorIds);
  if (filters.lessonFormat) q = q.eq("lesson_format", filters.lessonFormat);
  if (typeof filters.minPrice === "number") q = q.gte("hourly_rate", filters.minPrice);
  if (typeof filters.maxPrice === "number") q = q.lte("hourly_rate", filters.maxPrice);
  if (filters.search)
    q = q.or(`headline.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);

  const { data } = await q.returns<TutorListRow[]>();
  return data ?? [];
}

export type TutorDetail = TutorProfile & {
  profiles: Pick<Profile, "full_name" | "avatar_url" | "email">;
  listings: (Listing & { subjects: Pick<Subject, "name" | "slug" | "category"> })[];
};

export const getTutor = cache(async (userId: string): Promise<TutorDetail | null> => {
  const supabase = await createClient();

  const [{ data: tutor }, { data: listings }] = await Promise.all([
    supabase
      .from("tutor_profiles")
      .select("*, profiles:profiles!inner(full_name, avatar_url, email)")
      .eq("user_id", userId)
      .eq("is_published", true)
      .maybeSingle(),
    supabase
      .from("listings")
      .select("*, subjects(name, slug, category)")
      .eq("tutor_id", userId)
      .eq("is_active", true),
  ]);

  if (!tutor) return null;

  return { ...tutor, listings: listings ?? [] } as TutorDetail;
});
