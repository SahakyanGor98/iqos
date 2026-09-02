-- ============================================================================
-- Migration: page feature flags — Compare / Trade-In / About / Contact
-- Run in Supabase Dashboard → SQL Editor.
-- ----------------------------------------------------------------------------
-- Adds these pages to the site_settings 'pages' group so they can be toggled
-- from /admin/settings. Unlike accessories (intentionally off), these pages are
-- LIVE, so they seed as value = true (enabled) — matching the code default in
-- lib/settings.ts, so the pages stay reachable whether or not this has run yet.
-- ============================================================================

insert into public.site_settings (key, value, group_name, label, description, sort_order)
values
  ('page_compare', 'true'::jsonb, 'pages', 'Страница «Сравнение»', 'Сравнение товаров (/compare).', 2),
  ('page_tradein', 'true'::jsonb, 'pages', 'Страница «Трейд-ин»', 'Программа трейд-ин (/trade-in).', 3),
  ('page_about',   'true'::jsonb, 'pages', 'Страница «Об IQOS»', 'Информация о бренде (/about/iqos).', 4),
  ('page_contact', 'true'::jsonb, 'pages', 'Страница «Контакты»', 'Контактная страница (/contact).', 5)
on conflict (key) do nothing;
