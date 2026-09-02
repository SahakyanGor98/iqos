import Image from 'next/image';
import { Button } from '@/components/Button';
import { ButtonVariant } from '@/components/ButtonTypes';

const HERO_HIGHLIGHTS = [
  { value: 'до 2 500 ₽', label: 'Выгода при обмене' },
  { value: 'Любое состояние', label: 'Даже нерабочие устройства' },
  { value: 'При получении', label: 'Обмен в точке выдачи' },
];

export const TradeInHero = () => {
  return (
    <section className='relative overflow-hidden bg-neutral-50 text-[#34303d] md:pt-16 pb-12 md:pb-20 px-4 md:px-6'>
      <div className='container-custom max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center'>
          {/* Copy */}
          <div className='text-left order-2 md:order-1'>
            <p className='text-xs uppercase font-bold tracking-widest text-neutral-500 mb-3'>
              Трейд&#8209;ин только в Москве
            </p>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-[#34303d] text-balance mb-5'>
              Сдайте старый IQOS,{' '}
              <span className='text-[#34303d]/60'>получите новый ILUMA со скидкой</span>
            </h1>
            <p className='text-sm md:text-base text-[#34303d]/80 max-w-xl leading-relaxed mb-7 text-pretty'>
              Простой обмен устройств в Москве. Принимаем IQOS, lil SOLID и другие бренды в любом
              состоянии, с выгодой до <strong className='text-[#34303d] font-bold'>2 500 ₽</strong>.
            </p>
            <Button href='#calculator' variant={ButtonVariant.PRIMARY}>
              Рассчитать скидку
            </Button>
          </div>

          {/* Device visual — edge-to-edge full-bleed on mobile (matches the About
              page hero), rounded landscape card on desktop */}
          <div className='order-1 md:order-2'>
            <div className='relative aspect-square w-screen left-1/2 -ml-[50vw] overflow-hidden md:aspect-video md:w-full md:left-auto md:ml-0 md:rounded-[28px] md:border md:border-neutral-200/80'>
              <Image
                src='/trade-in-2.webp'
                alt='Обмен старого устройства IQOS по программе Трейд-ин'
                fill
                priority
                sizes='100vw'
                className='object-cover md:hidden'
              />
              <Image
                src='/trade-in-1.webp'
                alt='Обмен старого устройства IQOS по программе Трейд-ин'
                fill
                priority
                sizes='(max-width: 768px) 90vw, 520px'
                className='hidden object-cover md:block'
              />
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 md:mt-14 border-t border-neutral-200/80 pt-8'>
          {HERO_HIGHLIGHTS.map((item) => (
            <div key={item.label} className='flex flex-col'>
              <span className='text-lg md:text-xl font-black text-[#34303d]'>{item.value}</span>
              <span className='text-xs text-[#34303d]/60 font-medium'>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
