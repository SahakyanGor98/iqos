import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Admin dashboard KPI counts. `orders` and `contact_messages` are RLS-locked
 * (no anon/authed read policy), so these run through the service-role client —
 * safe here because the dashboard is a server component behind the /admin auth
 * gate. Each count is `number | null`; null means the query failed and the card
 * renders a neutral "—" instead of a wrong zero.
 */
export type DashboardStats = {
  orders: number | null;
  activeProducts: number | null;
  unreadMessages: number | null;
};

async function countAllOrders(): Promise<number | null> {
  const { count, error } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true });
  if (error) {
    console.error('[admin-stats] orders count failed:', error.message);
    return null;
  }
  return count ?? 0;
}

async function countActiveProducts(): Promise<number | null> {
  const { count, error } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('in_stock', true);
  if (error) {
    console.error('[admin-stats] products count failed:', error.message);
    return null;
  }
  return count ?? 0;
}

async function countUnreadMessages(): Promise<number | null> {
  const { count, error } = await supabaseAdmin
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');
  if (error) {
    console.error('[admin-stats] messages count failed:', error.message);
    return null;
  }
  return count ?? 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Independent counts — run them concurrently.
  const [orders, activeProducts, unreadMessages] = await Promise.all([
    countAllOrders(),
    countActiveProducts(),
    countUnreadMessages(),
  ]);

  return { orders, activeProducts, unreadMessages };
}
