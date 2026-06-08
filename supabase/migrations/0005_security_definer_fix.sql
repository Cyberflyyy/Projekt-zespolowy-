-- ============================================================================
-- 0005_security_definer_fix.sql
-- Fix infinite RLS recursion: is_admin() and current_role() query the profiles
-- table, which has an "admin all" policy that also calls is_admin(). Adding
-- SECURITY DEFINER makes these functions run as the function owner (superuser)
-- which bypasses RLS on the inner profiles query, breaking the cycle.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.current_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Allow booking participants (student AND tutor) to read their booking's listing
-- even when the listing is inactive (tutor may deactivate listing after booking is made).
DROP POLICY IF EXISTS "listings booking participant read" ON public.listings;
CREATE POLICY "listings booking participant read"
  ON public.listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.listing_id = listings.id
        AND (b.student_id = auth.uid() OR b.tutor_id = auth.uid())
    )
  );
