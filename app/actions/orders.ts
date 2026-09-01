'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/orders';

/**
 * Update an order's status. Called from the orders list/detail (client).
 *
 * Auth: re-checks the signed-in admin, then writes via the service-role client
 * (`orders` has no authenticated policies — service-role server access behind
 * the auth gate is the established model). The status is validated against the
 * canonical set here and by the orders_status_check DB constraint. Revalidates
 * the list, the detail page, and the dashboard order count.
 */

const updateSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(ORDER_STATUSES),
});

export type UpdateOrderResult = { success: true } | { error: string };

export async function updateOrderStatus(input: {
  id: number;
  status: OrderStatus;
}): Promise<UpdateOrderResult> {
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
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('[orders] update failed:', error.message);
    return { error: 'Не удалось обновить статус' };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${parsed.data.id}`);
  revalidatePath('/admin');

  return { success: true };
}
