'use client';

import { useState } from 'react';
import { ProductRow } from '@/types/supabase';
import { ProductCard } from './ProductCard';

type Props = {
  products: ProductRow[];
  itemsPerPage?: number;
};

export function ProductGrid({ products, itemsPerPage = 12 }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (products.length === 0) {
    return <div className='text-center py-10 text-neutral-500'>Товары не найдены</div>;
  }

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {paginatedItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center items-center mt-8 gap-2'>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className='px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-neutral-50 transition'
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border transition ${
                page === currentPage
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:bg-neutral-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className='px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-neutral-50 transition'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
