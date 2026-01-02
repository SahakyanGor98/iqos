'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type Props = {
  totalItems: number;
  itemsPerPage?: number;
};

export const Pagination = ({ totalItems, itemsPerPage = 12 }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex justify-center items-center mt-8 gap-2'>
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={`px-3 py-1 rounded border hover:bg-neutral-50 transition ${
          currentPage === 1 ? 'pointer-events-none opacity-50 bg-neutral-100' : 'bg-white'
        }`}
      >
        ←
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`px-3 py-1 rounded border transition ${
            page === currentPage
              ? 'bg-black text-white border-black'
              : 'bg-white hover:bg-neutral-50'
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={createPageURL(Math.min(totalPages, currentPage + 1))}
        className={`px-3 py-1 rounded border hover:bg-neutral-50 transition ${
          currentPage === totalPages ? 'pointer-events-none opacity-50 bg-neutral-100' : 'bg-white'
        }`}
      >
        →
      </Link>
    </div>
  );
};
