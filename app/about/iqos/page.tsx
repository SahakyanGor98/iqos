import Image from 'next/image';
import { Button } from '@/components/Button';
import { ButtonVariant } from '@/components/ButtonTypes';
import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import {
  AboutDefaultSection,
  AboutHistorySection,
  AboutTextOnlySection,
} from '@/components/about/AboutSections';
import { IqosLineupSection } from '@/components/about/IqosLineupSection';
import { getIqosLineupProducts } from '@/lib/api';
import {
  IQOS_ABOUT_IMAGES,
  IQOS_ABOUT_SECTIONS,
  IQOS_DEVICE_LINEUP,
  IQOS_DISCLAIMERS,
  IQOS_FAQ,
} from '@/lib/content/iqos-about';
import { ROUTES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Что такое IQOS — бездымные альтернативы',
  description:
    'IQOS — система нагревания табака без сжигания. Узнайте, как работает IQOS ILUMA, технология SMARTCORE и стики TEREA.',
  alternates: {
    canonical: '/about/iqos',
  },
};

export default async function IqosAboutPage() {
  const lineupDevices = await getIqosLineupProducts([...IQOS_DEVICE_LINEUP]);

  return (
    <div className='bg-white'>
      {/* Hero / Cover Section with stacked layout: Image on top, Text on white below */}
      <section className='w-full bg-white overflow-hidden border-b border-neutral-100'>
        {/* Top Banner Image */}
        <div className='relative w-full h-[35vh] md:h-[50vh] bg-neutral-50 overflow-hidden'>
          <Image
            src={IQOS_ABOUT_IMAGES.hero}
            alt='Бездымные альтернативы IQOS'
            fill
            priority
            sizes='100vw'
            className='object-cover object-right md:object-center scale-105 opacity-100'
          />
        </div>

        {/* Text Content below on white background */}
        <div className='container-custom py-12 md:py-16'>
          <div className='max-w-3xl text-left text-[#34303d]'>
            <h1 className='text-3xl md:text-5xl mb-4 lg:text-6xl font-black uppercase tracking-tight text-[#34303d] leading-[1.1] text-balance'>
              Что такое IQOS?
            </h1>
            <p className='text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#34303d]/70 md:mb-4'>
              Бездымные альтернативы
            </p>
            <p className='mt-4 md:mt-6 text-base leading-relaxed text-[#34303d]/90 text-pretty'>
              IQOS — инновационная линейка бездымных устройств и лучшая альтернатива сигаретам. В отличие от сигарет, IQOS не сжигает табак, а бережно нагревает его до строго контролируемой температуры.
            </p>
            <p className='mt-4 text-xs leading-relaxed text-neutral-500 text-pretty'>
              Источник: трёхмесячные клинические исследования, проведённые в США и Японии с участием 160 совершеннолетних курильщиков в реальных условиях (амбулаторно).
            </p>
          </div>
        </div>
      </section>

      {IQOS_ABOUT_SECTIONS.map((section) => (
        <div key={section.id} className='flex flex-col'>
          {section.layout === 'text-only' ? (
            <AboutTextOnlySection section={section} />
          ) : section.layout === 'background-right' ? (
            <AboutHistorySection section={section} />
          ) : (
            <AboutDefaultSection section={section} />
          )}
        </div>
      ))}

      <IqosLineupSection devices={lineupDevices} />

      {/* FAQ */}
      <section className='py-12 md:py-20 bg-white border-t border-neutral-100'>
        <div className='container-custom max-w-3xl'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight text-center mb-10 text-[#34303d] text-balance'>
            Часто задаваемые вопросы
          </h2>

          <div className='divide-y divide-neutral-200 border-y border-neutral-200'>
            {IQOS_FAQ.map((item) => (
              <details key={item.question} className='group'>
                <summary className='relative cursor-pointer list-none py-5 md:py-6 pr-10'>
                  <span className='font-bold text-base md:text-lg text-[#34303d]'>{item.question}</span>
                  <ChevronDown className='absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform duration-300 group-open:rotate-180 text-[#34303d]' />
                </summary>
                <p className='pb-5 md:pb-6 text-[#34303d]/85 text-left leading-relaxed text-pretty'>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-50 py-12 md:py-20 px-6 text-center border-t border-neutral-200'>
        <div className='container-custom max-w-4xl mx-auto'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 md:mb-6 text-[#34303d] text-balance'>
            Начать свой опыт прямо сейчас
          </h2>
          <p className='text-base md:text-lg text-[#34303d]/80 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed text-pretty'>
            Выберите устройство IQOS ILUMA или свяжитесь с нами — мы поможем подобрать идеальный
            вариант.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Button href={ROUTES.catalog.iqos} variant={ButtonVariant.PRIMARY}>
              Каталог устройств
            </Button>
            <Button href={ROUTES.contact} variant={ButtonVariant.SECONDARY}>
              Связаться с нами
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className='bg-neutral-100 py-8 px-6'>
        <div className='container-custom max-w-4xl mx-auto space-y-3'>
          {IQOS_DISCLAIMERS.map((text) => (
            <p key={text} className='text-xs text-neutral-500 leading-relaxed text-center text-pretty'>
              {text}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
