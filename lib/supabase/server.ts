import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Cookie-bound Supabase server client (anon key + user session from cookies).
 *
 * ⚠️ Phase B foundation — not yet wired into any flow. Reading cookies() makes
 * the calling route dynamic, so DO NOT use this for public catalog reads (those
 * go through lib/supabase/public.ts to stay ISR/SSG-friendly). Use it once user
 * accounts exist, for authenticated reads/writes that must run under the user's
 * JWT so RLS enforces per-user access.
 *
 * Next.js 16: cookies() is async, so this factory is async. The @supabase/ssr
 * getAll/setAll adapters set httpOnly/secure/sameSite cookies by default. The
 * setAll try/catch is required because Server Components cannot set cookies —
 * session refresh happens in middleware.ts (Phase B).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore when middleware
            // is responsible for refreshing the session.
          }
        },
      },
    },
  );
}
