'use client';

import { DELIVERY_NOTIFICATION_END, DELIVERY_NOTIFICATION_START } from '@/lib/constants';
import { useEffect, useState } from 'react';

export const DeliveryNoticeToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkVerification = () => {
      const isVerified = localStorage.getItem('age-verified');

      // Only show the notice from June 18 (day before restriction starts)
      const now = new Date();
      const warningStart = new Date(DELIVERY_NOTIFICATION_START);
      const warningEnd = new Date(DELIVERY_NOTIFICATION_END);
      const isRelevant = now >= warningStart && now < warningEnd;

      if (!isRelevant) return;

      if (isVerified) {
        // Show slightly after age verification modal finishes
        const showTimer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);

        return () => {
          clearTimeout(showTimer);
        };
      } else {
        const retryTimer = setTimeout(checkVerification, 1000);
        return () => clearTimeout(retryTimer);
      }
    };

    const cleanup = checkVerification();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 md:top-6 md:right-6 md:left-auto md:w-[380px] z-[70] flex items-start gap-3 bg-amber-50 p-4 rounded-xl shadow-xl border border-amber-200 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95 pointer-events-none'}`}>
      {/* Warning Icon Container */}
      <div className='bg-amber-500 p-2 rounded-full flex-shrink-0 text-white shadow-sm flex items-center justify-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='animate-pulse'
        >
          <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
          <line x1='16' y1='2' x2='16' y2='6'></line>
          <line x1='8' y1='2' x2='8' y2='6'></line>
          <line x1='3' y1='10' x2='21' y2='10'></line>
          <path d='M8 14h.01'></path>
          <path d='M12 14h.01'></path>
          <path d='M16 14h.01'></path>
          <path d='M8 18h.01'></path>
          <path d='M12 18h.01'></path>
          <path d='M16 18h.01'></path>
        </svg>
      </div>

      <div className='flex-1 min-w-0'>
        <h4 className='text-md font-bold text-amber-900 leading-tight mb-0.5'>Внимание: Доставка ограничена.</h4>
        <p className='text-s text-amber-800 leading-snug'>
          С <strong>19 по 30 июня</strong> наша доставка работать не будет. Все заказы, оформленные в этот период, будут отправлены начиная с <strong>1 июля</strong>.
        </p>
        <p className='text-s text-amber-800 leading-snug'>
          Приносим свои извинения.
        </p>
      </div>

      <button
        onClick={handleClose}
        className='text-amber-500 hover:text-amber-700 transition-colors p-1 -mt-1 -mr-1'
        aria-label='Закрыть предупреждение'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='18' y1='6' x2='6' y2='18'></line>
          <line x1='6' y1='6' x2='18' y2='18'></line>
        </svg>
      </button>
    </div>
  );
};
