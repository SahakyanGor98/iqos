'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/app/actions/products-admin';

/**
 * Two-step guarded delete. First click asks for confirmation; confirming calls
 * the action, which hard-deletes unless the product is referenced by an order
 * (FK) — in which case the inline error explains why and suggests marking it out
 * of stock instead.
 */
export function DeleteProductButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteProduct(id);
      if ('error' in res) {
        setError(res.error);
        setConfirming(false);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    });
  };

  return (
    <div className='rounded-2xl border border-red-200 bg-red-50 p-5'>
      <h3 className='text-sm font-bold text-red-700'>Опасная зона</h3>
      <p className='mt-1 text-xs text-red-600'>Удаление товара необратимо.</p>
      {error ? <p className='mt-2 text-xs font-medium text-red-700'>{error}</p> : null}

      <div className='mt-3 flex flex-wrap items-center gap-2'>
        {confirming ? (
          <>
            <button
              type='button'
              onClick={handleDelete}
              disabled={isPending}
              className='rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60'
            >
              {isPending ? 'Удаление…' : `Да, удалить «${title}»`}
            </button>
            <button
              type='button'
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className='rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-gray-100'
            >
              Отмена
            </button>
          </>
        ) : (
          <button
            type='button'
            onClick={() => setConfirming(true)}
            className='flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100'
          >
            <Trash2 className='h-4 w-4' />
            Удалить товар
          </button>
        )}
      </div>
    </div>
  );
}
