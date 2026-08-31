import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Refreshes the Supabase auth session on every matched request and gates the
 * /admin area.
 *
 * This client is bound to the NextRequest/NextResponse cookies (NOT the
 * next/headers-based lib/supabase/server.ts, which is invalid in middleware).
 * It must call getUser() immediately with no logic in between, and return the
 * response object it built so refreshed cookies propagate to the browser.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: keep getUser() directly after client creation — no logic between.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  // Preserve any refreshed auth cookies when we redirect.
  const redirectTo = (pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
    return res;
  };

  // Not signed in → send to login (unless already there).
  if (!user && !isLoginRoute) {
    return redirectTo('/admin/login');
  }

  // Already signed in but on the login page → send to the dashboard.
  if (user && isLoginRoute) {
    return redirectTo('/admin');
  }

  // IMPORTANT: return supabaseResponse so refreshed cookies reach the browser.
  return supabaseResponse;
}
