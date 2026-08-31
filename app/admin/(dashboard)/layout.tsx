import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Auth gate for the /admin dashboard. The login page lives OUTSIDE this route
 * group (app/admin/login), so it is not wrapped by this layout — that avoids
 * the redirect loop. Middleware refreshes the session; this is defense-in-depth.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <div className='min-h-full bg-neutral-50'>{children}</div>;
}
