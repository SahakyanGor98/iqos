import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run only on the admin area. Static assets under /_next are not matched.
  matcher: ['/admin/:path*'],
};
