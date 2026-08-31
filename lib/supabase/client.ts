import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client (anon key, cookie-based session).
 *
 * Phase B foundation — for interactive client-side auth (sign in/out, reading
 * the current session in Client Components) once user accounts exist. It is a
 * singleton per browser context.
 *
 * NOTE: Do NOT use this for data fetching in Client Components. Public reads
 * belong on the server (lib/api.ts); client components that need data call a
 * Server Action instead (see app/actions/products.ts).
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
