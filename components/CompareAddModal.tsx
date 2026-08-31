'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ProductRow } from '@/types/supabase';
import { fetchCompareCandidates } from '@/app/actions/products';
import { useCompareStore } from '@/store/compareStore';
import { fixCasing, formatPrice } from '@/lib/utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: 'gadget' | 'sticks' | 'water' | 'accessories';
};

export const CompareAddModal = ({ isOpen, onClose, category }: Props) => {
  const [availableProducts, setAvailableProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const itemsByCategory = useCompareStore((state) => state.itemsByCategory);
  const addToCompare = useCompareStore((state) => state.addToCompare);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchProducts() {
      setLoading(true);
      const products = await fetchCompareCandidates(category);
      setAvailableProducts(products);
      setLoading(false);
    }

    fetchProducts();
  }, [isOpen, category]);

  if (!isOpen) return null;

  const currentCategoryItems = itemsByCategory[category] || [];
  const currentIds = new Set(currentCategoryItems.map((i) => String(i.id)));
  const filteredProducts = availableProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 cursor-default'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50/50'>
          <div>
            <h3 className='text-lg font-bold text-neutral-900'>Добавить товар в список</h3>
            <p className='text-xs text-neutral-500 mt-0.5'>
              Выберите товар из категории{' '}
              {category === 'gadget' ? 'Устройства' : category === 'sticks' ? 'Стики' : 'Каталог'}
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors'
          >
            ✕
          </button>
        </div>

        {/* Search Field */}
        <div className='p-4 border-b border-neutral-100 bg-white'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Поиск товара...'
            className='w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-neutral-50/50'
          />
        </div>

        {/* Product List */}
        <div className='flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh]'>
          {loading ? (
            <div className='space-y-2.5'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/50 animate-pulse'
                >
                  <div className='flex items-center gap-3.5 flex-1'>
                    <div className='w-12 h-12 rounded-lg bg-neutral-200 flex-shrink-0' />
                    <div className='space-y-2 flex-1 max-w-[220px]'>
                      <div className='h-3.5 bg-neutral-200 rounded w-3/4' />
                      <div className='h-3 bg-neutral-200 rounded w-1/3' />
                    </div>
                  </div>
                  <div className='w-16 h-7 rounded-lg bg-neutral-200 flex-shrink-0' />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='py-12 text-center text-sm text-neutral-500'>Товары не найдены</div>
          ) : (
            filteredProducts.map((product) => {
              const isSelected = currentIds.has(String(product.id));
              const img = Array.isArray(product.image) ? product.image[0] : product.image;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    addToCompare(product);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-50/80 shadow-xs'
                      : 'border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 group'
                  }`}
                >
                  <div className='flex items-center gap-3.5'>
                    <div className='relative w-12 h-12 rounded-lg bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-neutral-200/50'>
                      <Image
                        src={img}
                        alt={product.title}
                        fill
                        sizes='48px'
                        className='object-contain group-hover:scale-105 transition-transform'
                      />
                    </div>
                    <div>
                      <h4 className='text-sm font-semibold text-neutral-900 leading-snug line-clamp-1'>
                        {fixCasing(product.title, false)}
                      </h4>
                      <span className='text-xs font-medium text-neutral-500 block mt-0.5'>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <button
                      type='button'
                      className='px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer'
                    >
                      В списке
                    </button>
                  ) : (
                    <button
                      type='button'
                      className='px-3 py-1.5 border border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-100 rounded-lg text-xs font-semibold transition cursor-pointer'
                    >
                      Добавить
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Apply Button */}
        <div className='p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between gap-3'>
          <div className='text-xs text-neutral-500 font-medium'>
            Выбрано в списке:{' '}
            <span className='font-bold text-neutral-900'>{currentCategoryItems.length}</span>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer'
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};
