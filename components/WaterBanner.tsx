'use client';

import { Droplets } from 'lucide-react';
import { HapticLink } from './HapticLink';

export const WaterBanner = () => {
  return (
    <div className='w-full bg-gradient-to-r from-sky-50/60 via-[#fffdfb] to-cyan-50/60 text-neutral-900 border-y border-neutral-200/80 relative overflow-hidden py-6 md:py-7 px-4 sm:px-8'>
      {/* Background Subtle Water Tint Glows */}
      <div className='absolute -right-12 -top-12 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -left-12 -bottom-12 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none' />

      <div className='container-custom max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 relative z-10'>
        {/* Left Content with Icon */}
        <div className='flex items-center gap-4 text-center sm:text-left'>
          <div className='w-11 h-11 md:w-12 md:h-12 rounded-full bg-sky-100/80 border border-sky-200/80 flex items-center justify-center shrink-0 text-sky-600 shadow-sm'>
            <Droplets size={22} />
          </div>
          <div>
            <div className='flex items-center justify-center sm:justify-start gap-2 mb-1'>
              <span className='text-[10px] font-bold uppercase tracking-widest text-sky-700 bg-sky-100/70 px-2.5 py-0.5 rounded border border-sky-200/70'>
                Сопутствующий товар
              </span>
            </div>
            <h3 className='text-base sm:text-lg md:text-xl font-bold tracking-tight text-neutral-900 leading-snug'>
              Природная питьевая Вода 0.33л
            </h3>
            <p className='text-xs sm:text-sm text-neutral-600 font-medium'>
              Чистейшая природная питьевая вода в упаковке по 12 шт. Идеальное дополнение к вашему заказу.
            </p>
          </div>
        </div>

        {/* Right CTA Link */}
        <HapticLink
          href='/products/water/mountain-water-330ml-box'
          className='inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs md:text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 hover:scale-105 shadow-sm shrink-0'
        >
          Смотреть воду
        </HapticLink>
      </div>
    </div>
  );
};
