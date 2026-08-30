'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowLeftRight, ArrowDown } from 'lucide-react';
import {
  OLD_DEVICES,
  TARGET_DEVICES,
  OldDeviceOption,
  TargetDeviceOption,
  getDeviceDiscount,
} from '@/lib/content/trade-in';
import { formatPrice } from '@/lib/utils';
import { TradeInForm } from './TradeInForm';
import { Button } from '@/components/Button';
import { ButtonVariant } from '@/components/ButtonTypes';

/* -------------------------------------------------------------------------- */
/* Old-device selector — embla carousel with arrows, dots and a peek edge      */
/* -------------------------------------------------------------------------- */

interface OldDeviceCarouselProps {
  selectedId: string;
  onSelect: (device: OldDeviceOption) => void;
}

const OldDeviceCarousel: React.FC<OldDeviceCarouselProps> = ({ selectedId, onSelect }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSnap = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSnap();
    emblaApi.on('select', onSnap);
    emblaApi.on('reInit', onSnap);
    return () => {
      emblaApi.off('select', onSnap);
      emblaApi.off('reInit', onSnap);
    };
  }, [emblaApi, onSnap]);

  return (
    <div className='mt-auto pt-4'>
      <div className='flex items-center justify-between mb-2.5'>
        <span className='text-[11px] uppercase font-bold tracking-wider text-neutral-400'>
          Выберите модель для сдачи
        </span>
        <div className='flex items-center gap-1.5'>
          <button
            type='button'
            onClick={scrollPrev}
            disabled={!canPrev}
            aria-label='Предыдущие модели'
            className='w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white transition hover:bg-white/20 active:scale-90 disabled:opacity-30 disabled:pointer-events-none'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>
          <button
            type='button'
            onClick={scrollNext}
            disabled={!canNext}
            aria-label='Следующие модели'
            className='w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white transition hover:bg-white/20 active:scale-90 disabled:opacity-30 disabled:pointer-events-none'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Track */}
      <div className='overflow-hidden -mx-1' ref={emblaRef}>
        <div className='flex'>
          {OLD_DEVICES.map((device) => {
            const isSelected = selectedId === device.id;
            const discountVal = getDeviceDiscount(device);
            return (
              <div key={device.id} className='flex-[0_0_47%] sm:flex-[0_0_38%] min-w-0 px-1'>
                <button
                  type='button'
                  onClick={() => onSelect(device)}
                  aria-pressed={isSelected}
                  className={`w-full h-full text-left p-2.5 rounded-2xl border transition-all duration-150 ${
                    isSelected
                      ? 'border-white bg-white text-neutral-900 shadow-lg'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/25'
                  }`}
                >
                  <div className='relative w-full aspect-square rounded-xl bg-neutral-900/60 overflow-hidden mb-2'>
                    <Image
                      src={device.image}
                      alt={device.name}
                      fill
                      sizes='140px'
                      className='object-contain p-2'
                    />
                  </div>
                  <div className='text-[11px] font-bold leading-tight line-clamp-2 min-h-[26px]'>
                    {device.name}
                  </div>
                  <div
                    className={`text-xs font-black mt-0.5 ${isSelected ? 'text-emerald-600' : 'text-emerald-400'}`}
                  >
                    −{formatPrice(discountVal)}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {snaps.length > 1 && (
        <div className='flex justify-center gap-1.5 mt-3'>
          {snaps.map((_, i) => (
            <button
              key={i}
              type='button'
              onClick={() => scrollTo(i)}
              aria-label={`Прокрутить к группе ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedSnap === i ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Main calculator                                                            */
/* -------------------------------------------------------------------------- */

const StepBadge = ({ n, label }: { n: number; label: string }) => (
  <div className='flex items-center gap-2 mb-3'>
    <span className='w-6 h-6 rounded-full bg-white text-neutral-900 text-xs font-black flex items-center justify-center shrink-0'>
      {n}
    </span>
    <span className='text-sm font-bold uppercase tracking-wide text-white'>{label}</span>
  </div>
);

export const TradeInCalculator: React.FC = () => {
  const [selectedOldDevice, setSelectedOldDevice] = useState<OldDeviceOption>(OLD_DEVICES[0]);
  const [selectedTargetDevice, setSelectedTargetDevice] = useState<TargetDeviceOption>(
    TARGET_DEVICES[0],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const estimatedDiscount = getDeviceDiscount(selectedOldDevice);
  const finalPrice = Math.max(0, selectedTargetDevice.fullPrice - estimatedDiscount);

  return (
    <section id='calculator' className='py-14 md:py-24 px-4 md:px-6 bg-neutral-50 text-[#34303d]'>
      <div className='container-custom max-w-5xl mx-auto'>
        {/* Header */}
        <div className='max-w-2xl mx-auto text-center mb-10 md:mb-14'>
          <h2 className='text-3xl md:text-5xl font-black uppercase tracking-tight text-[#34303d] mb-3'>
            Калькулятор Трейд-ин
          </h2>
          <p className='text-[#34303d]/70 text-base md:text-lg'>
            Выберите старое устройство и новый IQOS ILUMA. Расчёт скидки обновится мгновенно.
          </p>
        </div>

        {/* Showcase card */}
        <div className='bg-[#34303D] rounded-[28px] p-5 sm:p-8 md:p-10 text-white shadow-2xl'>
          <div className='grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-4 items-stretch'>
            {/* ---- Give (old device) ---- */}
            <div className='flex flex-col min-w-0 p-4 sm:p-5 rounded-3xl bg-white/[0.06] border border-white/10'>
              <StepBadge n={1} label='Что сдаёте' />

              <div className='relative w-full h-40 sm:h-52 rounded-2xl bg-neutral-950/40 overflow-hidden'>
                <Image
                  key={selectedOldDevice.id}
                  src={selectedOldDevice.image}
                  alt={selectedOldDevice.name}
                  fill
                  sizes='(max-width: 768px) 90vw, 360px'
                  className='object-contain p-4'
                />
                <span className='absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-lg'>
                  −{formatPrice(estimatedDiscount)}
                </span>
              </div>

              <div className='mt-3'>
                <h4 className='font-black text-lg leading-tight'>{selectedOldDevice.name}</h4>
                <p className='text-xs text-neutral-400 mt-0.5'>{selectedOldDevice.description}</p>
              </div>

              <OldDeviceCarousel
                selectedId={selectedOldDevice.id}
                onSelect={setSelectedOldDevice}
              />
            </div>

            {/* ---- Exchange indicator ---- */}
            <div className='flex md:flex-col items-center justify-center'>
              <div className='w-11 h-11 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg shrink-0'>
                <ArrowLeftRight className='w-5 h-5 hidden md:block' />
                <ArrowDown className='w-5 h-5 md:hidden' />
              </div>
            </div>

            {/* ---- Get (new device) ---- */}
            <div className='flex flex-col min-w-0 p-4 sm:p-5 rounded-3xl bg-white/[0.06] border border-white/10'>
              <StepBadge n={2} label='Что получаете' />

              <div className='relative w-full h-40 sm:h-52 rounded-2xl bg-neutral-950/40 overflow-hidden'>
                <Image
                  key={selectedTargetDevice.id}
                  src={selectedTargetDevice.image}
                  alt={selectedTargetDevice.name}
                  fill
                  sizes='(max-width: 768px) 90vw, 360px'
                  className='object-contain p-4'
                />
              </div>

              <div className='mt-3'>
                <div className='flex items-baseline gap-2'>
                  <h4 className='font-black text-lg leading-tight'>{selectedTargetDevice.name}</h4>
                  <span className='text-xs text-neutral-400 line-through'>
                    {formatPrice(selectedTargetDevice.fullPrice)}
                  </span>
                </div>
                <p className='text-xs text-neutral-400 mt-0.5'>{selectedTargetDevice.tagline}</p>
              </div>

              {/* Target selector — 3 options, all visible */}
              <div className='mt-auto pt-4'>
                <span className='text-[11px] uppercase font-bold tracking-wider text-neutral-400 block mb-2.5'>
                  Выберите новый IQOS ILUMA
                </span>
                <div className='grid grid-cols-3 gap-2'>
                  {TARGET_DEVICES.map((target) => {
                    const isSelected = selectedTargetDevice.id === target.id;
                    const itemFinalPrice = Math.max(0, target.fullPrice - estimatedDiscount);
                    return (
                      <button
                        key={target.id}
                        type='button'
                        onClick={() => setSelectedTargetDevice(target)}
                        aria-pressed={isSelected}
                        className={`p-2 rounded-2xl border text-center transition-all duration-150 ${
                          isSelected
                            ? 'border-white bg-white text-neutral-900 shadow-lg'
                            : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className='relative w-full aspect-square rounded-lg bg-neutral-900/60 overflow-hidden mb-1.5'>
                          <Image
                            src={target.image}
                            alt={target.name}
                            fill
                            sizes='90px'
                            className='object-contain p-1.5'
                          />
                        </div>
                        <div className='text-[10px] font-bold leading-tight truncate'>
                          {target.line}
                        </div>
                        <div
                          className={`text-[10px] font-black ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}
                        >
                          {formatPrice(itemFinalPrice)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ---- Result bar ---- */}
          <div className='mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5'>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-sm text-neutral-300'>Ваша выгода</span>
                <span className='px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-black'>
                  −{formatPrice(estimatedDiscount)}
                </span>
              </div>
              <div className='flex items-baseline gap-2.5'>
                <span className='text-3xl sm:text-4xl font-black tracking-tight'>
                  {formatPrice(finalPrice)}
                </span>
                <span className='text-sm text-neutral-400 line-through'>
                  {formatPrice(selectedTargetDevice.fullPrice)}
                </span>
              </div>
              <div className='text-xs text-neutral-400 mt-1'>Итого к оплате при обмене</div>
            </div>

            <Button onClick={() => setIsModalOpen(true)} variant={ButtonVariant.LIGHT}>
              Оформить обмен
            </Button>
          </div>
        </div>
      </div>

      {/* Slide-over form */}
      <TradeInForm
        isOpen={isModalOpen}
        oldDeviceName={selectedOldDevice.name}
        oldDeviceId={selectedOldDevice.id}
        targetDeviceName={selectedTargetDevice.name}
        targetSlug={selectedTargetDevice.slug}
        targetFullPrice={selectedTargetDevice.fullPrice}
        estimatedDiscount={estimatedDiscount}
        finalPrice={finalPrice}
        onCancel={() => setIsModalOpen(false)}
      />
    </section>
  );
};
