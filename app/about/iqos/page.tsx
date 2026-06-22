import Image from 'next/image';
import Link from 'next/link';
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
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='relative min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden bg-[#34303d]'>
        <Image
          src={IQOS_ABOUT_IMAGES.hero}
          alt='Бездымные альтернативы IQOS'
          fill
          priority
          sizes='100vw'
          className='object-cover object-center opacity-80'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-[#34303d] via-[#34303d]/60 to-transparent' />
        <div className='relative z-10 container-custom py-12 md:py-16 text-white'>
          <p className='text-sm font-bold uppercase tracking-widest text-white/70 mb-3'>
            Бездымные альтернативы
          </p>
          <h1 className='text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight max-w-3xl'>
            Что такое IQOS?
          </h1>
        </div>
      </section>

      {IQOS_ABOUT_SECTIONS.map((section) => {
        if (section.layout === 'text-only') {
          return <AboutTextOnlySection key={section.id} section={section} />;
        }

        if (section.layout === 'background-right') {
          return <AboutHistorySection key={section.id} section={section} />;
        }

        return <AboutDefaultSection key={section.id} section={section} />;
      })}

      <IqosLineupSection devices={lineupDevices} />

      {/* FAQ */}
      <section className='py-12 md:py-20 bg-white'>
        <div className='container-custom max-w-3xl'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight text-center mb-10'>
            Часто задаваемые вопросы
          </h2>

          <div className='divide-y divide-neutral-200 border-y border-neutral-200'>
            {IQOS_FAQ.map((item) => (
              <details key={item.question} className='group'>
                <summary className='relative cursor-pointer list-none py-5 md:py-6 pr-10'>
                  <span className='font-bold text-base md:text-lg'>{item.question}</span>
                  <ChevronDown className='absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform duration-300 group-open:rotate-180' />
                </summary>
                <p className='pb-5 md:pb-6 text-neutral-700 leading-relaxed'>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-50 py-16 md:py-24 px-6 text-center border-t border-neutral-200'>
        <div className='container-custom max-w-4xl mx-auto'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 md:mb-6'>
            Начать свой опыт прямо сейчас
          </h2>
          <p className='text-base md:text-lg text-neutral-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed'>
            Выберите устройство IQOS ILUMA или свяжитесь с нами — мы поможем подобрать идеальный
            вариант.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href={ROUTES.catalog.iqos} className='btn-primary'>
              Каталог устройств
            </Link>
            <Link href={ROUTES.contact} className='btn-secondary'>
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className='bg-neutral-100 py-8 px-6'>
        <div className='container-custom max-w-4xl mx-auto space-y-3'>
          {IQOS_DISCLAIMERS.map((text) => (
            <p key={text} className='text-xs text-neutral-500 leading-relaxed text-center'>
              {text}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
