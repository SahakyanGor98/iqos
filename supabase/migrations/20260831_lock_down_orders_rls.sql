-- ============================================================================
-- Migration: lock down orders / order_items from the public (anon) API
-- Run in Supabase Dashboard → SQL Editor.
-- ----------------------------------------------------------------------------
-- Context: the site has no user accounts — every visitor is an anonymous guest.
-- Guests must be able to CREATE orders (checkout / trade-in), but must NOT be
-- able to READ them. Order writes now happen server-side with the SERVICE ROLE
-- key (see lib/supabase-admin.ts), which bypasses RLS — so anon needs no policy
-- at all on these tables. Enabling RLS with zero policies denies the anon key
-- entirely while server actions continue to work.
--
-- ⚠️ Deploy the code that uses the service-role client BEFORE running this, so
--    there is no window where checkout/trade-in still write with the anon key.
--    (The service-role client works whether or not RLS is enabled, so deploying
--    it early is safe.)
--
-- Note: `contact_messages` is intentionally left as-is — it already allows anon
-- INSERT (guests submit the contact form) with no anon SELECT.
-- ============================================================================

-- Remove every existing policy on these tables (names unknown / may include a
-- permissive public-read policy) so nothing keeps them readable by anon.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('orders', 'order_items')
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- After running, the public anon key should get an empty/denied result on
-- SELECT from orders / order_items, while products stays publicly readable.
