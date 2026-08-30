import React from 'react';
import Image from 'next/image';
import { IQOS_ABOUT_IMAGES, SMARTCORE_BENEFITS, TEREA_CATEGORIES } from '@/lib/content/iqos-about';
import { fixCasing, formatDeviceTitle } from '@/lib/utils';

export const AboutTechHighlights: React.FC = () => {
  return (
    <section className='py-12 md:py-20 bg-neutral-50 text-[#34303d] border-y border-neutral-100'>
      <div className='container-custom max-w-5xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24'>
        {/* Temperature & Science Section */}
        <div>
          <div className='text-left md:text-center mb-10 md:mb-14'>
            <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[#34303d] text-balance'>
              {formatDeviceTitle(fixCasing('Температурный режим: Нагрев вместо горения', true))}
            </h2>
            <p className='text-base md:text-lg text-[#34303d] max-w-2xl mx-auto leading-relaxed text-pretty'>
              Главный секрет технологии IQOS — строгий контроль температуры нагрева без
              воспламенения.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-6 md:gap-8 items-center'>
            {/* Cigarette Temp Box */}
            <div className='p-6 md:p-8 rounded-3xl border border-red-200 bg-red-50/40 text-center space-y-3 relative overflow-hidden'>
              <div className='absolute top-0 right-0 px-4 py-1.5 bg-red-500 text-white font-extrabold text-xs rounded-bl-2xl uppercase tracking-wider'>
                Горение
              </div>
              <div className='text-4xl md:text-5xl font-black text-red-600 tracking-tight'>
                &gt; 600°C
              </div>
              <h3 className='text-xl md:text-2xl font-black text-[#34303d]'>Обычная сигарета</h3>
              <p className='text-sm md:text-base leading-relaxed max-w-sm mx-auto'>
                Приводит к пиролизу и окислению. Образуются смолы, угарный газ (CO), формальдегид и
                тысячи продуктов горения.
              </p>
            </div>

            {/* IQOS Temp Box */}
            <div className='p-6 md:p-8 rounded-3xl border border-emerald-200 bg-emerald-50/50 text-center space-y-3 relative overflow-hidden shadow-sm'>
              <div className='absolute top-0 right-0 px-4 py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded-bl-2xl uppercase tracking-wider'>
                Индукция
              </div>
              <div className='text-4xl md:text-5xl font-black text-emerald-600 tracking-tight'>
                ~300–350°C
              </div>
              <h3 className='text-xl md:text-2xl font-black text-[#34303d]'>Система IQOS ILUMA</h3>
              <p className='text-sm md:text-base text-[#34303d] leading-relaxed max-w-sm mx-auto font-medium'>
                Табак нагревается без горения. Раскрывается натуральный вкус и выделяется
                никотинсодержащий аэрозоль.
              </p>
            </div>
          </div>
        </div>

        {/* SMARTCORE INDUCTION SYSTEM Section */}
        <div className='pt-8 border-t border-neutral-200'>
          {/* Header & Image 2-Column Grid (exact AboutDefaultSection pattern) */}
          <div className='grid gap-8 lg:gap-12 items-center lg:grid-cols-2 mb-10 md:mb-14'>
            {/* Text Column */}
            <div className='text-left space-y-4'>
              <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight text-[#34303d] text-balance'>
                Что такое SMARTCORE INDUCTION SYSTEM™?
              </h2>
              <p className='text-base md:text-lg leading-relaxed text-[#34303d]/90 text-pretty'>
                Новейшая технологическая революция в серии IQOS ILUMA. Бесконтактный нагрев без
                лезвия.
              </p>
            </div>

            {/* Image Column (matches AboutDefaultSection aspect ratio, -mx-4 mobile stretch, md:rounded-2xl) */}
            <div className='relative aspect-[4/3] overflow-hidden -mx-4 md:mx-0 rounded-none md:rounded-2xl bg-neutral-100'>
              <Image
                src={IQOS_ABOUT_IMAGES.stickConstruction}
                alt='Конструкция стика TEREA и SMARTCORE INDUCTION SYSTEM'
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover object-center'
              />
            </div>
          </div>

          {/* SMARTCORE Benefits 4-Card Grid */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {SMARTCORE_BENEFITS.map((benefit, idx) => (
              <div
                key={benefit.title}
                className='p-5 md:p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 hover:shadow-md transition-all'
              >
                <h3 className='text-base md:text-lg font-bold text-[#34303d] mb-2 leading-snug'>
                  {idx + 1}. {benefit.title}
                </h3>
                <p className='text-sm md:text-base text-[#34303d] leading-relaxed'>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stick Notice Banner */}
          <div className='mt-10 p-5 md:p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm md:text-base leading-relaxed flex items-start gap-4'>
            <span className='text-amber-600 text-xl font-bold flex-shrink-0'>⚠️</span>
            <div>
              <strong className='font-bold block mb-1'>Важное примечание о совместимости:</strong>
              Стики TEREA™ предназначены исключительно для устройств IQOS ILUMA™. Их нельзя
              использовать в предыдущих поколениях IQOS с лезвием. Стики HEETS™ несовместимы с IQOS
              ILUMA™.
            </div>
          </div>
        </div>

        {/* TEREA Flavor Categories */}
        <div className='pt-8 border-t border-neutral-200'>
          <div className='text-left md:text-center mb-10'>
            <h3 className='text-xl md:text-2xl font-black uppercase tracking-tight text-[#34303d] mb-3'>
              Виды и категории стиков TEREA
            </h3>
            <p className='text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty'>
              Широкая палитра вкусов, разделенная на бленды под любые предпочтения.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {TEREA_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.name}
                className='p-5 rounded-2xl border border-neutral-200 bg-white space-y-2 shadow-sm'
              >
                <h4 className='text-base md:text-lg font-bold text-[#34303d]'>
                  <span className='font-black mr-1.5'>{idx + 1}.</span>
                  {cat.name}
                </h4>
                <p className='text-sm md:text-base text-[#34303d] leading-relaxed'>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
