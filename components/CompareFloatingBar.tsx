'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';
import { CategoryKey, useCompareStore } from '@/store/compareStore';

export const CompareFloatingBar = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const itemsByCategory = useCompareStore((state) => state.itemsByCategory);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const clearCategoryCompare = useCompareStore((state) => state.clearCategoryCompare);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname === '/compare') {
    return null;
  }

  // Determine current page category context
  let currentCategory: CategoryKey = 'gadget';
  if (pathname.includes('/products/terea')) {
    currentCategory = 'sticks';
  } else if (pathname.includes('/products/accessories')) {
    currentCategory = 'accessories';
  } else if (pathname.includes('/products/water')) {
    currentCategory = 'water';
  } else if (pathname.includes('/products/iqos')) {
    currentCategory = 'gadget';
  } else {
    const firstActive = (Object.keys(itemsByCategory) as CategoryKey[]).find(
      (key) => (itemsByCategory[key] || []).length > 0,
    );
    if (firstActive) {
      currentCategory = firstActive;
    }
  }

  const categoryItems = itemsByCategory[currentCategory] || [];

  if (categoryItems.length === 0) {
    return null;
  }

  const categoryLabelMap: Record<CategoryKey, string> = {
    gadget: 'Устройства IQOS',
    sticks: 'Стики TEREA',
    accessories: 'Аксессуары',
    water: 'Вода',
  };

  const categoryTitle = categoryLabelMap[currentCategory] || 'товара';

  return (
    <div className='fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-lg z-40 animate-in slide-in-from-bottom-6 duration-300'>
      <div className='bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-neutral-800 flex items-center justify-between gap-2 sm:gap-4'>
        {/* Left Info & Items */}
        <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden'>
          {/* Thumbnails */}
          <div className='flex items-center -space-x-2 sm:space-x-1.5 flex-shrink-0'>
            {categoryItems.map((product) => {
              const img = Array.isArray(product.image) ? product.image[0] : product.image;
              return (
                <div
                  key={product.id}
                  className='relative group flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center overflow-hidden'
                >
                  <Image
                    src={img}
                    alt={product.title}
                    fill
                    sizes='44px'
                    className='object-contain'
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromCompare(product.id, currentCategory);
                    }}
                    className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold rounded-xl'
                    title={`Убрать ${product.title}`}
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Label */}
          <div className='flex flex-col text-left min-w-0 flex-1'>
            <span className='text-xs font-semibold text-neutral-200 truncate'>
              Сравнение ({categoryItems.length})
            </span>
            <span className='text-[10px] sm:text-[11px] text-neutral-400 truncate hidden sm:block'>
              {categoryTitle}
            </span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className='flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0'>
          <button
            type='button'
            onClick={() => clearCategoryCompare(currentCategory)}
            className='text-xs font-medium text-neutral-400 hover:text-white px-1.5 sm:px-2.5 py-1.5 transition-colors cursor-pointer'
          >
            Очистить
          </button>

          <Link
            href={`/compare?category=${currentCategory}`}
            className='flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap'
          >
            <span>Сравнить</span>
            <ArrowRight className='w-3.5 h-3.5' strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};
