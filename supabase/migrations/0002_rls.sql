-- ============================================================================
-- 0002_rls.sql — row level security
-- ============================================================================

alter table public.profiles          enable row level security;
alter table public.user_roles        enable row level security;
alter table public.tutor_profiles    enable row level security;
alter table public.subjects          enable row level security;
alter table public.listings          enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings          enable row level security;
alter table public.payments          enable row level security;
alter table public.reviews           enable row level security;
alter table public.favorites         enable row level security;
alter table public.admin_actions     enable row level security;

-- ---------- PROFILES -------------------------------------------------------
drop policy if exists "profiles self read"   on public.profiles;
drop policy if exists "profiles public read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "profiles admin all"   on public.profiles;

create policy "profiles self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles public read" on public.profiles for select using (role = 'tutor');
create policy "profiles self update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles admin all"   on public.profiles for all    using (public.is_admin()) with check (public.is_admin());

-- ---------- USER ROLES -----------------------------------------------------
drop policy if exists "user_roles self read" on public.user_roles;
drop policy if exists "user_roles admin all" on public.user_roles;

create policy "user_roles self read" on public.user_roles for select using (auth.uid() = user_id);
create policy "user_roles admin all" on public.user_roles for all    using (public.is_admin()) with check (public.is_admin());

-- ---------- TUTOR PROFILES -------------------------------------------------
drop policy if exists "tutor_profiles public read" on public.tutor_profiles;
drop policy if exists "tutor_profiles owner all"   on public.tutor_profiles;
drop policy if exists "tutor_profiles admin all"   on public.tutor_profiles;

create policy "tutor_profiles public read" on public.tutor_profiles for select using (is_published = true);
create policy "tutor_profiles owner all"   on public.tutor_profiles for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tutor_profiles admin all"   on public.tutor_profiles for all    using (public.is_admin()) with check (public.is_admin());

-- ---------- SUBJECTS (public reference data) -------------------------------
drop policy if exists "subjects public read" on public.subjects;
drop policy if exists "subjects admin write" on public.subjects;

create policy "subjects public read" on public.subjects for select using (true);
create policy "subjects admin write" on public.subjects for all    using (public.is_admin()) with check (public.is_admin());

-- ---------- LISTINGS -------------------------------------------------------
drop policy if exists "listings public read" on public.listings;
drop policy if exists "listings owner all"   on public.listings;
drop policy if exists "listings admin all"   on public.listings;

create policy "listings public read" on public.listings for select using (is_active = true);
create policy "listings owner all"   on public.listings for all    using (auth.uid() = tutor_id) with check (auth.uid() = tutor_id);
create policy "listings admin all"   on public.listings for all    using (public.is_admin()) with check (public.is_admin());

-- ---------- AVAILABILITY ---------------------------------------------------
drop policy if exists "slots public read"  on public.availability_slots;
drop policy if exists "slots owner all"    on public.availability_slots;
drop policy if exists "slots admin all"    on public.availability_slots;

create policy "slots public read" on public.availability_slots for select using (true);
create policy "slots owner all"   on public.availability_slots for all    using (auth.uid() = tutor_id) with check (auth.uid() = tutor_id);
create policy "slots admin all"   on public.availability_slots for all    using (public.is_admin()) with check (public.is_admin());

-- ---------- BOOKINGS -------------------------------------------------------
drop policy if exists "bookings student read"   on public.bookings;
drop policy if exists "bookings tutor read"     on public.bookings;
drop policy if exists "bookings student insert" on public.bookings;
drop policy if exists "bookings admin all"      on public.bookings;

create policy "bookings student read"
  on public.bookings for select using (auth.uid() = student_id);

create policy "bookings tutor read"
  on public.bookings for select using (auth.uid() = tutor_id);

create policy "bookings student insert"
  on public.bookings for insert
  with check (auth.uid() = student_id and public.current_role() = 'student');

create policy "bookings admin all"
  on public.bookings for all using (public.is_admin()) with check (public.is_admin());

-- ---------- PAYMENTS -------------------------------------------------------
-- Reads allowed to involved parties; mutations only via service-role (webhook)
drop policy if exists "payments student read" on public.payments;
drop policy if exists "payments tutor read"   on public.payments;
drop policy if exists "payments admin all"    on public.payments;

create policy "payments student read"
  on public.payments for select
  using (exists (select 1 from public.bookings b where b.id = payments.booking_id and b.student_id = auth.uid()));

create policy "payments tutor read"
  on public.payments for select
  using (exists (select 1 from public.bookings b where b.id = payments.booking_id and b.tutor_id = auth.uid()));

create policy "payments admin all"
  on public.payments for all using (public.is_admin()) with check (public.is_admin());

-- ---------- REVIEWS --------------------------------------------------------
drop policy if exists "reviews public read"   on public.reviews;
drop policy if exists "reviews student insert" on public.reviews;
drop policy if exists "reviews admin all"     on public.reviews;

create policy "reviews public read"   on public.reviews for select using (true);
create policy "reviews student insert" on public.reviews for insert
  with check (auth.uid() = student_id
              and exists (select 1 from public.bookings b
                          where b.id = booking_id
                            and b.student_id = auth.uid()
                            and b.status = 'completed'));
create policy "reviews admin all"     on public.reviews for all using (public.is_admin()) with check (public.is_admin());

-- ---------- FAVORITES ------------------------------------------------------
drop policy if exists "favorites owner all" on public.favorites;

create policy "favorites owner all" on public.favorites for all
  using (auth.uid() = student_id) with check (auth.uid() = student_id);

-- ---------- ADMIN ACTIONS --------------------------------------------------
drop policy if exists "admin_actions admin all" on public.admin_actions;

create policy "admin_actions admin all" on public.admin_actions for all
  using (public.is_admin()) with check (public.is_admin());
