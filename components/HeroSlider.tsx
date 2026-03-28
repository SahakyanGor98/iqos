'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'IQOS ILUMA i x SELETTI',
    subtitle: 'Эксклюзивная коллекция, созданная в коллаборации с итальянским брендом Seletti.',
    image: '/seletti.webp',
    buttonText: 'Выбрать устройство',
    buttonLink: '/products/iqos/iqos-iluma-i-x-seletti',
  },
  {
    id: 2,
    title: 'IQOS ILUMA PRIME i x SELETTI',
    subtitle: 'Премиальный дизайн и передовые технологии в лимитированном издании.',
    image: '/seletti-prime.webp',
    buttonText: 'Выбрать устройство',
    buttonLink: '/products/iqos/iqos-iluma-prime-i-x-seletti',
  },
];

export const HeroSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Simple Autoplay
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoplay);
  }, [emblaApi, setScrollSnaps, onSelect]);

  return (
    <section className='relative w-full h-[70vh] md:h-[80vh] overflow-hidden group'>
      <div className='overflow-hidden h-full' ref={emblaRef}>
        <div className='flex h-full'>
          {slides.map((slide) => (
            <div key={slide.id} className='relative flex-[0_0_100%] min-w-0 h-full'>
              {/* Background Image */}
              <div className='absolute inset-0 z-0'>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  className='object-cover'
                  priority={slide.id === 1}
                />
                <div className='absolute inset-0 bg-black/40' />
              </div>

              {/* Content Box */}
              <div className='relative z-10 h-full flex flex-col justify-center items-center text-center p-6 md:p-12 text-white'>
                <div className='max-w-3xl transform transition-all duration-700 translate-y-0 opacity-100'>
                  <h1 className='text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-tight'>
                    {slide.title}
                  </h1>
                  <p className='text-lg md:text-2xl font-medium mb-8 md:mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed'>
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.buttonLink}
                    className='inline-flex items-center justify-center px-8 py-4 text-base md:text-lg bg-white text-black font-bold uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl'
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation - Arrows */}
      <button
        onClick={scrollPrev}
        className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition hover:bg-white/20 opacity-0 group-hover:opacity-100 hidden md:flex'
        aria-label='Previous slide'
      >
        <ChevronLeft className='w-6 h-6 md:w-8 md:h-8' />
      </button>
      <button
        onClick={scrollNext}
        className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition hover:bg-white/20 opacity-0 group-hover:opacity-100 hidden md:flex'
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
              'w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300',
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
