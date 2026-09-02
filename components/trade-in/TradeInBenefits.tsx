'use client';

import { TRADE_IN_BENEFITS } from '@/lib/content/trade-in';

export const TradeInBenefits = () => {
  return (
    <section className='py-14 md:py-24 px-4 md:px-6 bg-neutral-50 text-[#34303d]'>
      <div className='container-custom max-w-5xl mx-auto'>
        <div className='text-left md:text-center mb-10 md:mb-14'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight text-[#34303d] text-balance mb-3'>
            Почему стоит сдать старый IQOS в Трейд&#8209;ин
          </h2>
          <p className='text-base md:text-lg text-[#34303d]/80 max-w-2xl mx-auto leading-relaxed text-pretty'>
            Выгода, комфорт и инновационная технология индукционного нагрева SMARTCORE
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {TRADE_IN_BENEFITS.map((benefit, idx) => (
            <div
              key={idx}
              className='p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#34303D] transition-colors duration-200 shadow-xs'
            >
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-[#34303d]/70 font-bold text-sm'>✦</span>
                <h3 className='text-base md:text-lg font-bold text-[#34303d]'>{benefit.title}</h3>
              </div>
              <p className='text-sm md:text-base text-[#34303d]/80 leading-relaxed'>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
