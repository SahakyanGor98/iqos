'use server';

import { getProducts, getProductsBySlugs } from '@/lib/api';
import type { ProductRow } from '@/types/supabase';

/**
 * Server Actions for Client Components that need catalog data.
 *
 * lib/api.ts is `server-only`, so Client Components cannot import it directly.
 * They call these thin wrappers instead — the Supabase read stays on the server
 * and never ships to the browser bundle.
 */

/** Resolve a set of product slugs (compare share-link hydration). */
export async function fetchCompareProductsBySlugs(slugs: string[]): Promise<ProductRow[]> {
  if (!slugs || slugs.length === 0) return [];
  return getProductsBySlugs(slugs);
}

/** List comparison candidates for a category (compare "add product" modal). */
export async function fetchCompareCandidates(
  category: 'gadget' | 'sticks' | 'water' | 'accessories',
): Promise<ProductRow[]> {
  const res = await getProducts({
    category: category === 'accessories' ? 'gadget' : category,
    limit: 100,
  });
  return res.data ?? [];
}
