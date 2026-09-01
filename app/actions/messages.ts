'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { MESSAGE_STATUSES, type MessageStatus } from '@/lib/messages';

/**
 * Mark a contact message read / new. Called from the inbox (client).
 *
 * Auth: re-checks the signed-in admin (defense-in-depth on top of the /admin
 * route gate), then writes via the service-role client — `contact_messages` has
 * no authenticated UPDATE policy, and the established trust model for this
 * locked table is service-role server access behind the auth gate. Revalidates
 * the inbox and the dashboard (its "new messages" count).
 */

const updateSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(MESSAGE_STATUSES),
});

export type UpdateMessageResult = { success: true } | { error: string };

export async function updateMessageStatus(input: {
  id: number;
  status: MessageStatus;
}): Promise<UpdateMessageResult> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Некорректные данные' };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Не авторизовано' };
  }

  const { error } = await supabaseAdmin
    .from('contact_messages')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('[messages] update failed:', error.message);
    return { error: 'Не удалось обновить статус' };
  }

  revalidatePath('/admin/messages');
  revalidatePath('/admin');

  return { success: true };
}
