'use client';

import { useEffect, useState } from 'react';
import { ProductRow } from '@/types/supabase';
import { CategoryKey, useCompareStore } from '@/store/compareStore';

type Props = {
  product: ProductRow;
  className?: string;
  variant?: 'icon' | 'button' | 'badge';
  showLabel?: boolean;
};

export const CompareButton = ({
  product,
  className = '',
  variant = 'icon',
  showLabel = false,
}: Props) => {
  const [mounted, setMounted] = useState(false);

  const itemsByCategory = useCompareStore((state) => state.itemsByCategory);
  const addToCompare = useCompareStore((state) => state.addToCompare);

  useEffect(() => {
    setMounted(true);
  }, []);

  const category = (product.category as CategoryKey) || 'gadget';
  const categoryItems = mounted ? itemsByCategory[category] || [] : [];
  const isSelected = categoryItems.some((item) => String(item.id) === String(product.id));

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  if (!mounted) {
    if (variant === 'button') {
      return (
        <button
          disabled
          className={`px-4 py-2 rounded-xl border border-neutral-200 text-neutral-400 opacity-50 ${className}`}
        >
          Сравнить
        </button>
      );
    }
    return <div className={`w-8 h-8 rounded-full bg-neutral-100 animate-pulse ${className}`} />;
  }

  return (
    <div className='relative inline-block'>
      {variant === 'button' ? (
        <button
          type='button'
          onClick={handleToggle}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
            isSelected
              ? 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800'
              : 'border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-400'
          } ${className}`}
          title={isSelected ? 'Убрать из сравнения' : 'Добавить к сравнению'}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={isSelected ? 'text-white' : 'text-neutral-600'}
          >
            <path d='m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' />
            <path d='m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' />
            <path d='M7 21h10' />
            <path d='M12 3v18' />
            <path d='M3 7h18' />
          </svg>
          {showLabel && (isSelected ? 'В сравнении' : 'Сравнить')}
        </button>
      ) : (
        <button
          type='button'
          onClick={handleToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer ${
            isSelected
              ? 'bg-neutral-900 text-white shadow-md scale-105'
              : 'bg-white/80 text-neutral-600 border border-neutral-200 hover:bg-white hover:text-black hover:shadow-sm'
          } ${className}`}
          title={isSelected ? 'Убрать из сравнения' : 'Добавить к сравнению'}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' />
            <path d='m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z' />
            <path d='M7 21h10' />
            <path d='M12 3v18' />
            <path d='M3 7h18' />
          </svg>
        </button>
      )}
    </div>
  );
};
