'use client';

import { DELIVERY_NOTIFICATION_END } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';

export const DeliveryNoticeToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-mount/hydration gate (see .ai/state.md)
    setIsMounted(true);

    // Only show the notice within the delivery-pause window.
    const now = new Date();
    const warningStart = new Date('2026-06-15');
    const warningEnd = new Date(DELIVERY_NOTIFICATION_END);
    const isRelevant = now >= warningStart && now < warningEnd;
    if (!isRelevant) return;

    let showTimer: ReturnType<typeof setTimeout>;
    const startSequence = () => {
      // Show slightly after the age-verification modal finishes.
      showTimer = setTimeout(() => setIsVisible(true), 1500);
    };

    // Start once age-verified — immediately if already verified, otherwise on
    // the one-off `age-verified` event instead of polling localStorage.
    if (localStorage.getItem('age-verified')) {
      startSequence();
    } else {
      window.addEventListener('age-verified', startSequence, { once: true });
    }

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('age-verified', startSequence);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <div
      className={`fixed top-4 left-4 right-4 md:top-6 md:right-6 md:left-auto md:w-[380px] z-[70] flex items-start gap-3 bg-amber-50 p-4 rounded-xl shadow-xl border border-amber-200 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95 pointer-events-none'}`}
    >
      {/* Warning Icon Container */}
      <div className='bg-amber-500 p-2 rounded-full flex-shrink-0 text-white shadow-sm flex items-center justify-center'>
        <CalendarDays className='w-5 h-5 animate-pulse' strokeWidth={2} />
      </div>

      <div className='flex-1 min-w-0'>
        <h4 className='text-md font-bold text-amber-900 leading-tight mb-0.5'>Внимание !</h4>
        <p className='text-s text-amber-800 leading-snug'>
          С <strong>19 по 30 июня</strong> служба доставки не будет работать. Все заказы,
          оформленные в этот период, будут отправлены начиная с <strong>1 июля</strong>.
        </p>
        <p className='text-s text-amber-800 leading-snug'>Приносим свои извинения.</p>
      </div>

      <button
        onClick={handleClose}
        className='text-amber-500 hover:text-amber-700 transition-colors p-1 -mt-1 -mr-1'
        aria-label='Закрыть предупреждение'
      >
        <X className='w-4 h-4' strokeWidth={2.5} />
      </button>
    </div>
  );
};
