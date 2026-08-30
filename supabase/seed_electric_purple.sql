-- SQL script to insert/update IQOS ILUMA i Electric Purple products in Supabase
-- Run this query in your Supabase SQL Editor.

INSERT INTO public.products (
  slug,
  title,
  description,
  image,
  price,
  category,
  in_stock,
  badges,
  attributes,
  brand
)
VALUES
(
  'iqos-iluma-i-prime-electric-purple',
  'IQOS ILUMA i PRIME Electric Purple',
  'Нагреватель табака IQOS ILUMA i PRIME Electric Purple — флагманская модель серии IQOS ILUMA i с сенсорным экраном, режимом паузы (Pause Mode), гибким выбором сеансов FlexPuff и изысканным корпусом в ярком цвете Electric Purple.',
  ARRAY[
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-1.webp',
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-2.webp',
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-3.webp'
  ],
  14000,
  'gadget',
  true,
  '{"isNew": true, "isHit": false, "isExclusive": false}'::jsonb,
  '{"line": "i prime", "color": "Фиолетовый", "colorVariantName": "Electric Purple"}'::jsonb,
  'IQOS'
),
(
  'iqos-iluma-i-electric-purple',
  'IQOS ILUMA i Electric Purple',
  'Нагреватель табака IQOS ILUMA i Electric Purple — инновационная модель с интерактивным сенсорным дисплеем, функцией паузы, режимом сохранения аккумулятора и индукционным нагревом Smartcore INDUCTION SYSTEM™ в стильном цвете Electric Purple.',
  ARRAY[
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-4.webp',
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-5.webp',
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-6.webp'
  ],
  11500,
  'gadget',
  true,
  '{"isNew": true, "isHit": false, "isExclusive": false}'::jsonb,
  '{"line": "i", "color": "Фиолетовый", "colorVariantName": "Electric Purple"}'::jsonb,
  'IQOS'
),
(
  'iqos-iluma-i-one-electric-purple',
  'IQOS ILUMA i ONE Electric Purple',
  'Нагреватель табака IQOS ILUMA i ONE Electric Purple — компактное устройство формата «всё в одном», рассчитанное до 20 сеансов без подзарядки, с индукционным нагревом и ярким дизайном в цвете Electric Purple.',
  ARRAY[
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-7.webp',
    'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/iqos-illuma-i-prime-electric-purple-8.webp'
  ],
  9000,
  'gadget',
  true,
  '{"isNew": true, "isHit": false, "isExclusive": false}'::jsonb,
  '{"line": "i-one", "color": "Фиолетовый", "colorVariantName": "Electric Purple"}'::jsonb,
  'IQOS'
)
ON CONFLICT (slug) 
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  in_stock = EXCLUDED.in_stock,
  badges = EXCLUDED.badges,
  attributes = EXCLUDED.attributes,
  brand = EXCLUDED.brand;
