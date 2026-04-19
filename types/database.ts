// Lightweight hand-written DB types. Replace with `supabase gen types typescript` output later.
export type UserRole = "student" | "tutor" | "admin";
export type BookingStatus =
  | "draft"
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "refunded";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type LessonFormat = "online" | "in_person" | "both";
export type ListingLevel =
  | "primary"
  | "secondary"
  | "high_school"
  | "university"
  | "adult";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface TutorProfile {
  user_id: string;
  headline: string | null;
  bio: string | null;
  hourly_rate: number;
  currency: string;
  lesson_format: LessonFormat;
  years_experience: number;
  city: string | null;
  languages: string[];
  stripe_account_id: string | null;
  stripe_onboarded: boolean;
  is_published: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  category: string | null;
}

export interface Listing {
  id: string;
  tutor_id: string;
  subject_id: string;
  title: string;
  description: string | null;
  level: ListingLevel;
  price: number;
  currency: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlot {
  id: string;
  tutor_id: string;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  student_id: string;
  tutor_id: string;
  listing_id: string;
  slot_id: string;
  status: BookingStatus;
  amount_total: number;
  platform_fee: number;
  tutor_share: number;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  status: PaymentStatus;
  amount: number;
  platform_fee: number;
  tutor_share: number;
  currency: string;
  stripe_charge_id: string | null;
  stripe_transfer_id: string | null;
  raw_event: unknown;
  created_at: string;
  updated_at: string;
}
