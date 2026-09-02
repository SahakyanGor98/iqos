-- ============================================================================
-- Migration: site_settings — CMS feature-flag / toggle store for the admin panel
-- Run in Supabase Dashboard → SQL Editor.
-- ----------------------------------------------------------------------------
-- Key-value model (one row per flag): scalable, granular RLS, and drives the
-- grouped admin UI directly. `value` is jsonb so it can hold booleans now and
-- richer settings later. Follows the trade_in_devices conventions: RLS on,
-- public SELECT; writes here are restricted to AUTHENTICATED admins (accounts
-- now exist) so mutations run under the user's JWT, enforced by RLS.
-- ============================================================================

create table if not exists public.site_settings (
  key         text primary key,                       -- stable flag key, e.g. 'page_accessories'
  value       jsonb not null default 'false'::jsonb,  -- boolean now; future-proof for richer settings
  group_name  text not null default 'general',        -- UI grouping: 'banners' | 'pages'
  label       text not null,                          -- admin-facing label (RU)
  description text,                                    -- admin-facing helper text
  sort_order  integer not null default 0,             -- display order within its group
  updated_at  timestamptz not null default timezone('utc'::text, now()),
  updated_by  uuid references auth.users(id)          -- who last changed it (audit)
);

alter table public.site_settings enable row level security;

-- Public read: the storefront reads flags on every render (ISR-safe anon read).
drop policy if exists "Allow public read access" on public.site_settings;
create policy "Allow public read access"
  on public.site_settings
  for select
  to public
  using (true);

-- Authenticated admin update: only signed-in admins may flip toggles. Runs
-- under the user's JWT via lib/supabase/server.ts, so RLS enforces it.
-- (No INSERT/DELETE policy — the flag catalog is seeded via this migration;
--  admins can only change existing toggles, not invent keys the frontend
--  won't read.)
drop policy if exists "Allow authenticated update" on public.site_settings;
create policy "Allow authenticated update"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);

-- Keep updated_at fresh on every write.
create or replace function public.set_site_settings_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_site_settings_updated_at();

-- Seed the current flags (idempotent on key). Values mirror today's constants
-- (all currently disabled).
insert into public.site_settings (key, value, group_name, label, description, sort_order)
values
  ('banner_water',         'false'::jsonb, 'banners', 'Баннер воды',            'Промо-баннер сопутствующей питьевой воды в шапке сайта.', 1),
  ('banner_floating_promo','false'::jsonb, 'banners', 'Плавающий промо-виджет', 'Плавающая карточка со скидкой (промокод FIRST10).',        2),
  ('promo_homepage',       'false'::jsonb, 'banners', 'Промо-блок на главной',  'Секция PromoBlock на главной странице.',                   3),
  ('page_accessories',     'false'::jsonb, 'pages',   'Страница «Аксессуары»',  'Каталог аксессуаров: маршрут, навигация и sitemap.',       1)
on conflict (key) do nothing;
