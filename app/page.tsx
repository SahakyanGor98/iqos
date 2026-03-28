import Link from 'next/link';
import Image from 'next/image';
import { HeroSlider } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Купить IQOS ILUMA и стики TEREA в Москве | Официальный магазин',
  description:
    'Магазин оригинальных устройств IQOS ILUMA и стиков TEREA. Все вкусы в наличии, быстрая доставка по Москве. Проконсультируйтесь с нашими экспертами.',
};

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <HeroSlider />
      <div className='flex flex-col md:flex-row h-[calc(100vh-64px)] relative'>
        {/* IQOS Section */}
        <section className='relative flex-1 group overflow-hidden border-b md:border-b-0 md:border-r border-white/10'>
          <div className='absolute inset-0 bg-neutral-900 z-10 opacity-40 md:opacity-70 transition-opacity duration-500 group-hover:opacity-50'></div>
          <div className='absolute inset-0 z-0'>
            <Image
              src='/iqos.webp'
              alt='Устройство IQOS ILUMA - Революционная технология нагревания табака'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              priority
            />
          </div>

          <div className='relative z-20 h-full flex flex-col justify-center items-center text-center p-8 text-white drop-shadow-lg'>
            <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
              IQOS ILUMA
            </h2>
            <p className='text-base md:text-lg font-bold text-white mb-8 max-w-md translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 leading-relaxed'>
              Революционная технология индукционного нагревания табака без лезвия.
            </p>
            <Link
              href='/products/iqos'
              className='btn-primary bg-white text-black hover:bg-neutral-200 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200 shadow-none'
            >
              Выбрать устройство
            </Link>
          </div>
        </section>

        {/* Terea Section */}
        <section className='relative flex-1 group overflow-hidden'>
          <div className='absolute inset-0 bg-neutral-800 z-10 opacity-40 md:opacity-70 transition-opacity duration-500 group-hover:opacity-50'></div>
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
            <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
              Стики Terea
            </h2>
            <p className='text-base md:text-lg font-bold text-white mb-8 max-w-md translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 leading-relaxed'>
              Широкая палитра вкусов для вашего устройства IQOS Iluma.
            </p>
            <Link
              href='/products/terea'
              className='btn-primary bg-white text-black hover:bg-neutral-200 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200 shadow-none'
            >
              Каталог вкусов
            </Link>
          </div>
        </section>
      </div>

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
            className='inline-flex items-center justify-center px-6 py-3 text-sm md:px-8 md:py-4 md:text-base bg-black text-white font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-transform active:scale-95'
          >
            Связаться с нами
          </Link>
        </div>
      </section>
    </div>
  );
}
