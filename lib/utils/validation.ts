import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Niepoprawny adres e-mail."),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków."),
  full_name: z.string().min(2, "Podaj imię i nazwisko."),
  role: z.enum(["student", "tutor"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const listingSchema = z.object({
  subject_id: z.string().uuid(),
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  level: z.enum(["primary", "secondary", "high_school", "university", "adult"]),
  price: z.number().int().min(500).max(100000), // minor units
  duration_minutes: z.number().int().min(30).max(240),
});

export const tutorProfileSchema = z.object({
  headline: z.string().min(3).max(140),
  bio: z.string().max(3000).optional(),
  hourly_rate: z.number().int().min(500),
  lesson_format: z.enum(["online", "in_person", "both"]),
  years_experience: z.number().int().min(0).max(80),
  city: z.string().max(80).optional(),
  languages: z.array(z.string()).max(10).default([]),
  is_published: z.boolean().default(false),
});

export const bookingCreateSchema = z.object({
  listing_id: z.string().uuid(),
  slot_id: z.string().uuid(),
  notes: z.string().max(500).optional(),
});
