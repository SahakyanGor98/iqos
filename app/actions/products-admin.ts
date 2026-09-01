'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  CATEGORY_ROUTE,
  type ProductCategory,
  type ProductInput,
  productInputSchema,
} from '@/lib/product-form';

/**
 * Product create / update / delete. `products` writes bypass RLS via the
 * service-role client, gated by an admin auth re-check. Payloads are validated
 * against productInputSchema (also enforced client-side). Every mutation
 * revalidates the admin list, the dashboard, and the affected PUBLIC catalog
 * pages (listing + detail + sitemap) so the storefront reflects the change.
 */

export type ProductActionResult = { success: true; id: number } | { error: string };

async function isAuthed(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user);
}

function revalidateProduct(category: ProductCategory, slug: string) {
  revalidatePath('/admin/products');
  revalidatePath('/admin');
  const route = CATEGORY_ROUTE[category];
  revalidatePath(`/products/${route}`);
  revalidatePath(`/products/${route}/${slug}`);
  revalidatePath('/sitemap.xml');
}

function toRow(input: ProductInput) {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description || null,
    image: input.image,
    price: input.price,
    category: input.category,
    in_stock: input.in_stock,
    brand: input.brand || null,
    badges: input.badges,
    attributes: input.attributes,
  };
}

export async function createProduct(input: ProductInput): Promise<ProductActionResult> {
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Некорректные данные' };
  }
  if (!(await isAuthed())) {
    return { error: 'Не авторизовано' };
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(toRow(parsed.data))
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') return { error: 'Товар с таким slug уже существует' };
    console.error('[products] create failed:', error.message);
    return { error: 'Не удалось создать товар' };
  }

  revalidateProduct(parsed.data.category, parsed.data.slug);
  return { success: true, id: data.id };
}

export async function updateProduct(id: number, input: ProductInput): Promise<ProductActionResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: 'Некорректный id' };
  }
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Некорректные данные' };
  }
  if (!(await isAuthed())) {
    return { error: 'Не авторизовано' };
  }

  const { error } = await supabaseAdmin.from('products').update(toRow(parsed.data)).eq('id', id);

  if (error) {
    if (error.code === '23505') return { error: 'Товар с таким slug уже существует' };
    console.error('[products] update failed:', error.message);
    return { error: 'Не удалось сохранить товар' };
  }

  revalidateProduct(parsed.data.category, parsed.data.slug);
  return { success: true, id };
}

export async function deleteProduct(id: number): Promise<ProductActionResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: 'Некорректный id' };
  }
  if (!(await isAuthed())) {
    return { error: 'Не авторизовано' };
  }

  // Read category/slug first so we can revalidate the right catalog pages.
  const { data: existing } = await supabaseAdmin
    .from('products')
    .select('category, slug')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    // Foreign-key violation: the product is referenced by order_items.
    if (error.code === '23503') {
      return {
        error: 'Нельзя удалить: товар присутствует в заказах. Отметьте его как «нет в наличии».',
      };
    }
    console.error('[products] delete failed:', error.message);
    return { error: 'Не удалось удалить товар' };
  }

  if (existing) {
    revalidateProduct(existing.category as ProductCategory, existing.slug);
  } else {
    revalidatePath('/admin/products');
    revalidatePath('/admin');
  }
  return { success: true, id };
}
