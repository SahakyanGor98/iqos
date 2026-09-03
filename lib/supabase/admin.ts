import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * ⚠️ This key BYPASSES Row Level Security and must never reach the browser.
 * The `server-only` import makes an accidental Client Component import a build
 * error. Use only from server code ('use server' actions, route handlers,
 * server components) for writes to RLS-protected tables (orders, order_items,
 * contact_messages) so guests can submit through server actions without the
 * public anon key being able to read those rows.
 *
 * The real client is created **lazily** (on first use) via a Proxy, so this
 * module can be imported/evaluated during `next build` — which collects page
 * data for every route, including `/admin/*` — without SUPABASE_SERVICE_ROLE_KEY
 * being present. The key only needs to exist at runtime (the VPS `.env`), never
 * in CI. Callers keep using `supabaseAdmin.from(...)` unchanged.
 */
let cachedClient: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!cachedClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    cachedClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedClient;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getSupabaseAdmin();
    const value = Reflect.get(c, prop);
    return typeof value === 'function' ? value.bind(c) : value;
  },
});
