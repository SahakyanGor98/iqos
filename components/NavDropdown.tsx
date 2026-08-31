'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export type NavItem = { href: string; label: string };

interface Props {
  label: string;
  items: NavItem[];
}

export const NavDropdown = ({ label, items }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className='relative'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type='button'
        aria-haspopup='menu'
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className='flex items-center gap-1 text-xs lg:text-sm font-medium text-black transition-all duration-300 hover:scale-105'
      >
        {label}
        {/* wrapper animates (hardware-accelerated), not the svg */}
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown className='w-3.5 h-3.5' />
        </span>
      </button>

      {/* Panel — kept mounted for smooth transition; pt-3 bridges the hover gap */}
      <div
        role='menu'
        aria-label={label}
        className={`absolute left-0 top-full pt-3 min-w-[220px] transition-all duration-150 ${
          open
            ? 'opacity-100 visible translate-y-0'
            : 'pointer-events-none invisible -translate-y-1 opacity-0'
        }`}
      >
        <div className='rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl'>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role='menuitem'
              onClick={() => setOpen(false)}
              className='block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black'
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
