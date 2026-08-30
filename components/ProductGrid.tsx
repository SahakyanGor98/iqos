'use client';

import { ProductRow } from '@/types/supabase';
import { getGroupedCards, GroupedCard } from '@/lib/grouping';
import { ProductCard } from './ProductCard';

type Props = {
  products?: ProductRow[];
  cards?: GroupedCard[];
};

export function ProductGrid({ products, cards }: Props) {
  const cardsToRender = cards || (products ? getGroupedCards(products) : []);

  if (cardsToRender.length === 0) {
    return <div className='text-center py-10 text-neutral-500'>Товары не найдены</div>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {cardsToRender.map(({ primary, variants }) => (
        <ProductCard key={primary.id} product={primary} variants={variants} />
      ))}
    </div>
  );
}
