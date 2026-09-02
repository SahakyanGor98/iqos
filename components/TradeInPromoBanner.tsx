'use client';

import Image from 'next/image';
import { Button } from '@/components/Button';
import { ButtonVariant } from '@/components/ButtonTypes';
import { ROUTES } from '@/lib/constants';

export const TradeInPromoBanner = () => {
  return (
    <section className='w-full bg-white'>
      <div className='w-full max-w-none md:max-w-7xl md:mx-auto px-0 md:px-8'>
        <div className='relative aspect-square md:aspect-auto h-auto md:h-[calc(100vh-64px)] overflow-hidden group w-full'>
          {/* Background Image — portrait (3:4) on mobile, landscape (16:9) on desktop */}
          <div className='absolute inset-0 z-0'>
            <Image
              src='/trade-in-2.webp'
              alt='Трейд-ин IQOS — обменяйте старый девайс со скидкой на IQOS ILUMA'
              fill
              sizes='100vw'
              className='object-cover object-center transition-transform duration-700 group-hover:scale-105 md:hidden'
              priority
            />
            <Image
              src='/trade-in-1.webp'
              alt='Трейд-ин IQOS — обменяйте старый девайс со скидкой на IQOS ILUMA'
              fill
              sizes='100vw'
              className='hidden object-cover object-center transition-transform duration-700 group-hover:scale-105 md:block'
              priority
            />
          </div>

          {/* Background Overlay */}
          <div className='absolute inset-0 bg-neutral-700 z-10 opacity-30 md:opacity-50 transition-opacity duration-500 group-hover:opacity-40' />

          {/* Content Overlay */}
          <div className='relative z-20 h-full w-full flex flex-col justify-center items-center md:items-start text-center md:text-left text-white drop-shadow-lg p-8 md:p-16 pb-24 md:pb-16'>
            <div className='max-w-2xl space-y-4 md:space-y-6'>
              <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight'>
                Трейд&#8209;ин IQOS
              </h2>
              <p className='text-base md:text-lg font-bold text-white max-w-lg mx-auto md:mx-0 leading-relaxed'>
                Обменяйте старое устройство со скидкой до 2 500 ₽ на новый IQOS ILUMA. Принимаем в
                любом состоянии.
              </p>

              {/* Desktop Button */}
              <Button
                href={ROUTES.tradeIn}
                variant={ButtonVariant.LIGHT}
                className='hidden md:inline-flex'
              >
                Рассчитать Трейд&#8209;ин
              </Button>
            </div>

            {/* Mobile Button */}
            <Button
              href={ROUTES.tradeIn}
              variant={ButtonVariant.LIGHT}
              className='md:hidden absolute bottom-8 left-1/2 -translate-x-1/2'
            >
              Рассчитать Трейд&#8209;ин
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
