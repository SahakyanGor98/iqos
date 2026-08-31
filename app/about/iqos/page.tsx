import { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { FaqAccordion } from '@/components/FaqAccordion';
import { TextSeparator } from '@/components/TextSeparator';
import { ButtonVariant } from '@/components/ButtonTypes';
import { AboutFactsGrid } from '@/components/about/AboutFactsGrid';
import { IqosLineupSection } from '@/components/about/IqosLineupSection';
import { AboutTechHighlights } from '@/components/about/AboutTechHighlights';
import { AboutComparisonTable } from '@/components/about/AboutComparisonTable';
import {
  AboutDefaultSection,
  AboutHistorySection,
  AboutTextOnlySection,
} from '@/components/about/AboutSections';
import { ABOUT_FAQ } from '@/lib/content/faq';
import { getIqosLineupProducts } from '@/lib/api';
import {
  IQOS_ABOUT_IMAGES,
  IQOS_ABOUT_SECTIONS,
  IQOS_DEVICE_LINEUP,
} from '@/lib/content/iqos-about';
import { ROUTES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Что такое IQOS — бездымные альтернативы',
  description:
    'IQOS — система нагревания табака без сжигания. Узнайте, как работает IQOS ILUMA, технология SMARTCORE, стики TEREA и история разработки.',
  alternates: {
    canonical: '/about/iqos',
  },
};

export default async function IqosAboutPage() {
  const lineupDevices = await getIqosLineupProducts([...IQOS_DEVICE_LINEUP]);

  const whySection = IQOS_ABOUT_SECTIONS.find((s) => s.id === 'why-iqos');
  const aerosolSection = IQOS_ABOUT_SECTIONS.find((s) => s.id === 'aerosol-science');
  const historySection = IQOS_ABOUT_SECTIONS.find((s) => s.id === 'history');

  return (
    <div className='bg-white'>
      {/* 1. Hero / Cover Section */}
      <section className='w-full bg-white overflow-hidden border-b border-neutral-100'>
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

        <div className='container-custom py-12 md:py-16'>
          <div className='max-w-3xl text-left text-[#34303d]'>
            <h1 className='text-3xl md:text-5xl mb-4 lg:text-6xl font-black uppercase tracking-tight text-[#34303d] leading-[1.1] text-balance'>
              Что такое IQOS?
            </h1>
            <p className='text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#34303d]/70 md:mb-4'>
              Инновационные бездымные системы нагревания табака
            </p>
            <p className='mt-4 md:mt-6 text-base md:text-lg leading-relaxed text-[#34303d]/90 text-pretty font-medium'>
              IQOS — это система нагревания табака, разработанная компанией Philip Morris
              International (PMI) для совершеннолетних курильщиков. Устройство не сжигает табак, а
              нагревает его до строго контролируемой температуры, образуя табачный аэрозоль без
              горения, пепла и угарного газа.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Act 1: Why IQOS was created */}
      {whySection && (
        <>
          <TextSeparator />
          <AboutDefaultSection section={whySection} />
        </>
      )}

      {/* 3. Act 2: Aerosol Science & Heat-not-Burn */}
      {aerosolSection && (
        <>
          <TextSeparator />
          <AboutDefaultSection section={aerosolSection} />
        </>
      )}

      {/* 4. Act 3: Direct Comparisons (IQOS vs Cigarettes & E-cigs) */}
      <TextSeparator />
      <AboutComparisonTable />

      {/* 5. Act 4: Temperature Science & SMARTCORE INDUCTION SYSTEM */}
      <TextSeparator />
      <AboutTechHighlights />

      {/* 6. Act 5: Chronological History & Evolution Timeline */}
      {historySection && (
        <>
          <TextSeparator />
          <AboutHistorySection section={historySection} />
        </>
      )}

      {/* 7. Act 6: Device Lineup Showcase & Summary Facts Grid */}
      <TextSeparator />
      <IqosLineupSection devices={lineupDevices} />

      <TextSeparator />
      <AboutFactsGrid />

      {/* 8. Act 7: FAQ Accordion & CTA */}
      <TextSeparator />
      <FaqAccordion
        items={ABOUT_FAQ}
        initialVisibleCount={3}
        enableExpandButton={true}
        title='Часто задаваемые вопросы'
        // subtitle='Узнайте подробнее об индукционном нагреве, линейке устройств ILUMA и правилах использования.'
      />

      <TextSeparator />
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
    </div>
  );
}
