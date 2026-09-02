'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const signInSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export type SignInResult = { error: string } | void;

/**
 * Sign in with email + password. Uses the cookie-bound server client so the
 * session cookie is written to the response. Returns { error } on failure;
 * on success it redirects to /admin (no value returned).
 */
export async function signIn(data: { email: string; password: string }): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Неверные данные' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'Неверный email или пароль' };
  }

  revalidatePath('/admin', 'layout');
  redirect('/admin');
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
