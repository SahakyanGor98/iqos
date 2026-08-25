'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
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

export const TradeInCalculator: React.FC = () => {
  const [selectedOldDevice, setSelectedOldDevice] = useState<OldDeviceOption>(OLD_DEVICES[0]);
  const [selectedTargetDevice, setSelectedTargetDevice] = useState<TargetDeviceOption>(
    TARGET_DEVICES[0],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref for horizontal scroll container to prevent page scroll propagation
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault(); // Prevents outer page from scrolling vertically
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };

    // Attach non-passive wheel event listener
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Calculated discount (full discount regardless of condition)
  const estimatedDiscount = getDeviceDiscount(selectedOldDevice);
  const finalPrice = Math.max(0, selectedTargetDevice.fullPrice - estimatedDiscount);

  return (
    <section id='calculator' className='py-12 md:py-20 px-4 md:px-6 bg-neutral-50 text-[#34303d]'>
      <div className='container-custom max-w-5xl mx-auto'>
        {/* Header */}
        <div className='text-left md:text-center max-w-3xl mx-auto mb-10 md:mb-14'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight text-[#34303d] mb-3'>
            Онлайн-калькулятор Трейд-ин
          </h2>
          <p className='text-[#34303d]/80 text-sm md:text-base max-w-2xl mx-auto'>
            Выберите ваше устройство и новый IQOS ILUMA — фото и расчет обновится мгновенно
          </p>
        </div>

        {/* INTEGRATED INTERACTIVE SHOWCASE CARD (DARK MODE) */}
        <div className='bg-[#34303D] rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-[#34303D]/20 space-y-6'>
          
          {/* 2-COLUMN SHOWCASE (Left: Old Device, Right: New Device) */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10'>
            
            {/* LEFT SIDE: Old Device Box with thumbnail selector underneath */}
            <div className='flex flex-col p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 relative'>
              <div className='flex items-center justify-between mb-3'>
                <span className='px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300 border border-white/10'>
                  Сдаваемое устройство
                </span>
                <span className='text-xs font-black text-emerald-400'>
                  Скидка: -{formatPrice(estimatedDiscount)}
                </span>
              </div>

              {/* Main Image View */}
              <div className='relative w-full h-44 sm:h-52 mb-3 flex items-center justify-center rounded-xl bg-neutral-950/50 p-2 overflow-hidden group'>
                <Image
                  key={selectedOldDevice.id}
                  src={selectedOldDevice.image}
                  alt={selectedOldDevice.name}
                  fill
                  sizes='(max-width: 768px) 100vw, 400px'
                  className='object-contain p-3 transition-transform duration-300 group-hover:scale-105'
                />
              </div>

              {/* Selected Device Title */}
              <div className='mb-3 text-left'>
                <h4 className='font-black text-base sm:text-lg text-white leading-tight mb-0.5'>
                  {selectedOldDevice.name}
                </h4>
                <p className='text-xs text-neutral-400'>
                  {selectedOldDevice.description}
                </p>
              </div>

              {/* THUMBNAIL / VARIANT SELECTOR (directly under the image) */}
              <div className='mt-auto pt-3 border-t border-white/10'>
                <span className='text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-2 text-left'>
                  Выберите модель для сдачи:
                </span>
                <div
                  ref={scrollRef}
                  className='flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x'
                >
                  {OLD_DEVICES.map((device) => {
                    const isSelected = selectedOldDevice.id === device.id;
                    const discountVal = getDeviceDiscount(device);
                    return (
                      <button
                        key={device.id}
                        type='button'
                        onClick={() => setSelectedOldDevice(device)}
                        className={`flex-shrink-0 snap-start p-1.5 rounded-xl border transition-all duration-150 flex items-center gap-2 ${
                          isSelected
                            ? 'border-white bg-white text-black font-bold shadow-md scale-105'
                            : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className='relative w-8 h-8 rounded-md bg-neutral-900 p-0.5 flex-shrink-0 overflow-hidden'>
                          <Image
                            src={device.image}
                            alt={device.name}
                            fill
                            sizes='32px'
                            className='object-contain'
                          />
                        </div>
                        <div className='text-left pr-1'>
                          <div className='text-[11px] font-bold leading-tight whitespace-nowrap'>{device.name}</div>
                          <div className={`text-[9px] ${isSelected ? 'text-neutral-700' : 'text-emerald-400'}`}>
                            -{formatPrice(discountVal)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CENTER EXCHANGE DIVIDER */}
            <div className='hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-black font-black text-base items-center justify-center shadow-lg border border-neutral-300 pointer-events-none'>
              ⇄
            </div>

            {/* RIGHT SIDE: Target IQOS ILUMA Box with thumbnail selector underneath */}
            <div className='flex flex-col p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 relative'>
              <div className='flex items-center justify-between mb-3'>
                <span className='px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300 border border-white/10'>
                  Новый IQOS ILUMA
                </span>
                <span className='text-xs font-black text-white'>
                  Цена по Трейд-ин: {formatPrice(finalPrice)}
                </span>
              </div>

              {/* Main Image View */}
              <div className='relative w-full h-44 sm:h-52 mb-3 flex items-center justify-center rounded-xl bg-neutral-950/50 p-2 overflow-hidden group'>
                <Image
                  key={selectedTargetDevice.id}
                  src={selectedTargetDevice.image}
                  alt={selectedTargetDevice.name}
                  fill
                  sizes='(max-width: 768px) 100vw, 400px'
                  className='object-contain p-3 transition-transform duration-300 group-hover:scale-105'
                />
              </div>

              {/* Selected Target Device Details */}
              <div className='mb-3 text-left'>
                <div className='flex items-center gap-2 mb-0.5'>
                  <h4 className='font-black text-base sm:text-lg text-white leading-tight'>
                    {selectedTargetDevice.name}
                  </h4>
                  <span className='text-xs text-neutral-400 line-through'>
                    {formatPrice(selectedTargetDevice.fullPrice)}
                  </span>
                </div>
                <p className='text-xs text-neutral-400'>
                  {selectedTargetDevice.tagline}
                </p>
              </div>

              {/* THUMBNAIL / VARIANT SELECTOR (directly under the image) */}
              <div className='mt-auto pt-3 border-t border-white/10'>
                <span className='text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-2 text-left'>
                  Выберите желаемый IQOS ILUMA:
                </span>
                <div className='grid grid-cols-3 gap-2'>
                  {TARGET_DEVICES.map((target) => {
                    const isSelected = selectedTargetDevice.id === target.id;
                    const itemDiscount = estimatedDiscount;
                    const itemFinalPrice = Math.max(0, target.fullPrice - itemDiscount);

                    return (
                      <button
                        key={target.id}
                        type='button'
                        onClick={() => setSelectedTargetDevice(target)}
                        className={`p-2 rounded-xl border transition-all duration-150 flex items-center gap-2 ${
                          isSelected
                            ? 'border-white bg-white text-black font-bold shadow-md scale-105'
                            : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className='relative w-9 h-9 rounded-md bg-neutral-900 p-0.5 flex-shrink-0 overflow-hidden'>
                          <Image
                            src={target.image}
                            alt={target.name}
                            fill
                            sizes='36px'
                            className='object-contain'
                          />
                        </div>
                        <div className='text-left min-w-0'>
                          <div className='text-[11px] font-bold leading-tight truncate'>{target.name}</div>
                          <div className={`text-[9px] font-medium ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                            {formatPrice(itemFinalPrice)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* CALCULATION SUMMARY & CTA BAR */}
          <div className='pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='text-left space-y-0.5'>
              <div className='text-[11px] text-neutral-400 uppercase font-bold tracking-wider'>
                Итого к оплате при курьерском обмене:
              </div>
              <div className='text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2'>
                <span>{formatPrice(finalPrice)}</span>
                <span className='text-xs font-normal text-neutral-400 line-through'>
                  {formatPrice(selectedTargetDevice.fullPrice)}
                </span>
                <span className='text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20'>
                  Выгода {formatPrice(estimatedDiscount)} ₽
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              variant={ButtonVariant.LIGHT}
            >
              Оформить обмен
            </Button>
          </div>

        </div>
      </div>

      {/* Slide-Over Drawer Form */}
      <TradeInForm
        isOpen={isModalOpen}
        oldDeviceName={selectedOldDevice.name}
        targetDeviceName={selectedTargetDevice.name}
        estimatedDiscount={estimatedDiscount}
        finalPrice={finalPrice}
        onCancel={() => setIsModalOpen(false)}
      />
    </section>
  );
};
