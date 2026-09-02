'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ADMIN_NAV, isNavItemActive } from './nav-config';

/**
 * Fixed-width admin sidebar: branding, vertical nav with active highlight
 * (via usePathname), and a "back to site" footer link. Pure Tailwind +
 * lucide-react.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className='flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white'>
      {/* Branding */}
      <div className='flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-6'>
        <span className='text-sm font-black uppercase tracking-tight text-[#34303d]'>
          iqos Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 overflow-y-auto p-4'>
        {ADMIN_NAV.map((item) => {
          const active = isNavItemActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-[#34303d] text-white'
                  : 'text-neutral-600 hover:bg-gray-100 hover:text-[#34303d]',
              )}
            >
              <Icon className='h-[18px] w-[18px] shrink-0' />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='shrink-0 border-t border-gray-200 p-4'>
        <Link
          href='/'
          className='flex items-center gap-2 px-3 text-xs font-medium text-neutral-500 transition-colors hover:text-[#34303d]'
        >
          ← На сайт
        </Link>
      </div>
    </aside>
  );
}
