'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  images: string[];
  title: string;
}

export const ProductImageCarousel = ({ images, title }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
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
  }, [emblaApi, setScrollSnaps, onSelect]);

  if (!images || images.length === 0) return null;

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Main View */}
      <div className='relative bg-neutral-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8 group'>
        <div className='overflow-hidden w-full h-full' ref={emblaRef}>
          <div className='flex h-full'>
            {images.map((src, index) => (
              <div
                key={index}
                className='flex-[0_0_100%] min-w-0 h-full flex items-center justify-center'
              >
                <img
                  src={`/api/proxy?url=${encodeURIComponent(src)}`}
                  alt={`${title} - image ${index + 1}`}
                  className='w-full h-full object-contain transition-transform duration-500 hover:scale-105'
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-neutral-200 flex items-center justify-center transition opacity-0 group-hover:opacity-100 hover:bg-white'
              onClick={scrollPrev}
            >
              <ChevronLeft className='w-6 h-6' />
            </button>
            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-neutral-200 flex items-center justify-center transition opacity-0 group-hover:opacity-100 hover:bg-white'
              onClick={scrollNext}
            >
              <ChevronRight className='w-6 h-6' />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition',
                selectedIndex === index ? 'border-neutral-900' : 'border-transparent bg-neutral-50',
              )}
            >
              <img
                src={`/api/proxy?url=${encodeURIComponent(src)}`}
                alt={`${title} thumb ${index + 1}`}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
