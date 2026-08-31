'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCartStore } from '@/store/cartStore';
import { useCompareStore } from '@/store/compareStore';
import { useEffect, useState } from 'react';
import { CompareFloatingBar } from '@/components';
import { NavDropdown } from './NavDropdown';
import { ROUTES } from '@/lib/constants';

// Click-triggered drawer — loaded only when the cart is opened (see .ai/seo-perf.md §2).
const CartDrawer = dynamic(() => import('./CartDrawer').then((m) => m.CartDrawer), {
  ssr: false,
});

export const Navbar = () => {
  const cartItems = useCartStore((state) => state.items);
  const compareItemsByCategory = useCompareStore((state) => state.itemsByCategory);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    const handleScroll = () => {
      if (mainContent) {
        setScrolled(mainContent.scrollTop > 50);
      }
    };

    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const totalCompareItems = mounted
    ? Object.values(compareItemsByCategory).reduce((acc, list) => acc + (list?.length || 0), 0)
    : 0;

  const catalogLinks = [
    { href: ROUTES.catalog.iqos, label: 'Устройства IQOS' },
    { href: ROUTES.catalog.terea, label: 'Стики TEREA' },
    { href: ROUTES.catalog.accessories, label: 'Аксессуары' },
    { href: ROUTES.catalog.water, label: 'Вода' },
  ];

  const aboutLinks = [
    { href: ROUTES.about.iqos, label: 'Об IQOS' },
    { href: ROUTES.contact, label: 'Контакты' },
  ];

  return (
    <>
      <header className='relative flex-shrink-0 z-50 w-full bg-white/90 backdrop-blur-md transition-all duration-300 border-b border-neutral-200'>
        <div className='container-custom flex h-16 items-center justify-between'>
          {/* Mobile Menu Button (Left) */}
          <div className='flex-1 md:hidden'>
            <button
              className='p-2 hover:bg-neutral-100 rounded-lg -ml-2'
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

          {/* Desktop Nav (Left) */}
          <nav className='hidden md:flex flex-1 items-center gap-6 lg:gap-8'>
            <NavDropdown label='Каталог' items={catalogLinks} />
            <Link
              href={ROUTES.tradeIn}
              className='text-xs lg:text-sm font-medium transition-all duration-300 hover:scale-105 text-black tracking-normal'
            >
              Трейд-ин
            </Link>
            <NavDropdown label='О бренде' items={aboutLinks} />
          </nav>

          {/* Logo (Center) */}
          <div className='flex items-center justify-center font-[family-name:var(--font-christ)]'>
            <Link href='/' className='relative flex items-center justify-center group h-10'>
              {/* Left Word: IQOS (Staggered Characters) */}
              <div className='flex items-center'>
                {'IQOS'.split('').map((char, index) => (
                  <span
                    key={`iqos-${index}`}
                    style={{
                      transitionDelay: scrolled ? `${(3 - index) * 35}ms` : `${index * 35}ms`,
                    }}
                    className={`text-2xl md:text-3xl tracking-tighter uppercase text-black transition-all duration-500 ease-in-out inline-block ${
                      scrolled
                        ? 'opacity-0 translate-x-20 blur-sm scale-x-50 pointer-events-none'
                        : 'opacity-100 translate-x-0 scale-x-100'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>

              {/* Center Logo: Hummingbird Icon */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                  scrolled
                    ? 'opacity-100 scale-100 rotate-0 transition-delay-200'
                    : 'opacity-0 scale-50 -rotate-12 pointer-events-none'
                }`}
              >
                <div className='relative w-[95px] h-[95px] md:w-[120px] md:h-[130px]'>
                  <Image
                    src='/icon9_4.webp'
                    alt='IQOS Logo'
                    fill
                    priority
                    className='object-contain'
                  />
                </div>
              </div>

              {/* Right Word: STORE (Staggered Characters) */}
              <div className='flex items-center pl-2'>
                {'STORE'.split('').map((char, index) => (
                  <span
                    key={`store-${index}`}
                    style={{
                      transitionDelay: scrolled ? `${index * 35}ms` : `${(4 - index) * 35}ms`,
                    }}
                    className={`text-2xl md:text-3xl tracking-tighter uppercase text-black transition-all duration-500 ease-in-out inline-block ${
                      scrolled
                        ? 'opacity-0 -translate-x-20 blur-sm scale-x-50 pointer-events-none'
                        : 'opacity-100 translate-x-0 scale-x-100'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </Link>
          </div>

          {/* Actions (Right) */}
          <div className='flex flex-1 items-center justify-end gap-3 md:gap-4'>
            {/* Compare Link */}
            <Link
              href='/compare'
              className='relative p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-700 hover:text-black'
              title='Сравнение товаров'
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
                className='w-5 h-5 md:w-6 md:h-6'
              >
                <path d='m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' />
                <path d='m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' />
                <path d='M7 21h10' />
                <path d='M12 3v18' />
                <path d='M3 7h18' />
              </svg>
              {totalCompareItems > 0 && (
                <span className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white'>
                  {totalCompareItems}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className='relative p-2 hover:bg-neutral-100 rounded-full transition-colors -mr-2'
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
                className='w-5 h-5 md:w-6 md:h-6'
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
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 top-16 bg-black/25 z-40 md:hidden'
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className='md:hidden border-t border-neutral-100 rounded-b-lg bg-white p-4 fixed top-16 left-0 w-full shadow-xl z-50'>
          <nav className='flex flex-col gap-1'>
            {/* Каталог */}
            <span className='px-1 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400'>
              Каталог
            </span>
            {catalogLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className='py-2 pl-3 text-base font-medium text-black'
              >
                {link.label}
              </Link>
            ))}

            {/* О бренде */}
            <span className='px-1 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-neutral-400'>
              О бренде
            </span>
            {aboutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className='py-2 pl-3 text-base font-medium text-black'
              >
                {link.label}
              </Link>
            ))}

            {/* Трейд-ин (last) */}
            <Link
              href={ROUTES.tradeIn}
              onClick={() => setIsMenuOpen(false)}
              className='mt-2 border-t border-neutral-100 pt-3 text-base font-medium text-black'
            >
              Трейд-ин
            </Link>
          </nav>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CompareFloatingBar />
    </>
  );
};
