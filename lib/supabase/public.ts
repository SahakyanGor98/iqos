import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Public, server-only Supabase client (anon key, NO cookies).
 *
 * Used for public catalog reads (see lib/api.ts). It is deliberately NOT the
 * cookie-bound `@supabase/ssr` server client: reading cookies() from
 * next/headers would opt every catalog route into dynamic rendering and break
 * `generateStaticParams` / ISR (`revalidate`). Public, unauthenticated reads
 * stay statically renderable by avoiding cookies entirely.
 *
 * The `server-only` import guarantees this module can never be bundled into a
 * Client Component. Client code must fetch through a Server Action instead.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
