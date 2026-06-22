import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { HapticLink, HeroSlider, IqosWhatIsSection, PromoBlock } from '@/components';
import { ENABLE_PROMO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Купить IQOS ILUMA и стики TEREA в Москве | Официальный магазин',
  description:
    'Магазин оригинальных устройств IQOS ILUMA и стиков TEREA. Все вкусы в наличии, быстрая доставка по Москве. Проконсультируйтесь с нашими экспертами.',
};

const TextSeparator = ({ className = '' }: { className?: string }) => (
  <div className={`w-full bg-white h-2 md:h-3 border-y border-neutral-100 ${className}`} />
);

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <HeroSlider />

      {/* <TextSeparator /> */}

      {ENABLE_PROMO && <PromoBlock />}

      {/* Separator 1: Always visible */}
      <TextSeparator />

      <div className='flex flex-col md:flex-row h-[calc(100vh-64px)] relative'>
        {/* IQOS Section */}
        <section className='relative flex-1 group overflow-hidden border-b md:border-b-0 md:border-r border-white/10'>
          <div className='absolute inset-0 bg-neutral-700 z-10 opacity-30 md:opacity-70 transition-opacity duration-500 group-hover:opacity-30'></div>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/devices1.webp'
              alt='Устройство IQOS ILUMA - Революционная технология нагревания табака'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              priority
            />
          </div>

          <div className='relative z-20 h-full flex flex-col justify-center items-center text-center p-8 text-white drop-shadow-lg'>
            <div>
              <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
                IQOS ILUMA
              </h2>
              <p className='text-base md:text-lg font-bold text-white max-w-md mx-auto translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 leading-relaxed'>
                Революционная технология индукционного нагревания табака без лезвия.
              </p>
            </div>
            <HapticLink
              href='/products/iqos'
              className='absolute bottom-8 md:bottom-12 btn-primary bg-white text-black hover:bg-neutral-200 shadow-none active:scale-[0.94] active:brightness-90 active:shadow-inner transition-all duration-100'
            >
              Выбрать устройство
            </HapticLink>
          </div>
        </section>

        {/* Separator 2: Only visible on mobile, separates IQOS and Terea blocks */}
        <TextSeparator className='md:hidden border-t-0' />

        {/* Terea Section */}
        <section className='relative flex-1 group overflow-hidden'>
          <div className='absolute inset-0 bg-neutral-700 z-10 opacity-30 md:opacity-70 transition-opacity duration-500 group-hover:opacity-40'></div>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/terea.webp'
              alt='Стики TEREA для IQOS ILUMA - Широкий выбор вкусов'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover object-right transition-transform duration-700 group-hover:scale-105'
              priority
            />
          </div>

          <div className='relative z-20 h-full flex flex-col justify-center items-center text-center p-8 text-white drop-shadow-lg'>
            <div>
              <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
                Стики Terea
              </h2>
              <p className='text-base md:text-lg font-bold text-white max-w-md mx-auto translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 leading-relaxed'>
                Широкая палитра вкусов для вашего устройства IQOS Iluma.
              </p>
            </div>
            <HapticLink
              href='/products/terea'
              className='absolute bottom-8 md:bottom-12 btn-primary bg-white text-black hover:bg-neutral-200 shadow-none active:scale-[0.94] active:brightness-90 active:shadow-inner transition-all duration-100'
            >
              Каталог вкусов
            </HapticLink>
          </div>
        </section>
      </div>

      <TextSeparator />
      <IqosWhatIsSection />

      <TextSeparator />
      {/* CTA Section */}
      <section className='bg-neutral-50 py-16 md:py-24 px-6 text-center'>
        <div className='container-custom max-w-4xl mx-auto'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 md:mb-6'>
            Мы здесь, чтобы помочь
          </h2>
          <p className='text-base md:text-lg text-neutral-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed'>
            Не уверены в выборе? Наши эксперты проконсультируют вас и помогут подобрать идеальное
            устройство и вкусы, подходящие именно вам.
          </p>
          <Link
            href='/contact'
            className='inline-flex items-center justify-center px-6 py-3 text-sm md:px-8 md:py-4 md:text-base bg-black text-white font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-transform active:scale-95 active:brightness-90'
          >
            Связаться с нами
          </Link>
        </div>
      </section>
    </div>
  );
}
