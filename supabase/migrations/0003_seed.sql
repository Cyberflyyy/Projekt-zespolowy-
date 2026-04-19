-- ============================================================================
-- 0003_seed.sql — reference taxonomy
-- ============================================================================

insert into public.subjects (slug, name, category) values
  ('matematyka',   'Matematyka',        'Ścisłe'),
  ('fizyka',       'Fizyka',            'Ścisłe'),
  ('chemia',       'Chemia',            'Ścisłe'),
  ('informatyka',  'Informatyka',       'Ścisłe'),
  ('biologia',     'Biologia',          'Przyrodnicze'),
  ('jezyk-polski', 'Język polski',      'Humanistyczne'),
  ('jezyk-angielski','Język angielski', 'Języki'),
  ('jezyk-niemiecki','Język niemiecki', 'Języki'),
  ('jezyk-hiszpanski','Język hiszpański','Języki'),
  ('historia',     'Historia',          'Humanistyczne'),
  ('geografia',    'Geografia',         'Humanistyczne'),
  ('wos',          'Wiedza o społeczeństwie','Humanistyczne'),
  ('ekonomia',     'Ekonomia',          'Biznes'),
  ('programowanie','Programowanie',     'IT'),
  ('muzyka',       'Muzyka',            'Artystyczne')
on conflict (slug) do nothing;
