import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

/**
 * Protected admin SaaS shell: fixed sidebar + top header + scrolling content.
 * The login page lives OUTSIDE this route group (app/admin/login), so it is not
 * wrapped by this layout — that avoids the redirect loop. Middleware refreshes
 * the session; this getUser() check is defense-in-depth.
 *
 * Sized to fill the app-shell <body> (h-[100dvh], overflow-hidden): the shell is
 * a flex row, and only <main> scrolls, so the sidebar and header stay pinned.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className='flex min-h-0 flex-1 bg-gray-50'>
      <AdminSidebar />
      <div className='flex min-w-0 flex-1 flex-col'>
        <AdminHeader userEmail={user.email} />
        <main className='min-h-0 flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
