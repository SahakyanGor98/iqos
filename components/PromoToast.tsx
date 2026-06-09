'use client';

import { useEffect, useState } from 'react';
import { CONTACTS } from '@/lib/constants';

export const PromoToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkVerification = () => {
      const isVerified = localStorage.getItem('age-verified');
      if (isVerified) {
        // Start the toast sequence
        const showTimer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);

        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 8000);

        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      } else {
        // Retry checking
        const retryTimer = setTimeout(checkVerification, 1000);
        return () => clearTimeout(retryTimer);
      }
    };

    const cleanup = checkVerification();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-max md:right-auto z-[60] flex flex-col md:flex-row items-center gap-3 md:gap-4 bg-white p-4 md:px-4 md:py-3 rounded-xl shadow-xl border border-neutral-100 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div className='flex items-center gap-3 w-full md:w-auto'>
        <div className='bg-[#229ED9] p-1.5 rounded-full flex-shrink-0'>
          <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.638z' />
          </svg>
        </div>
        <p className='text-sm font-medium text-neutral-800 leading-snug flex-1'>
          Подпишитесь на Telegram - получите скидку до 10% и доступ к эксклюзивным промокодам.
        </p>
      </div>

      <div className='flex items-center gap-3 w-full md:w-auto justify-between'>
        <a
          href={CONTACTS.telegram.link}
          target='_blank'
          rel='noreferrer'
          className='bg-[#229ED9] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full hover:bg-[#1a8bc5] transition-colors whitespace-nowrap flex-1 md:flex-none text-center'
        >
          Подписаться
        </a>

        <button
          onClick={() => setIsVisible(false)}
          className='text-neutral-400 hover:text-neutral-600 transition-colors p-1'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </button>
      </div>
    </div>
  );
};
