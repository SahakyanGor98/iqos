import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * ⚠️ This key BYPASSES Row Level Security and must never reach the browser.
 * The `server-only` import makes an accidental Client Component import a build
 * error. Use only from server code ('use server' actions, route handlers,
 * server components) for writes to RLS-protected tables (orders, order_items,
 * contact_messages) so guests can submit through server actions without the
 * public anon key being able to read those rows.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
