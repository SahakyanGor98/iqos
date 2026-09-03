-- ============================================================================
-- Migration: gadget swatch colors — make color variants fully data-driven
-- Run in Supabase Dashboard → SQL Editor.
-- ----------------------------------------------------------------------------
-- Backfills `attributes.hex` on gadget rows so the storefront swatch renders
-- straight from the DB (getDeviceColorSwatch's customHex path) instead of the
-- hardcoded DEVICE_COLOR_SWATCH_MAP, which is being removed. Accessories already
-- carry `attributes.hex`. Values mirror the previous frontend map — EXCEPT
-- Digital Violet, intentionally corrected to #a9b2db.
--
-- `||` merges the key into the existing jsonb (idempotent — safe to re-run).
-- ============================================================================

update public.products set attributes = attributes || '{"hex":"#CBFCFD"}'::jsonb
  where category = 'gadget' and attributes->>'color' = 'Breeze Blue';

update public.products set attributes = attributes || '{"hex":"#a9b2db"}'::jsonb
  where category = 'gadget' and attributes->>'color' = 'Digital Violet';   -- target fix

update public.products set attributes = attributes || '{"hex":"#18181b"}'::jsonb
  where category = 'gadget' and attributes->>'color' = 'Midnight Black';

update public.products set attributes = attributes || '{"hex":"#059669"}'::jsonb
  where category = 'gadget' and attributes->>'color' = 'Aspen Green';

update public.products set attributes = attributes || '{"hex":"#573044"}'::jsonb
  where category = 'gadget' and attributes->>'color' = 'Garnet Red';

update public.products set attributes = attributes || '{"hex":"#272361"}'::jsonb
  where category = 'gadget' and attributes->>'colorVariantName' = 'Electric Purple';

-- Seletti editions: swatch is hidden (single-variant lines), set for
-- completeness so the map can be safely deleted. `hex` holds a CSS gradient
-- (a valid `background` value for getDeviceColorSwatch).
update public.products set attributes = attributes
  || jsonb_build_object('hex', 'linear-gradient(135deg, #d4af37 0%, #fef08a 50%, #b45309 100%)')
  where category = 'gadget' and attributes->>'line' ilike '%seletti%';
