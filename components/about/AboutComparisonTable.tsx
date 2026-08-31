import React from 'react';
import { Check } from 'lucide-react';
import { CIGARETTE_VS_IQOS_TABLE, ECIG_VS_IQOS } from '@/lib/content/iqos-about';

export const AboutComparisonTable: React.FC = () => {
  return (
    <section className='py-12 md:py-20 bg-white text-[#34303d] border-y border-neutral-100'>
      <div className='container-custom max-w-5xl mx-auto px-4 md:px-6'>
        {/* Section Header */}
        <div className='text-left md:text-center mb-10 md:mb-14'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 text-[#34303d] text-balance'>
            Чем IQOS отличается от сигарет?
          </h2>
          <p className='text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty'>
            Сравнение ключевых характеристик традиционного курения и технологии нагревания табака.
          </p>
        </div>

        {/* Comparison Table */}
        <div className='overflow-x-auto mb-16 rounded-2xl border border-neutral-200 shadow-sm bg-neutral-50/50'>
          <table className='w-full text-left border-collapse min-w-[600px]'>
            <thead>
              <tr className='bg-[#34303d] text-white'>
                <th className='p-4 md:p-5 font-extrabold text-sm md:text-base uppercase tracking-wider w-1/4'>
                  Характеристика
                </th>
                <th className='p-4 md:p-5 font-extrabold text-center text-sm md:text-base uppercase tracking-wider w-3/8 border-l border-white/10 bg-[#34303d]'>
                  Сигареты
                </th>
                <th className='p-4 md:p-5 font-extrabold text-center text-sm md:text-base uppercase tracking-wider w-3/8 border-l border-white/10 bg-[#34303d]'>
                  IQOS
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-200 text-sm md:text-base'>
              {CIGARETTE_VS_IQOS_TABLE.map((row, idx) => (
                <tr key={row.feature} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/70'}>
                  <td className='p-4 md:p-5 font-bold text-[#34303d] align-middle'>
                    {row.feature}
                  </td>
                  <td className='p-4 md:p-5 text-neutral-600 border-l border-neutral-200 align-middle leading-relaxed'>
                    <span className='inline-flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-red-500 flex-shrink-0' />
                      {row.cigarette}
                    </span>
                  </td>
                  <td className='p-4 md:p-5 font-semibold text-[#34303d] border-l border-neutral-200 bg-neutral-50/40 align-middle leading-relaxed'>
                    <span className='inline-flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0' />
                      {row.iqos}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* IQOS vs E-Cigarettes Sub-section */}
        <div className='mt-16 pt-12 border-t border-neutral-200'>
          <div className='text-left md:text-center mb-10'>
            <h3 className='text-xl md:text-2xl font-black uppercase tracking-tight text-[#34303d] mb-3'>
              Чем IQOS отличается от электронных сигарет?
            </h3>
            <p className='text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-pretty'>
              Это принципиально разные категории продуктов. IQOS создан для ценителей вкуса
              настоящего табачного листа.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-6 md:gap-8'>
            {/* IQOS Card */}
            <div className='p-6 md:p-8 rounded-3xl border border-emerald-200 bg-emerald-50/30 shadow-sm flex flex-col justify-between space-y-4'>
              <div>
                <div className='inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-wider mb-3'>
                  Настоящий табак
                </div>
                <h4 className='text-base md:text-lg font-bold text-[#34303d] mb-4'>
                  {ECIG_VS_IQOS.iqos.title}
                </h4>
                <ul className='space-y-3'>
                  {ECIG_VS_IQOS.iqos.points.map((pt) => (
                    <li
                      key={pt}
                      className='flex items-start gap-3 text-sm md:text-base text-[#34303d] leading-relaxed font-medium'
                    >
                      <span className='w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5'>
                        <Check className='w-3 h-3' />
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* E-Cigarettes Card */}
            <div className='p-6 md:p-8 rounded-3xl border border-neutral-200 bg-neutral-50/50 shadow-sm flex flex-col justify-between space-y-4'>
              <div>
                <div className='inline-block px-3 py-1 rounded-full bg-neutral-200 text-neutral-700 font-extrabold text-xs uppercase tracking-wider mb-3'>
                  Жидкости / Вейпы
                </div>
                <h4 className='text-base md:text-lg font-bold text-[#34303d] mb-4'>
                  {ECIG_VS_IQOS.ecig.title}
                </h4>
                <ul className='space-y-3'>
                  {ECIG_VS_IQOS.ecig.points.map((pt) => (
                    <li
                      key={pt}
                      className='flex items-start gap-3 text-sm md:text-base text-neutral-600 leading-relaxed font-medium'
                    >
                      <span className='w-5 h-5 rounded-full bg-neutral-300 text-neutral-700 flex items-center justify-center flex-shrink-0 text-xs mt-0.5'>
                        •
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
