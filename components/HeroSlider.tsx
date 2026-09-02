'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { HapticLink } from './HapticLink';
import { Button } from './Button';
import { ButtonShadow, ButtonVariant } from './ButtonTypes';
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import { cn, fixCasing } from '@/lib/utils';

const TELEGRAM_SLIDE_TITLE = 'Подпишись в Telegram';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  buttonText: string;
  buttonLink: string;
  imagePlacement?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' | 'fit';
  backgroundColor?: string;
  hideOverlay?: boolean;
  hideText?: boolean;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'IQOS ILUMA i x SELETTI',
    subtitle: 'Эксклюзивная коллекция, созданная в коллаборации с итальянским брендом Seletti.',
    desktopImage: '/seletti.webp',
    mobileImage: '/seletti2.webp',
    buttonText: 'Выбрать устройство',
    buttonLink: '/products/iqos/iqos-iluma-i-x-seletti',
    imagePlacement: 'contain',
    backgroundColor: '#080808',
  },
  {
    id: 2,
    title: TELEGRAM_SLIDE_TITLE,
    subtitle: 'Секретные промокоды, акции и новинки — только в нашем Telegram канале',
    desktopImage: '/blueGradient2.webp',
    mobileImage: '/blueGradient2.webp',
    buttonText: 'Перейти в канал',
    buttonLink: 'https://t.me/iqos_ms',
    backgroundColor: '#0B1220',
    imagePlacement: 'cover',
  },
  {
    id: 3,
    title: 'Трейд‑ин со скидкой',
    subtitle:
      'Сдайте старый IQOS, lil SOLID или другое устройство и получите новый IQOS ILUMA с выгодой до 2 500 ₽. Принимаем в любом состоянии.',
    desktopImage: '/trade-in-1.webp',
    mobileImage: '/trade-in-2.webp',
    buttonText: 'Рассчитать Трейд‑ин',
    buttonLink: '/trade-in',
    imagePlacement: 'cover',
  },
  // {
  //   id: 3,
  //   title: 'Новый дизайн — тот же вкус',
  //   subtitle: 'Откройте для себя обновленную коллекцию стиков TEREA для IQOS ILUMA.',
  //   desktopImage: '/terea-leaf.webp',
  //   buttonText: 'Каталог стиков',
  //   buttonLink: '/products/terea',
  // },
  {
    id: 4,
    title: 'IQOS ILUMA PRIME i x SELETTI',
    subtitle: 'Премиальный дизайн и передовые технологии в лимитированном издании.',
    desktopImage: '/seletti-prime.webp',
    mobileImage: '/seletti-prime2.webp',
    buttonText: 'Выбрать устройство',
    buttonLink: '/products/iqos/iqos-iluma-prime-i-x-seletti',
    imagePlacement: 'contain',
    backgroundColor: '#080808',
  },
  // {
  //   id: 5,
  //   title: 'IQOS ILUMA i PRIME',
  //   subtitle: 'Инновационная технология и премиальный дизайн для истинных ценителей.',
  //   desktopImage: '/ILUMA_i_Prime.webp',
  //   buttonText: 'Выбрать модель',
  //   buttonLink: '/products/iqos?line=i+prime&page=1',
  //   imagePlacement: 'contain',
  //   backgroundColor: '#58625cff',
  // },
  {
    id: 5,
    title: 'Природная Горная Вода',
    buttonText: 'Купить',
    buttonLink: '/products/water/mountain-water-330ml-box',
    imagePlacement: 'cover',
    desktopImage: '/water_hero_slider_desktop.webp',
    mobileImage: '/water_hero_slider_mobile.webp',
    hideOverlay: true,
    hideText: true,
  },
];

export const HeroSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (!emblaApi) return;

    // Clear any existing timer just in case
    if (timerRef.current) clearInterval(timerRef.current);

    // Start fresh 5s timer
    timerRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const resetAutoplay = useCallback(() => {
    stopAutoplay();
    startAutoplay();
  }, [stopAutoplay, startAutoplay]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      resetAutoplay();
    },
    [emblaApi, resetAutoplay],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Initial start
    startAutoplay();

    return () => stopAutoplay();
  }, [emblaApi, onSelect, startAutoplay, stopAutoplay]);

  return (
    <section className='relative w-full flex flex-col group'>
      {/* Delivery Banner — normal flow, occupies real height */}
      <div className='w-full bg-gradient-to-r from-neutral-950/85 via-neutral-900/90 to-neutral-950/85 backdrop-blur-md border-b border-white/10 text-white py-2.5 px-4 text-center select-none'>
        <div className='flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-neutral-100'>
          <Truck className='w-3.5 h-3.5 md:w-4 md:h-4 text-white animate-pulse' />
          <span>Доставка по всей России</span>
        </div>
      </div>

      <div className='overflow-hidden h-[60vh] md:h-[calc(100vh-64px)]' ref={emblaRef}>
        <div className='flex h-full'>
          {slides.map((slide) => {
            const objectFitClass = cn(
              slide.imagePlacement === 'contain' || slide.imagePlacement === 'fit'
                ? 'object-contain'
                : slide.imagePlacement === 'fill'
                  ? 'object-fill'
                  : slide.imagePlacement === 'none'
                    ? 'object-none'
                    : slide.imagePlacement === 'scale-down'
                      ? 'object-scale-down'
                      : 'object-cover',
            );

            return (
              <div key={slide.id} className='relative flex-[0_0_100%] min-w-0 h-full'>
                {/* Background Image */}
                <div
                  className='absolute inset-0 z-0'
                  style={{ backgroundColor: slide.backgroundColor }}
                >
                  {/* Mobile Image */}
                  <div className='md:hidden absolute inset-0'>
                    <Image
                      src={slide.mobileImage || slide.desktopImage}
                      alt={slide.title}
                      fill
                      sizes='100vw'
                      className={objectFitClass}
                      priority={slide.id === 1}
                    />
                  </div>
                  {/* Desktop Image */}
                  <div className='hidden md:block absolute inset-0'>
                    <Image
                      src={slide.desktopImage}
                      alt={slide.title}
                      fill
                      sizes='100vw'
                      className={objectFitClass}
                      priority={slide.id === 1}
                    />
                  </div>
                  {!slide.hideOverlay && (
                    <div
                      className={cn(
                        'absolute inset-0 transition-opacity duration-700',
                        slide.backgroundColor ? 'bg-black/20' : 'bg-black/40',
                      )}
                    />
                  )}
                </div>

                {/* Content Box */}
                <div className='relative z-10 h-full flex flex-col justify-center items-center text-center p-6 md:p-12 text-white'>
                  <div className='py-24 w-full max-w-3xl h-full flex flex-col justify-between items-center text-center'>
                    {!slide.hideText ? (
                      <div>
                        <h1 className='text-4xl md:text-6xl font-black tracking-tighter leading-tight'>
                          {fixCasing(slide.title, true)}
                        </h1>
                        {slide.subtitle && (
                          <p className='text-base md:text-lg font-bold max-w-2xl mx-auto opacity-90 leading-relaxed mt-2'>
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}
                    {slide.title === TELEGRAM_SLIDE_TITLE ? (
                      <HapticLink
                        href={slide.buttonLink}
                        target='_blank'
                        className='inline-flex items-center justify-center relative'
                      >
                        {/* outer glow */}
                        <span className='absolute inset-0 rounded-full bg-sky-400/40 animate-ping' />

                        {/* outer white circle */}
                        <span className='relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl'>
                          {/* inner blue circle */}
                          <span className='w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center'>
                            {/* Telegram icon (inline SVG) */}
                            <svg
                              viewBox='0 0 24 24'
                              className='w-6 h-6 text-white'
                              fill='currentColor'
                            >
                              <path d='M9.04 15.47l-.39 5.5c.56 0 .81-.24 1.11-.53l2.64-2.53 5.47 4.01c1 .55 1.7.26 1.96-.92L23.9 4.9c.32-1.48-.54-2.06-1.5-1.7L1.7 9.16c-1.45.56-1.43 1.37-.25 1.74l5.7 1.78L19.3 6.3c.6-.38 1.15-.17.7.22' />
                            </svg>
                          </span>
                        </span>
                      </HapticLink>
                    ) : (
                      slide.buttonText && (
                        <Button
                          href={slide.buttonLink}
                          variant={ButtonVariant.LIGHT}
                          shadow={ButtonShadow.LARGE}
                        >
                          {slide.buttonText}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation - Arrows */}
      <button
        onClick={scrollPrev}
        className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition hover:bg-white/20 active:scale-90 active:bg-white/30 focus-visible:ring-2 focus-visible:ring-white opacity-0 group-hover:opacity-100 hidden md:flex'
        aria-label='Previous slide'
      >
        <ChevronLeft className='w-6 h-6 md:w-8 md:h-8' />
      </button>
      <button
        onClick={scrollNext}
        className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition hover:bg-white/20 active:scale-90 active:bg-white/30 focus-visible:ring-2 focus-visible:ring-white opacity-0 group-hover:opacity-100 hidden md:flex'
        aria-label='Next slide'
      >
        <ChevronRight className='w-6 h-6 md:w-8 md:h-8' />
      </button>

      {/* Navigation - Dots */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20'>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              'w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 active:scale-75',
              selectedIndex === index
                ? 'bg-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                : 'bg-white/40 hover:bg-white/60',
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
