'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, Scale, Share, Trash2, X } from 'lucide-react';
import { CategoryKey, useCompareStore } from '@/store/compareStore';
import { computeComparisonMatrix } from '@/lib/comparisonSpecs';
import { AddToCartButton } from '@/components';
import { ProductRow } from '@/types/supabase';
import { Product } from '@/types/product';
import { fixCasing, formatDeviceTitle, formatPrice } from '@/lib/utils';
import { fetchCompareProductsBySlugs } from '@/app/actions/products';

// Click-triggered modal — loaded only when the user opens it (see .ai/seo-perf.md §2).
const CompareAddModal = dynamic(
  () => import('@/components/CompareAddModal').then((m) => m.CompareAddModal),
  { ssr: false },
);

type CompareContentProps = {
  // Passed down from the Server Component parent (app/compare/page.tsx) so
  // share-link hydration works without a client-side useSearchParams subscription.
  initialCategory?: string;
  initialSlugs?: string;
};

// Helper to map DB row to Store Product
const mapToStoreProduct = (row: ProductRow): Product => {
  const attrs = (row.attributes as Record<string, unknown>) || {};
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    image: Array.isArray(row.image) ? row.image : [row.image],
    price: row.price,
    category: row.category,
    brand: row.brand || undefined,
    line: attrs.line as string | undefined,
    color: attrs.color as string | undefined,
  };
};

export function CompareContent({ initialCategory, initialSlugs }: CompareContentProps) {
  const [mounted, setMounted] = useState(false);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [focusedSlotPos, setFocusedSlotPos] = useState<number>(0);

  const itemsByCategory = useCompareStore((state) => state.itemsByCategory);
  const slotIndices = useCompareStore((state) => state.slotIndices);
  const isThirdSlotOpen = useCompareStore((state) => state.isThirdSlotOpen);

  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const clearCategoryCompare = useCompareStore((state) => state.clearCategoryCompare);
  const addMultipleToCompare = useCompareStore((state) => state.addMultipleToCompare);
  const cycleSlotIndex = useCompareStore((state) => state.cycleSlotIndex);
  const setThirdSlotOpen = useCompareStore((state) => state.setThirdSlotOpen);

  // Category is derived from the URL (passed down by the server parent) at first
  // render — not set in an effect (see .ai/state.md §2). `handleTabChange` updates
  // it thereafter.
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>(() =>
    initialCategory && ['gadget', 'sticks', 'water', 'accessories'].includes(initialCategory)
      ? (initialCategory as CategoryKey)
      : 'gadget',
  );

  // Run once on mount: set the hydration gate for the persisted store and, if
  // this is a shared link, hydrate the compare pool from the `slugs` param.
  useEffect(() => {
    setMounted(true);

    if (initialSlugs) {
      const slugs = initialSlugs.split(',').filter(Boolean);
      if (slugs.length > 0) {
        fetchCompareProductsBySlugs(slugs).then((fetchedProducts) => {
          if (fetchedProducts && fetchedProducts.length > 0) {
            addMultipleToCompare(fetchedProducts);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only share-link hydration
  }, []);

  // Active category pool
  const pool = itemsByCategory[selectedCategory] || [];
  const currentCategorySlotIndices = slotIndices[selectedCategory] || [0, 1, 2];

  // Resolve active products for slots (Desktop: 2 or 3 slots; Mobile: strictly 2 slots)
  const desktopVisibleSlotsCount = isThirdSlotOpen ? 3 : 2;

  // Global Keyboard Listener for Desktop Navigation (ArrowLeft, ArrowRight, Tab)
  useEffect(() => {
    if (!mounted || pool.length === 0 || isAddModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keydowns when typing inside input fields
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        cycleSlotIndex(
          selectedCategory,
          (focusedSlotPos % desktopVisibleSlotsCount) as 0 | 1 | 2,
          'prev',
        );
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        cycleSlotIndex(
          selectedCategory,
          (focusedSlotPos % desktopVisibleSlotsCount) as 0 | 1 | 2,
          'next',
        );
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setFocusedSlotPos((prev) => (prev + 1) % desktopVisibleSlotsCount);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mounted,
    pool.length,
    selectedCategory,
    focusedSlotPos,
    desktopVisibleSlotsCount,
    isAddModalOpen,
    cycleSlotIndex,
  ]);

  if (!mounted) {
    return (
      <div className='container-custom py-16 text-center animate-pulse'>
        <div className='w-48 h-8 bg-neutral-200 rounded-xl mx-auto mb-4' />
        <div className='w-96 h-4 bg-neutral-100 rounded-xl mx-auto' />
      </div>
    );
  }

  // Resolve active items for desktop slots
  const desktopActiveProducts: ProductRow[] = [];
  for (let slotPos = 0; slotPos < desktopVisibleSlotsCount; slotPos++) {
    if (pool.length > 0) {
      const rawIndex = currentCategorySlotIndices[slotPos] ?? slotPos;
      const validIndex = ((rawIndex % pool.length) + pool.length) % pool.length;
      desktopActiveProducts.push(pool[validIndex]);
    }
  }

  // Resolve active items for mobile slots (strictly 2)
  const mobileActiveProducts: ProductRow[] = [];
  for (let slotPos = 0; slotPos < 2; slotPos++) {
    if (pool.length > 0) {
      const rawIndex = currentCategorySlotIndices[slotPos] ?? slotPos;
      const validIndex = ((rawIndex % pool.length) + pool.length) % pool.length;
      mobileActiveProducts.push(pool[validIndex]);
    }
  }

  const desktopSpecGroups = computeComparisonMatrix(desktopActiveProducts, selectedCategory);
  const mobileSpecGroups = computeComparisonMatrix(mobileActiveProducts, selectedCategory);

  const handleShareLink = () => {
    if (pool.length === 0) return;
    const slugs = pool.map((p) => p.slug).join(',');
    const shareUrl = `${window.location.origin}/compare?category=${selectedCategory}&slugs=${slugs}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleTabChange = (cat: CategoryKey) => {
    setSelectedCategory(cat);
  };

  return (
    <div className='container-custom py-8 md:py-12'>
      {/* Top Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
        <div>
          <h1 className='text-3xl md:text-4xl font-black text-neutral-900 tracking-tight'>
            Сравнение моделей
          </h1>
          <p className='text-sm text-neutral-500 mt-1'>
            Сравнивайте характеристики, технологические особенности и цены выбранных товаров.
          </p>
        </div>

        {/* Action Controls */}
        {pool.length > 0 && (
          <div className='flex items-center gap-3 flex-wrap'>
            {/* Show Differences Toggle */}
            <label className='flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 cursor-pointer transition select-none text-xs font-semibold text-neutral-800 shadow-sm'>
              <input
                type='checkbox'
                checked={showDifferencesOnly}
                onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                className='w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 accent-neutral-900 cursor-pointer'
              />
              <span>Только различия</span>
            </label>

            {/* Add More to Pool Button */}
            <button
              type='button'
              onClick={() => setIsAddModalOpen(true)}
              className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition shadow-sm cursor-pointer'
            >
              <Plus className='w-4 h-4' />
              <span>Добавить в список</span>
            </button>

            {/* Share Link */}
            <button
              type='button'
              onClick={handleShareLink}
              className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition shadow-sm cursor-pointer'
            >
              <Share className='w-3.5 h-3.5' strokeWidth={2} />
              <span>{copiedLink ? 'Ссылка скопирована!' : 'Поделиться'}</span>
            </button>

            {/* Clear Pool Button for current category */}
            <button
              type='button'
              onClick={() => clearCategoryCompare(selectedCategory)}
              className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-red-50 hover:border-red-200 text-xs font-semibold text-red-600 transition shadow-sm cursor-pointer'
            >
              <Trash2 className='w-3.5 h-3.5' strokeWidth={2} />
              <span>Очистить</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Switcher Tabs */}
      <div className='flex items-center gap-2 border-b border-neutral-200 pb-3 mb-8 overflow-x-auto scrollbar-none'>
        {[
          { id: 'gadget', label: 'Устройства IQOS' },
          { id: 'sticks', label: 'Стики TEREA' },
        ].map((tab) => {
          const count = (itemsByCategory[tab.id as CategoryKey] || []).length;
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as CategoryKey)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Keyboard Hint Banner for Desktop */}
      {pool.length > 0 && (
        <div className='hidden md:flex items-center justify-between px-4 py-2 bg-neutral-100/70 border border-neutral-200/80 rounded-xl mb-6 text-xs text-neutral-500'>
          <div className='flex items-center gap-2'>
            <span className='font-bold text-neutral-700'>💡 Навигация с клавиатуры:</span>
            <span>
              Кликните на колонку, затем используйте стрелки{' '}
              <kbd className='px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-[11px] font-mono shadow-xs text-neutral-800'>
                ←
              </kbd>{' '}
              <kbd className='px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-[11px] font-mono shadow-xs text-neutral-800'>
                →
              </kbd>{' '}
              для прокрутки товаров или{' '}
              <kbd className='px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-[11px] font-mono shadow-xs text-neutral-800'>
                Tab
              </kbd>{' '}
              для переключения колонок.
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {pool.length === 0 ? (
        /** Empty State */
        <div className='bg-neutral-50 rounded-3xl p-12 md:p-16 text-center border border-neutral-200/80 max-w-2xl mx-auto my-8'>
          <div className='w-16 h-16 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-5 shadow-sm text-neutral-400'>
            <Scale className='w-8 h-8' strokeWidth={1.5} />
          </div>
          <h2 className='text-xl md:text-2xl font-bold text-neutral-900 text-center mb-2'>
            Список сравнения пуст
          </h2>
          <p className='text-sm text-neutral-500 max-w-md mx-auto mb-8 leading-relaxed text-center'>
            Добавляйте товары нажатием на иконку весов в каталоге или нажмите кнопку ниже, чтобы
            выбрать товары для сравнения.
          </p>

          <div className='flex items-center justify-center gap-4 flex-wrap'>
            <button
              type='button'
              onClick={() => setIsAddModalOpen(true)}
              className='inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition shadow-sm cursor-pointer'
            >
              <Plus className='w-4 h-4' />
              Выбрать товары для сравнения
            </button>
            <Link
              href={selectedCategory === 'gadget' ? '/products/iqos' : '/products/terea'}
              className='px-6 py-3 border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl text-xs font-bold transition cursor-pointer'
            >
              Перейти в каталог
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (Strictly 2 Columns) */}
          <div className='block md:hidden space-y-6'>
            {/* Mobile Product Cards Header Container */}
            <div className='bg-white py-3 border-b border-neutral-200'>
              <div className='grid gap-2.5 grid-cols-2'>
                {mobileActiveProducts.map((product, slotPos) => {
                  const rawIndex = currentCategorySlotIndices[slotPos] ?? slotPos;
                  const validIndex = ((rawIndex % pool.length) + pool.length) % pool.length;
                  const img = Array.isArray(product.image) ? product.image[0] : product.image;
                  const storeProd = mapToStoreProduct(product);

                  return (
                    <div key={`m-col-${slotPos}`} className='flex flex-col gap-1.5'>
                      {/* Product Card Container */}
                      <div className='relative bg-white border border-neutral-200 rounded-xl p-2.5 flex flex-col justify-between shadow-sm text-center flex-1'>
                        {/* Remove item from pool button */}
                        <button
                          type='button'
                          onClick={() => removeFromCompare(product.id, selectedCategory)}
                          className='absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-neutral-100 hover:bg-red-100 hover:text-red-600 text-neutral-500 flex items-center justify-center text-[10px] font-bold z-10 transition'
                          title='Удалить из списка сравнения'
                        >
                          <X className='w-3 h-3' />
                        </button>

                        <div>
                          {/* Image */}
                          <div className='relative aspect-square w-full bg-neutral-50 rounded-xl p-2 mb-2 flex items-center justify-center overflow-hidden'>
                            <Image
                              src={img}
                              alt={product.title}
                              fill
                              sizes='(max-width: 768px) 45vw, 200px'
                              className='object-contain'
                            />
                          </div>

                          <h4 className='text-[11px] font-bold text-neutral-900 text-center line-clamp-2 leading-tight mb-1'>
                            {fixCasing(product.title, false)}
                          </h4>
                        </div>

                        <div>
                          <div className='text-xs font-black text-neutral-900 text-center mb-1.5'>
                            {formatPrice(product.price)}
                          </div>

                          <AddToCartButton
                            product={storeProd}
                            disabled={!product.in_stock}
                            className='text-[10px] py-1 px-1.5'
                          />
                        </div>
                      </div>

                      {/* Carousel Controls Bar OUTSIDE & UNDER Item Card */}
                      <div className='flex items-center justify-center gap-2 py-1 select-none'>
                        <button
                          type='button'
                          onClick={() => cycleSlotIndex(selectedCategory, slotPos as 0 | 1, 'prev')}
                          className='w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black active:scale-90 transition-transform cursor-pointer'
                          title='Предыдущий товар'
                        >
                          <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>

                        <span className='text-xs font-black text-neutral-900 tracking-wide text-center min-w-[32px]'>
                          {validIndex + 1} / {pool.length}
                        </span>

                        <button
                          type='button'
                          onClick={() => cycleSlotIndex(selectedCategory, slotPos as 0 | 1, 'next')}
                          className='w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black active:scale-90 transition-transform cursor-pointer'
                          title='Следующий товар'
                        >
                          <ChevronRight size={20} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Data Rows / Fields Section (Strictly 2 Columns) */}
            <div className='divide-y divide-neutral-200 pt-2'>
              {mobileSpecGroups.map((group, groupIdx) => {
                const visibleRows = showDifferencesOnly
                  ? group.rows.filter((row) => row.hasDifference)
                  : group.rows;

                if (visibleRows.length === 0) return null;

                return (
                  <div key={`m-group-${groupIdx}`} className='py-4 space-y-3 text-center'>
                    <h3 className='text-xs font-black text-neutral-900 text-center uppercase tracking-wider px-3 py-1 bg-neutral-100 rounded-lg inline-block mx-auto'>
                      {group.groupName}
                    </h3>

                    <div className='space-y-3.5'>
                      {visibleRows.map((row, rowIdx) => (
                        <div key={`m-row-${rowIdx}`} className='pt-2 pb-2 transition text-center'>
                          <div className='flex items-center justify-center gap-1.5 text-xs font-extrabold text-neutral-900 text-center mb-1.5'>
                            <span>{row.label}</span>
                            {row.hasDifference && (
                              <span
                                className='w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0'
                                title='Различаются'
                              />
                            )}
                          </div>

                          <div className='grid grid-cols-2 gap-2.5 text-xs'>
                            {mobileActiveProducts.map((prod, slotIdx) => {
                              const val = row.values[prod.id];
                              return (
                                <div key={`m-val-${slotIdx}`} className='text-center'>
                                  <span className='text-xs leading-snug block text-center font-medium text-neutral-900'>
                                    {val !== undefined && val !== null ? String(val) : '—'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP VIEW (2 Columns by default, 3 Columns when expanded) */}
          <div className='hidden md:block overflow-x-auto pb-8 scrollbar-thin'>
            <div className='min-w-[700px]'>
              {/* Selected Products Cards Header Container */}
              <div className='bg-white pt-2 pb-3 border-b border-neutral-200'>
                {/* Header Cards Grid */}
                <div className={`grid gap-4 ${isThirdSlotOpen ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {/* Column 1: Header Title */}
                  <div className='flex flex-col justify-center p-3 text-center'>
                    <span className='text-xs font-bold uppercase tracking-wider text-neutral-400 text-center block'>
                      Сравниваемые модели ({pool.length} в списке)
                    </span>
                  </div>

                  {/* Selected Slots */}
                  {desktopActiveProducts.map((product, slotPos) => {
                    const rawIndex = currentCategorySlotIndices[slotPos] ?? slotPos;
                    const validIndex = ((rawIndex % pool.length) + pool.length) % pool.length;
                    const img = Array.isArray(product.image) ? product.image[0] : product.image;
                    const storeProd = mapToStoreProduct(product);
                    const isThirdSlotCard = slotPos === 2;
                    const isFocused = focusedSlotPos === slotPos;

                    return (
                      <div
                        key={`d-col-${slotPos}`}
                        onClick={() => setFocusedSlotPos(slotPos)}
                        className='flex flex-col gap-2 cursor-pointer'
                      >
                        {/* Product Card Container with Subtle Focus Outline */}
                        <div
                          className={`relative bg-white border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition text-center flex-1 ${
                            isFocused ? 'border-neutral-400 shadow-md' : 'border-neutral-200'
                          }`}
                        >
                          {/* Remove actions */}
                          <div className='absolute top-3 right-3 flex items-center gap-1.5 z-10'>
                            {/* Remove item from pool */}
                            <button
                              type='button'
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCompare(product.id, selectedCategory);
                              }}
                              className='w-7 h-7 rounded-full bg-neutral-100 hover:bg-red-100 hover:text-red-600 text-neutral-500 flex items-center justify-center text-xs font-bold transition cursor-pointer'
                              title='Удалить товар из списка сравнения'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>

                            {/* Desktop 3rd slot container close button */}
                            {isThirdSlotCard && (
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setThirdSlotOpen(false);
                                  if (focusedSlotPos === 2) setFocusedSlotPos(0);
                                }}
                                className='w-7 h-7 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center text-xs font-bold transition shadow-sm cursor-pointer'
                                title='Закрыть 3-ю колонку'
                              >
                                <X className='w-4 h-4' />
                              </button>
                            )}
                          </div>

                          <div>
                            {/* Product Image */}
                            <div className='relative aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-3 p-2 flex items-center justify-center mx-auto'>
                              <Image
                                src={img}
                                alt={product.title}
                                fill
                                sizes='(max-width: 768px) 45vw, 250px'
                                className='object-contain'
                              />
                            </div>

                            <Link
                              href={`/products/${selectedCategory === 'gadget' ? 'iqos' : 'terea'}/${product.slug}`}
                              className='text-xs md:text-sm font-bold text-neutral-900 text-center hover:text-neutral-600 line-clamp-2 leading-snug mb-2 block'
                            >
                              {formatDeviceTitle(fixCasing(product.title, false))}
                            </Link>
                          </div>

                          <div className='pt-2 border-t border-neutral-100 mt-2 space-y-2 text-center'>
                            <div className='text-base font-extrabold text-neutral-900 text-center'>
                              {formatPrice(product.price)}
                            </div>
                            <AddToCartButton
                              product={storeProd}
                              disabled={!product.in_stock}
                              className='text-xs py-2'
                            />
                          </div>
                        </div>

                        {/* Carousel Controls Bar OUTSIDE & UNDER Item Card */}
                        <div className='flex items-center justify-center gap-2 py-1 select-none'>
                          <button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusedSlotPos(slotPos);
                              cycleSlotIndex(selectedCategory, slotPos as 0 | 1 | 2, 'prev');
                            }}
                            className='w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-black active:scale-90 transition-transform cursor-pointer'
                            title='Предыдущий товар'
                          >
                            <ChevronLeft size={22} strokeWidth={2.5} />
                          </button>

                          <span
                            className={`text-xs md:text-sm font-black tracking-wider text-center min-w-[40px] ${isFocused ? 'text-neutral-900 scale-105 transition-transform' : 'text-neutral-600'}`}
                          >
                            {validIndex + 1} / {pool.length}
                          </span>

                          <button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusedSlotPos(slotPos);
                              cycleSlotIndex(selectedCategory, slotPos as 0 | 1 | 2, 'next');
                            }}
                            className='w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-black active:scale-90 transition-transform cursor-pointer'
                            title='Следующий товар'
                          >
                            <ChevronRight size={22} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Add 3rd Model Button Row (Compact with pr-4 right alignment under Product 2) */}
                {!isThirdSlotOpen && (
                  <div className='grid grid-cols-3 gap-4 pt-2.5'>
                    <div className='col-span-2' /> {/* Column 1 & Product 1 column empty */}
                    <div className='flex justify-end pr-4'>
                      <button
                        type='button'
                        onClick={() => setThirdSlotOpen(true)}
                        className='py-2 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold transition shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer'
                        title='Добавить 3-ю модель для сравнения'
                      >
                        <span className='w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs font-black'>
                          <Plus className='w-3 h-3' />
                        </span>
                        <span>Добавить 3-ю модель</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Data Rows / Fields Section */}
              <div className='mt-6 space-y-8'>
                {desktopSpecGroups.map((group, groupIdx) => {
                  const visibleRows = showDifferencesOnly
                    ? group.rows.filter((row) => row.hasDifference)
                    : group.rows;

                  if (visibleRows.length === 0) return null;

                  return (
                    <div key={groupIdx} className='space-y-2'>
                      {/* Section Group Sub-Title centered over product value columns */}
                      <div
                        className={`grid items-center mb-1.5 ${
                          isThirdSlotOpen ? 'grid-cols-4' : 'grid-cols-3'
                        }`}
                      >
                        <div className='col-span-1' />
                        <div
                          className={`text-center ${isThirdSlotOpen ? 'col-span-3' : 'col-span-2'}`}
                        >
                          <h3 className='text-xs font-extrabold text-neutral-900 uppercase tracking-wider px-3 py-1 bg-neutral-100/80 rounded-lg inline-block text-center'>
                            {group.groupName}
                          </h3>
                        </div>
                      </div>

                      <div className='border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm divide-y divide-neutral-100'>
                        {visibleRows.map((row, rowIdx) => (
                          <div
                            key={rowIdx}
                            className={`grid items-center p-3.5 text-xs transition ${
                              isThirdSlotOpen ? 'grid-cols-4' : 'grid-cols-3'
                            } hover:bg-neutral-50/60`}
                          >
                            {/* Parameter Name Column */}
                            <div className='font-semibold text-neutral-600 pr-4 flex items-center gap-1.5'>
                              <span>{row.label}</span>
                              {row.hasDifference && (
                                <span
                                  className='w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0'
                                  title='Характеристики различаются'
                                />
                              )}
                            </div>

                            {/* Active Product Value Columns */}
                            {desktopActiveProducts.map((product, slotIdx) => {
                              const val = row.values[product.id];
                              const isFocused = focusedSlotPos === slotIdx;
                              return (
                                <div
                                  key={`d-val-${slotIdx}-${product.id}`}
                                  onClick={() => setFocusedSlotPos(slotIdx)}
                                  className={`font-medium text-neutral-900 text-center px-2 cursor-pointer ${
                                    isFocused ? 'bg-neutral-100/40 rounded-lg py-1' : ''
                                  }`}
                                >
                                  {val !== undefined && val !== null ? String(val) : '—'}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Product Modal */}
      <CompareAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
