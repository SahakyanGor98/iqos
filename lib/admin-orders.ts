import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { OrderItemSnapshot, TradeInMetadata } from '@/lib/orders';

/**
 * Admin order reads. `orders` is RLS-locked (no anon/authed policies), so these
 * run through the service-role client — safe here because callers are server
 * components behind the /admin auth gate.
 */
export type AdminOrder = {
  id: number;
  created_at: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_message: string | null;
  total_amount: number;
  discount: number;
  status: string;
  order_type: 'purchase' | 'trade_in';
  items: OrderItemSnapshot[];
  metadata: { trade_in?: TradeInMetadata } & Record<string, unknown>;
};

const ORDER_COLUMNS =
  'id, created_at, user_name, user_email, user_phone, user_message, total_amount, discount, status, order_type, items, metadata';

/** All orders, newest first. Volume is modest; add pagination if it grows. */
export async function getOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(ORDER_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[orders] read failed:', error.message);
    return [];
  }

  return (data ?? []) as AdminOrder[];
}

export async function getOrderById(id: number): Promise<AdminOrder | null> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(ORDER_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[orders] detail read failed:', error.message);
    return null;
  }

  return (data as AdminOrder | null) ?? null;
}
