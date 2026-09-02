'use client';

import { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';
import { ProductRow } from '@/types/supabase';
import { CategoryKey, useCompareStore } from '@/store/compareStore';
import { usePageFlags } from './FeatureFlagsProvider';

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

  const { compare: compareEnabled } = usePageFlags();
  const itemsByCategory = useCompareStore((state) => state.itemsByCategory);
  const addToCompare = useCompareStore((state) => state.addToCompare);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compare page disabled via CMS flag → render no compare affordance anywhere.
  if (!compareEnabled) return null;

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
          <Scale size={18} className={isSelected ? 'text-white' : 'text-neutral-600'} />
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
          <Scale size={15} />
        </button>
      )}
    </div>
  );
};
