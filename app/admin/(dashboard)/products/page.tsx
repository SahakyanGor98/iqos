import type { Metadata } from 'next';
import { Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Товары',
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return (
    <div className='mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-neutral-400'>
        <Package className='h-6 w-6' />
      </div>
      <h2 className='text-lg font-bold text-[#34303d]'>Товары</h2>
      <p className='mt-1 text-sm text-neutral-500'>Раздел в разработке.</p>
    </div>
  );
}
