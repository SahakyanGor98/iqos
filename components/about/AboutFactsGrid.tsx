import React from 'react';
import { IQOS_DISCLAIMERS, IQOS_KEY_FACTS } from '@/lib/content/iqos-about';

export const AboutFactsGrid: React.FC = () => {
  return (
    <section className='py-12 md:py-20 bg-white text-[#34303d] border-y border-neutral-100'>
      <div className='container-custom max-w-5xl mx-auto px-4 md:px-6 space-y-14 md:space-y-18'>
        {/* Key Facts Grid */}
        <div>
          <div className='text-left md:text-center mb-10 md:mb-14'>
            <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[#34303d] text-balance'>
              Основные факты об IQOS
            </h2>
            <p className='text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty'>
              Главные выводы и ключевые особенности технологии в кратком обзоре.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5'>
            {IQOS_KEY_FACTS.map((fact, idx) => (
              <div
                key={fact}
                className='p-4 md:p-5 rounded-2xl border border-neutral-200 bg-neutral-50/60 shadow-sm hover:border-neutral-300 transition-all'
              >
                <p className='text-sm md:text-base leading-relaxed text-[#34303d]/85 font-medium'>
                  <span className='font-black mr-1.5 text-[#34303d]'>{idx + 1}.</span>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience & Safety Information */}
        <div className='p-6 md:p-10 rounded-3xl bg-neutral-900 text-white space-y-6 shadow-xl'>
          <div className='inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-extrabold text-xs uppercase tracking-wider border border-red-500/30'>
            Важная информация о здоровье
          </div>

          <h3 className='text-xl md:text-3xl font-black tracking-tight text-white'>
            Кому предназначен IQOS?
          </h3>

          <p className='text-neutral-200 text-base md:text-lg leading-relaxed max-w-3xl text-pretty'>
            IQOS предназначен <strong>исключительно для совершеннолетних курильщиков</strong>,
            которые в противном случае продолжили бы курить обычные сигареты.
          </p>

          <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-neutral-800 pt-6 text-sm md:text-base text-neutral-300'>
            <div>
              <strong className='text-red-400 block mb-1 font-bold'>🚫 Некурящим</strong>
              Не предназначен для лиц, которые не курят.
            </div>
            <div>
              <strong className='text-red-400 block mb-1 font-bold'>🔞 Несовершеннолетним</strong>
              Строго 18+ для всех устройств и стиков.
            </div>
            <div>
              <strong className='text-red-400 block mb-1 font-bold'>🤰 Беременным</strong>
              Противопоказано при беременности и кормлении.
            </div>
            <div>
              <strong className='text-red-400 block mb-1 font-bold'>⚠️ Чувствительным</strong>
              Содержит никотин, вызывающий привыкание.
            </div>
          </div>

          {/* Footnote Disclaimers */}
          <div className='space-y-2 border-t border-neutral-800 pt-4 text-xs md:text-sm text-neutral-400 leading-relaxed'>
            {IQOS_DISCLAIMERS.map((disc) => (
              <p key={disc}>* {disc}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
