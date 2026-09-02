import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { type AdminProduct, PRODUCT_CATEGORIES } from '@/lib/product-form';

/**
 * Admin product reads. `products` has public SELECT under RLS, but the admin
 * screens use the service-role client for consistency with the writes (which
 * must bypass the write-less RLS). Covers all catalog categories including
 * accessories (see PRODUCT_CATEGORIES).
 */

const PRODUCT_COLUMNS =
  'id, created_at, slug, title, description, image, price, category, in_stock, brand, badges, attributes';

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(PRODUCT_COLUMNS)
    .in('category', PRODUCT_CATEGORIES as unknown as string[])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[products] read failed:', error.message);
    return [];
  }

  return (data ?? []) as AdminProduct[];
}

export async function getAdminProductById(id: number): Promise<AdminProduct | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[products] detail read failed:', error.message);
    return null;
  }

  return (data as AdminProduct | null) ?? null;
}
