-- ============================================================================
-- 0001_init.sql — schema, types, tables, indexes, triggers
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('student','tutor','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.booking_status as enum (
    'draft','pending_payment','confirmed','cancelled','completed','refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum (
    'pending','succeeded','failed','refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lesson_format as enum ('online','in_person','both');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.listing_level as enum (
    'primary','secondary','high_school','university','adult'
  );
exception when duplicate_object then null; end $$;

-- ---------- PROFILES -------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  avatar_url  text,
  role        public.user_role not null default 'student',
  is_blocked  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role    public.user_role not null,
  primary key (user_id, role)
);

-- ---------- TUTOR PROFILES -------------------------------------------------
create table if not exists public.tutor_profiles (
  user_id            uuid primary key references public.profiles(id) on delete cascade,
  headline           text,
  bio                text,
  hourly_rate        integer not null default 0,          -- minor units (grosze)
  currency           text not null default 'pln',
  lesson_format      public.lesson_format not null default 'online',
  years_experience   integer not null default 0,
  city               text,
  languages          text[] not null default '{}',
  stripe_account_id  text unique,
  stripe_onboarded   boolean not null default false,
  is_published       boolean not null default false,
  rating_avg         numeric(3,2) not null default 0,
  rating_count       integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------- SUBJECTS -------------------------------------------------------
create table if not exists public.subjects (
  id        uuid primary key default gen_random_uuid(),
  slug      text unique not null,
  name      text not null,
  category  text
);

-- ---------- LISTINGS -------------------------------------------------------
create table if not exists public.listings (
  id               uuid primary key default gen_random_uuid(),
  tutor_id         uuid not null references public.profiles(id) on delete cascade,
  subject_id       uuid not null references public.subjects(id) on delete restrict,
  title            text not null,
  description      text,
  level            public.listing_level not null default 'high_school',
  price            integer not null,                       -- minor units
  currency         text not null default 'pln',
  duration_minutes integer not null default 60,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists listings_tutor_idx   on public.listings(tutor_id);
create index if not exists listings_subject_idx on public.listings(subject_id);
create index if not exists listings_active_idx  on public.listings(is_active);

-- ---------- AVAILABILITY ---------------------------------------------------
create table if not exists public.availability_slots (
  id         uuid primary key default gen_random_uuid(),
  tutor_id   uuid not null references public.profiles(id) on delete cascade,
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  is_booked  boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tutor_id, starts_at),
  check (ends_at > starts_at)
);
create index if not exists slots_tutor_time_idx on public.availability_slots(tutor_id, starts_at);

-- ---------- BOOKINGS -------------------------------------------------------
create table if not exists public.bookings (
  id                          uuid primary key default gen_random_uuid(),
  student_id                  uuid not null references public.profiles(id) on delete restrict,
  tutor_id                    uuid not null references public.profiles(id) on delete restrict,
  listing_id                  uuid not null references public.listings(id) on delete restrict,
  slot_id                     uuid not null references public.availability_slots(id) on delete restrict,
  status                      public.booking_status not null default 'draft',
  amount_total                integer not null,            -- minor units
  platform_fee                integer not null,
  tutor_share                 integer not null,
  currency                    text not null default 'pln',
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text unique,
  notes                       text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
create index if not exists bookings_student_idx on public.bookings(student_id);
create index if not exists bookings_tutor_idx   on public.bookings(tutor_id);
create index if not exists bookings_status_idx  on public.bookings(status);

-- ---------- PAYMENTS -------------------------------------------------------
create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null unique references public.bookings(id) on delete cascade,
  status              public.payment_status not null default 'pending',
  amount              integer not null,
  platform_fee        integer not null,
  tutor_share         integer not null,
  currency            text not null default 'pln',
  stripe_charge_id    text,
  stripe_transfer_id  text,
  raw_event           jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------- REVIEWS --------------------------------------------------------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  tutor_id   uuid not null references public.profiles(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now()
);
create index if not exists reviews_tutor_idx on public.reviews(tutor_id);

-- ---------- FAVORITES ------------------------------------------------------
create table if not exists public.favorites (
  student_id uuid not null references public.profiles(id) on delete cascade,
  tutor_id   uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, tutor_id)
);

-- ---------- ADMIN AUDIT ----------------------------------------------------
create table if not exists public.admin_actions (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid not null references public.profiles(id) on delete restrict,
  action      text not null,
  target_type text not null,
  target_id   text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

-- ---------- TRIGGERS -------------------------------------------------------
-- updated_at auto-bump
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ begin
  create trigger profiles_updated      before update on public.profiles       for each row execute function public.tg_set_updated_at();
  create trigger tutor_profiles_updated before update on public.tutor_profiles for each row execute function public.tg_set_updated_at();
  create trigger listings_updated      before update on public.listings       for each row execute function public.tg_set_updated_at();
  create trigger bookings_updated      before update on public.bookings       for each row execute function public.tg_set_updated_at();
  create trigger payments_updated      before update on public.payments       for each row execute function public.tg_set_updated_at();
exception when duplicate_object then null; end $$;

-- Auto-create profile + user_roles + tutor_profiles on new auth user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role public.user_role := coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student');
  v_name text := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, v_name, v_role);

  insert into public.user_roles (user_id, role) values (new.id, v_role);

  if v_role = 'tutor' then
    insert into public.tutor_profiles (user_id) values (new.id);
  end if;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: current user's role (used by RLS policies)
create or replace function public.current_role()
returns public.user_role language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;
