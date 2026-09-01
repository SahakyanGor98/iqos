'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { FLAG_KEYS } from '@/lib/settings';

/**
 * Toggle a single feature flag. Called from the admin SettingsForm (client).
 *
 * Security: runs under the signed-in admin's JWT via the cookie-bound server
 * client, so the `authenticated update` RLS policy on site_settings enforces
 * the write. getUser() is re-checked here as defense-in-depth on top of the
 * /admin route gate (middleware + layout).
 *
 * After a successful write it revalidates the root layout (and sitemap) so ISR
 * storefront pages (banners, nav/footer, homepage promo, accessories route,
 * sitemap) re-run the flag reads and reflect the change on the next request.
 */

const updateSchema = z.object({
  key: z.enum(FLAG_KEYS),
  value: z.boolean(),
});

export type UpdateSettingResult = { success: true } | { error: string };

export async function updateSiteSetting(input: {
  key: (typeof FLAG_KEYS)[number];
  value: boolean;
}): Promise<UpdateSettingResult> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Некорректные данные настройки' };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Не авторизовано' };
  }

  const { error } = await supabase
    .from('site_settings')
    .update({ value: parsed.data.value, updated_by: user.id })
    .eq('key', parsed.data.key);

  if (error) {
    console.error('[site_settings] update failed:', error.message);
    return { error: 'Не удалось сохранить настройку' };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/settings');

  return { success: true };
}
