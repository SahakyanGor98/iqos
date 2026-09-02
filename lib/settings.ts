import 'server-only';

import { cache } from 'react';
import { supabasePublic } from '@/lib/supabase/public';

/**
 * CMS feature flags (site_settings table). Reads run through the cookie-free
 * `supabasePublic` client so storefront routes stay ISR/SSG-safe (see
 * .ai/architecture.md) — the same pattern as lib/api.ts. Wrapped in React
 * `cache()` for per-request dedupe (layout + page share one DB read). The admin
 * mutation (app/actions/settings.ts) calls `revalidatePath('/', 'layout')` so
 * ISR pages re-run these reads and pick up a toggle on the next request.
 *
 * This module is `server-only`. The read helpers are called from Server
 * Components / sitemap only; the mutation lives in app/actions/settings.ts.
 */

export const FLAG_KEYS = [
  'banner_water',
  'banner_floating_promo',
  'promo_homepage',
  'page_accessories',
  'page_compare',
  'page_tradein',
  'page_about',
  'page_contact',
] as const;

export type SiteSettingKey = (typeof FLAG_KEYS)[number];
export type SiteSettingsMap = Record<SiteSettingKey, boolean>;

/**
 * Safe fallback when a row is missing or the DB read fails — never crash a
 * storefront render. Banners/promo and the (intentionally disabled) accessories
 * page default OFF; the currently-live secondary pages default ON so they stay
 * reachable even before the page-flags migration runs (fail-open).
 */
export const DEFAULT_SITE_SETTINGS: SiteSettingsMap = {
  banner_water: false,
  banner_floating_promo: false,
  promo_homepage: false,
  page_accessories: false,
  page_compare: true,
  page_tradein: true,
  page_about: true,
  page_contact: true,
};

const FLAG_KEY_SET = new Set<string>(FLAG_KEYS);

export type SiteSettingRow = {
  key: SiteSettingKey;
  value: boolean;
  group_name: string;
  label: string;
  description: string | null;
  sort_order: number;
};

/** Per-request-deduped read. `value` is jsonb; Supabase returns it parsed. */
const getSettingsRows = cache(async () => {
  const { data, error } = await supabasePublic.from('site_settings').select('key, value');

  if (error) {
    console.error('[site_settings] read failed:', error.message);
    return [] as { key: string; value: unknown }[];
  }

  return (data ?? []) as { key: string; value: unknown }[];
});

/**
 * Full flag map for the storefront. Merges DB rows over the safe defaults so a
 * missing row / failed read degrades to "disabled" rather than throwing.
 */
export async function getSiteSettingsMap(): Promise<SiteSettingsMap> {
  const rows = await getSettingsRows();
  const map: SiteSettingsMap = { ...DEFAULT_SITE_SETTINGS };

  for (const row of rows) {
    if (FLAG_KEY_SET.has(row.key)) {
      map[row.key as SiteSettingKey] = row.value === true;
    }
  }

  return map;
}

/** Convenience gate for a single flag (page routes, sitemap). */
export async function isFeatureEnabled(key: SiteSettingKey): Promise<boolean> {
  const map = await getSiteSettingsMap();
  return map[key];
}

/**
 * Full rows for the admin settings UI (label/description/group/order). Read
 * fresh (the admin page is already dynamic + authenticated) so a saved toggle
 * is reflected immediately.
 */
export async function getSiteSettingsForAdmin(): Promise<SiteSettingRow[]> {
  const { data, error } = await supabasePublic
    .from('site_settings')
    .select('key, value, group_name, label, description, sort_order')
    .order('group_name', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[site_settings] admin read failed:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    key: row.key as SiteSettingKey,
    value: row.value === true,
    group_name: row.group_name,
    label: row.label,
    description: row.description,
    sort_order: row.sort_order,
  }));
}
