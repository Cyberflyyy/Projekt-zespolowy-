-- ============================================================================
-- 0004_mock_tutors.sql — mock tutors for development/testing
-- Run in Supabase SQL Editor (service-role has access to auth.users)
-- ============================================================================

do $$
declare
  uid_anna      uuid := 'a1000000-0000-0000-0000-000000000001';
  uid_marek     uuid := 'a1000000-0000-0000-0000-000000000002';
  uid_karolina  uuid := 'a1000000-0000-0000-0000-000000000003';
  uid_piotr     uuid := 'a1000000-0000-0000-0000-000000000004';
  uid_ewa       uuid := 'a1000000-0000-0000-0000-000000000005';
  uid_tomasz    uuid := 'a1000000-0000-0000-0000-000000000006';
  uid_natalia   uuid := 'a1000000-0000-0000-0000-000000000007';
  uid_jakub     uuid := 'a1000000-0000-0000-0000-000000000008';

  sub_mat  uuid; sub_fiz  uuid; sub_inf  uuid; sub_ang  uuid;
  sub_pol  uuid; sub_his  uuid; sub_che  uuid; sub_pro  uuid;
  sub_eko  uuid; sub_muz  uuid; sub_hisz uuid; sub_nem  uuid;

begin

  -- ── fetch subject ids ─────────────────────────────────────────────────────
  select id into sub_mat  from public.subjects where slug = 'matematyka';
  select id into sub_fiz  from public.subjects where slug = 'fizyka';
  select id into sub_inf  from public.subjects where slug = 'informatyka';
  select id into sub_ang  from public.subjects where slug = 'jezyk-angielski';
  select id into sub_pol  from public.subjects where slug = 'jezyk-polski';
  select id into sub_his  from public.subjects where slug = 'historia';
  select id into sub_che  from public.subjects where slug = 'chemia';
  select id into sub_pro  from public.subjects where slug = 'programowanie';
  select id into sub_eko  from public.subjects where slug = 'ekonomia';
  select id into sub_muz  from public.subjects where slug = 'muzyka';
  select id into sub_hisz from public.subjects where slug = 'jezyk-hiszpanski';
  select id into sub_nem  from public.subjects where slug = 'jezyk-niemiecki';

  -- ── insert auth users (trigger auto-creates profiles + tutor_profiles) ────
  insert into auth.users (
    id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data
  ) values
    (uid_anna,    'authenticated', 'authenticated', 'anna.kowalska@mock.dev',    crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Anna Kowalska"}'::jsonb),
    (uid_marek,   'authenticated', 'authenticated', 'marek.nowak@mock.dev',      crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Marek Nowak"}'::jsonb),
    (uid_karolina,'authenticated', 'authenticated', 'karolina.wisniewska@mock.dev', crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Karolina Wiśniewska"}'::jsonb),
    (uid_piotr,   'authenticated', 'authenticated', 'piotr.zajac@mock.dev',      crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Piotr Zając"}'::jsonb),
    (uid_ewa,     'authenticated', 'authenticated', 'ewa.dabrowska@mock.dev',    crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Ewa Dąbrowska"}'::jsonb),
    (uid_tomasz,  'authenticated', 'authenticated', 'tomasz.krawczyk@mock.dev',  crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Tomasz Krawczyk"}'::jsonb),
    (uid_natalia, 'authenticated', 'authenticated', 'natalia.szymanska@mock.dev',crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Natalia Szymańska"}'::jsonb),
    (uid_jakub,   'authenticated', 'authenticated', 'jakub.wozniak@mock.dev',    crypt('Mock1234!', gen_salt('bf')), now(), now(), now(),
     '{"role":"tutor","full_name":"Jakub Woźniak"}'::jsonb)
  on conflict (id) do nothing;

  -- ── enrich tutor_profiles ─────────────────────────────────────────────────
  update public.tutor_profiles set
    headline         = 'Matematyk z pasją – matura i olimpiady',
    bio              = 'Jestem nauczycielem matematyki z 10-letnim doświadczeniem. Specjalizuję się w przygotowaniu do matury rozszerzonej i olimpiad matematycznych. Moje zajęcia są interaktywne i dostosowane do tempa ucznia.',
    hourly_rate      = 12000,
    lesson_format    = 'both',
    years_experience = 10,
    city             = 'Warszawa',
    languages        = array['polski','angielski'],
    is_published     = true,
    rating_avg       = 4.9,
    rating_count     = 47
  where user_id = uid_anna;

  update public.tutor_profiles set
    headline         = 'Fizyk i programista – od teorii do praktyki',
    bio              = 'Absolwent Politechniki Warszawskiej. Uczę fizyki i informatyki na poziomie szkoły średniej i studenckiego. Tłumaczę trudne pojęcia prostym językiem, bez zbędnego stresu.',
    hourly_rate      = 10000,
    lesson_format    = 'online',
    years_experience = 6,
    city             = 'Kraków',
    languages        = array['polski'],
    is_published     = true,
    rating_avg       = 4.7,
    rating_count     = 31
  where user_id = uid_marek;

  update public.tutor_profiles set
    headline         = 'Native speaker angielskiego – konwersacje i egzaminy',
    bio              = 'Mieszkałam 5 lat w Londynie, pracując jako tłumaczka. Uczę angielskiego na każdym poziomie: od podstaw po FCE/CAE. Stawiam na konwersacje i naturalną komunikację.',
    hourly_rate      = 9000,
    lesson_format    = 'online',
    years_experience = 8,
    city             = 'Wrocław',
    languages        = array['polski','angielski'],
    is_published     = true,
    rating_avg       = 4.8,
    rating_count     = 63
  where user_id = uid_karolina;

  update public.tutor_profiles set
    headline         = 'Chemik – matury, studia, olimpiady',
    bio              = 'Doktorant chemii organicznej na UW. Pomagam zrozumieć chemię od podstaw aż po poziom olimpijski. Moje notatki i materiały są zawsze gotowe przed zajęciami.',
    hourly_rate      = 11000,
    lesson_format    = 'both',
    years_experience = 5,
    city             = 'Warszawa',
    languages        = array['polski','angielski'],
    is_published     = true,
    rating_avg       = 4.6,
    rating_count     = 22
  where user_id = uid_piotr;

  update public.tutor_profiles set
    headline         = 'Polonistka – matura ustna, pisanie, literatura',
    bio              = 'Nauczyciel dyplomowany z 15-letnim stażem. Specjalizuję się w przygotowaniu do matury z języka polskiego: wypracowania, analiza tekstów, matura ustna. Prowadzę zajęcia w miłej atmosferze.',
    hourly_rate      = 8500,
    lesson_format    = 'both',
    years_experience = 15,
    city             = 'Gdańsk',
    languages        = array['polski'],
    is_published     = true,
    rating_avg       = 4.95,
    rating_count     = 88
  where user_id = uid_ewa;

  update public.tutor_profiles set
    headline         = 'Programista full-stack – Python, JS, React',
    bio              = 'Senior developer z 8-letnim doświadczeniem komercyjnym. Uczę programowania od zera: Python, JavaScript, React, bazy danych. Idealne zajęcia dla osób zmieniających branżę lub studentów informatyki.',
    hourly_rate      = 15000,
    lesson_format    = 'online',
    years_experience = 8,
    city             = 'Poznań',
    languages        = array['polski','angielski'],
    is_published     = true,
    rating_avg       = 4.85,
    rating_count     = 39
  where user_id = uid_tomasz;

  update public.tutor_profiles set
    headline         = 'Hispanistka – od zera do B2 w rok',
    bio              = 'Studiowałam filologię hiszpańską na UAM, rok akademicki spędziłam w Barcelonie. Uczę hiszpańskiego w ciekawy sposób – przez filmy, muzykę i rozmowy. Przygotowuję też do DELE.',
    hourly_rate      = 8000,
    lesson_format    = 'online',
    years_experience = 4,
    city             = 'Poznań',
    languages        = array['polski','hiszpański','angielski'],
    is_published     = true,
    rating_avg       = 4.75,
    rating_count     = 18
  where user_id = uid_natalia;

  update public.tutor_profiles set
    headline         = 'Ekonomista i przedsiębiorca – ekonomia i matematyka',
    bio              = 'MBA i 12 lat w biznesie. Uczę ekonomii i matematyki finansowej na poziomie szkoły średniej i studiów. Łączę teorię z praktycznymi przykładami ze świata biznesu.',
    hourly_rate      = 13000,
    lesson_format    = 'both',
    years_experience = 12,
    city             = 'Warszawa',
    languages        = array['polski','angielski','niemiecki'],
    is_published     = true,
    rating_avg       = 4.7,
    rating_count     = 25
  where user_id = uid_jakub;

  -- ── listings ──────────────────────────────────────────────────────────────

  -- Anna – matematyka
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_anna, sub_mat, 'Matematyka – matura rozszerzona', 'Kompleksowe przygotowanie do matury rozszerzonej. Analizujemy arkusze z ostatnich 10 lat.', 'high_school', 12000, 60, true),
    (uid_anna, sub_mat, 'Matematyka – olimpiada', 'Trudniejsze zadania i techniki olimpijskie dla ambitnych uczniów.', 'high_school', 14000, 90, true)
  on conflict do nothing;

  -- Marek – fizyka + informatyka
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_marek, sub_fiz, 'Fizyka ogólna – szkoła średnia', 'Mechanika, termodynamika, elektromagnetyzm – wszystko jasno i bez stresu.', 'high_school', 10000, 60, true),
    (uid_marek, sub_inf, 'Informatyka – podstawy i algorytmy', 'Programowanie w Pythonie, podstawy algorytmiki, przygotowanie do matury z informatyki.', 'high_school', 10000, 60, true)
  on conflict do nothing;

  -- Karolina – angielski
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_karolina, sub_ang, 'Angielski – konwersacje B1/B2', 'Swobodne rozmowy, poprawianie wymowy, poszerzanie słownictwa.', 'adult', 9000, 60, true),
    (uid_karolina, sub_ang, 'Przygotowanie do FCE/CAE', 'Pełny kurs przygotowujący do egzaminów Cambridge – reading, writing, speaking, use of english.', 'adult', 11000, 90, true)
  on conflict do nothing;

  -- Piotr – chemia
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_piotr, sub_che, 'Chemia – matura podstawowa i rozszerzona', 'Przygotowanie do matury: stechiometria, reakcje, chemia organiczna.', 'high_school', 11000, 60, true),
    (uid_piotr, sub_che, 'Chemia – poziom olimpijski', 'Zaawansowane zadania dla uczestników olimpiad chemicznych.', 'high_school', 13000, 90, true)
  on conflict do nothing;

  -- Ewa – język polski
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_ewa, sub_pol, 'Język polski – matura pisemna', 'Jak pisać dobre wypracowanie? Analiza i interpretacja tekstów literackich.', 'high_school', 8500, 60, true),
    (uid_ewa, sub_pol, 'Język polski – matura ustna', 'Przygotowanie do prezentacji i rozmowy z egzaminatorem.', 'high_school', 8500, 60, true)
  on conflict do nothing;

  -- Tomasz – programowanie
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_tomasz, sub_pro, 'Python od zera', 'Kurs dla absolutnych początkujących – zmienne, pętle, funkcje, OOP.', 'adult', 15000, 60, true),
    (uid_tomasz, sub_pro, 'React i JavaScript – frontend', 'Tworzenie nowoczesnych aplikacji webowych. Hooks, state, API calls.', 'university', 15000, 90, true)
  on conflict do nothing;

  -- Natalia – hiszpański
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_natalia, sub_hisz, 'Hiszpański – od zera do A2', 'Podstawy języka: alfabet, wymowa, gramatyka, słownictwo na co dzień.', 'adult', 8000, 60, true),
    (uid_natalia, sub_hisz, 'Hiszpański – przygotowanie do DELE B1/B2', 'Pełne przygotowanie do egzaminu DELE na poziomie B1 lub B2.', 'adult', 9500, 90, true)
  on conflict do nothing;

  -- Jakub – ekonomia + matematyka
  insert into public.listings (tutor_id, subject_id, title, description, level, price, duration_minutes, is_active)
  values
    (uid_jakub, sub_eko, 'Ekonomia – szkoła średnia i studia', 'Mikroekonomia, makroekonomia, analiza rynków. Teoria poparta prawdziwymi przykładami.', 'university', 13000, 60, true),
    (uid_jakub, sub_mat, 'Matematyka finansowa', 'Procent składany, wartość pieniądza w czasie, podstawy statystyki dla ekonomistów.', 'university', 13000, 60, true)
  on conflict do nothing;

end $$;
