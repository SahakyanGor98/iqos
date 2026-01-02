'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export const SortSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get('sort') || '';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='flex items-center gap-2 mb-4'>
      <span className='text-sm text-neutral-500'>Сортировка:</span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className='form-select text-sm border-gray-300 rounded focus:ring-black focus:border-black'
        disabled={isPending}
      >
        <option value=''>По умолчанию</option>
        <option value='price_asc'>Сначала дешевые</option>
        <option value='price_desc'>Сначала дорогие</option>
        <option value='newest'>Новинки</option>
      </select>
    </div>
  );
};
