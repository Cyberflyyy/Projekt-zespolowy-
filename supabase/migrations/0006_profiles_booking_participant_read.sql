-- Allow booking participants to read each other's profile (tutor sees student name, student sees tutor name)
DROP POLICY IF EXISTS "profiles booking participant read" ON public.profiles;
CREATE POLICY "profiles booking participant read"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE (b.student_id = auth.uid() AND b.tutor_id = profiles.id)
         OR (b.tutor_id = auth.uid() AND b.student_id = profiles.id)
    )
  );
