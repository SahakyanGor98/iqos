'use client';

import { useEffect, useState } from 'react';
import { CONTACTS } from '@/lib/constants';

export const FloatingPromo = () => {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const isClosed = localStorage.getItem('promo_closed');

    if (isClosed === 'true') {
      setClosed(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setClosed(true);
    localStorage.setItem('promo_closed', 'true');
  };

  const reopen = () => {
    setVisible(true);
    setClosed(false);
    localStorage.removeItem('promo_closed');
  };

  return (
    <div className='fixed bottom-6 right-6 md:bottom-8 md:right-10 z-[60] flex flex-col items-end gap-3'>
      {/* PROMO CARD */}
      {visible && !closed && (
        <div className='w-[260px] bg-white rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-300'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='text-sm font-semibold text-neutral-900'>🎁 -10% на заказ</div>
              <div className='text-xs text-neutral-500 mt-1'>Промокод FIRST10</div>
            </div>

            <button onClick={handleClose} className='text-neutral-400 hover:text-neutral-700'>
              ✕
            </button>
          </div>

          <a
            href='/products'
            className='mt-3 block w-full text-center bg-black text-white text-sm font-semibold py-2 rounded-full hover:bg-neutral-800 transition'
          >
            Получить
          </a>
        </div>
      )}

      {/* REOPEN BUBBLE */}
      {closed && (
        <button
          onClick={reopen}
          className='w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:scale-105 transition'
        >
          🎁
        </button>
      )}

      {/* TELEGRAM (твой дизайн, слегка адаптирован) */}
      <a
        href={CONTACTS.telegram.link}
        target='_blank'
        rel='noreferrer'
        className='group'
        aria-label='Contact us on Telegram'
      >
        <div className='relative'>
          {/* Pulse */}
          <div className='absolute inset-0 bg-[#229ED9] rounded-full opacity-0 group-hover:animate-ping'></div>

          {/* Button */}
          <div className='relative bg-[#229ED9] text-white p-3.5 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center'>
            <svg className='w-7 h-7 md:w-8 md:h-8' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.638z' />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
};
