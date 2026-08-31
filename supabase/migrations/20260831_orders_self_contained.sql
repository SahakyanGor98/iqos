-- ============================================================================
-- Migration: make `orders` self-contained + support trade-in orders
-- Run in Supabase Dashboard → SQL Editor. Safe to run once (idempotent).
-- ----------------------------------------------------------------------------
-- Adds:
--   order_type : 'purchase' | 'trade_in'
--   discount   : amount discounted from the subtotal
--   items      : self-contained JSON snapshot of the ordered lines, so an order
--                is fully readable with no joins and survives email failure /
--                product deletion / non-catalog items (e.g. trade-in devices)
--   metadata   : order-type-specific structured extras (trade-in device info,
--                delivery address, etc.)
-- ============================================================================

alter table public.orders
  add column if not exists order_type text not null default 'purchase',
  add column if not exists discount numeric not null default 0,
  add column if not exists items jsonb not null default '[]'::jsonb,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

-- Constrain order_type to known values (drop/recreate to stay idempotent).
alter table public.orders drop constraint if exists orders_order_type_check;
alter table public.orders
  add constraint orders_order_type_check
  check (order_type in ('purchase', 'trade_in'));

-- Helpful index for a future admin panel filtering by type.
create index if not exists orders_order_type_idx on public.orders (order_type);

-- ----------------------------------------------------------------------------
-- items[] element shape (documentation):
--   { "title": text, "quantity": int, "unit_price": numeric,
--     "line_total": numeric, "product_id": int | null, "slug": text | null }
--
-- metadata shape for trade-in orders:
--   { "trade_in": {
--       "old_device": text, "old_device_id": text,
--       "target_device": text, "target_slug": text,
--       "original_price": numeric, "estimated_discount": numeric,
--       "final_price": numeric,
--       "delivery_city": "Москва", "delivery_address": text | null
--   } }
-- ----------------------------------------------------------------------------
