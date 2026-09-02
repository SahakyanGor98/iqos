'use client';

import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { getActiveNavTitle } from './nav-config';

/**
 * Top header: the current page title (derived from the route) on the left, and
 * the signed-in email + Sign Out pushed to the far right. Sits above the
 * scrolling content area so it stays pinned. Pure Tailwind + lucide-react.
 */
export function AdminHeader({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();
  const title = getActiveNavTitle(pathname);

  return (
    <header className='flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6'>
      <h1 className='text-lg font-bold text-[#34303d]'>{title}</h1>

      <div className='flex items-center gap-4'>
        {userEmail ? (
          <span className='hidden text-sm text-neutral-500 sm:inline'>{userEmail}</span>
        ) : null}
        <form action={signOut}>
          <button
            type='submit'
            className='flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-gray-100 hover:text-[#34303d]'
          >
            <LogOut className='h-4 w-4' />
            Выйти
          </button>
        </form>
      </div>
    </header>
  );
}
