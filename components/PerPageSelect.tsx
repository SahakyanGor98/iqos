'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export const PerPageSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLimit = searchParams.get('limit') || '12';

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    params.set('limit', value);
    params.set('page', '1'); // Reset to first page when limit changes

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-neutral-500'>Показывать по:</span>
      <select
        value={currentLimit}
        onChange={handleLimitChange}
        className='form-select p-0.5 border-2 border-gray-700 text-sm rounded focus:ring-black focus:border-black'
        disabled={isPending}
      >
        <option value='12'>12</option>
        <option value='24'>24</option>
        <option value='48'>48</option>
      </select>
    </div>
  );
};
