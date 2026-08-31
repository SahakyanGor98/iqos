import Link from 'next/link';

/**
 * Bare admin shell — a minimal top bar + scroll region, with none of the
 * marketing chrome (no site nav, footer, toasts, or age gate). Wraps both the
 * login page and the protected dashboard. The auth gate lives one level deeper
 * in (dashboard)/layout.tsx so the login page stays reachable.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='shrink-0 border-b border-neutral-200 bg-white'>
        <div className='container-custom flex h-14 items-center justify-between'>
          <Link
            href='/admin'
            className='text-sm font-black uppercase tracking-tight text-[#34303d]'
          >
            Админ-панель
          </Link>
          <Link
            href='/'
            className='text-xs font-medium text-neutral-500 transition-colors hover:text-[#34303d]'
          >
            На сайт →
          </Link>
        </div>
      </header>
      <main className='flex-1 overflow-y-auto bg-neutral-50'>{children}</main>
    </>
  );
}
