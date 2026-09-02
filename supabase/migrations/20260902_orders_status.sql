-- ============================================================================
-- Migration: orders.status lifecycle — constrain to the admin order pipeline
-- Run in Supabase Dashboard → SQL Editor.
-- ----------------------------------------------------------------------------
-- Introduces a fixed status set (pending → confirmed → shipped → completed,
-- plus cancelled) for the admin Orders screen. Mirrors the order_type CHECK +
-- index already on this table. Existing rows are all 'pending' (valid), so the
-- constraint applies cleanly.
-- ============================================================================

-- Backfill any legacy null/empty status (none today) so NOT NULL + CHECK hold.
update public.orders set status = 'pending' where status is null or status = '';

alter table public.orders
  alter column status set default 'pending';

alter table public.orders
  alter column status set not null;

alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending', 'confirmed', 'shipped', 'completed', 'cancelled'));

create index if not exists orders_status_idx on public.orders (status);
