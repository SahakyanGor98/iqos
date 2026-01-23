'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { CartDrawer } from '@/components';

export const Navbar = () => {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const links = [
    { href: '/products/iqos', label: 'Устройства IQOS' },
    { href: '/products/terea', label: 'Стики Terea' },
    { href: '/contact', label: 'Контакты' },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      <header className='sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md transition-all duration-300'>
        <div className='container-custom flex h-20 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='text-3xl font-bold tracking-tighter uppercase text-[#34303D]'>
            IQOS<span className='text-neutral-400 font-light'>STORE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center gap-8'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-black ${
                  isActive(link.href) ? 'text-black' : 'text-neutral-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsCartOpen(true)}
              className='relative p-2 hover:bg-neutral-100 rounded-full transition-colors'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-5 h-5'
              >
                <circle cx='9' cy='21' r='1' />
                <circle cx='20' cy='21' r='1' />
                <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
              </svg>
              {totalItems > 0 && (
                <span className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white'>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className='md:hidden p-2 hover:bg-neutral-100 rounded-lg'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                {isMenuOpen ? (
                  <>
                    <line x1='18' y1='6' x2='6' y2='18' />
                    <line x1='6' y1='6' x2='18' y2='18' />
                  </>
                ) : (
                  <>
                    <line x1='3' y1='12' x2='21' y2='12' />
                    <line x1='3' y1='6' x2='21' y2='6' />
                    <line x1='3' y1='18' x2='21' y2='18' />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-[var(--border)] bg-white p-4 absolute w-full shadow-xl'>
            <nav className='flex flex-col gap-4'>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium ${
                    isActive(link.href) ? 'text-black' : 'text-neutral-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
