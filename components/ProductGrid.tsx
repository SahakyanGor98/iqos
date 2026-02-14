'use client';

import { ProductRow } from '@/types/supabase';
import { ProductCard } from './ProductCard';

type Props = {
  products: ProductRow[];
};

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return <div className='text-center py-10 text-neutral-500'>Товары не найдены</div>;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
