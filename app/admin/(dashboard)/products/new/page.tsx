import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '../ProductForm';

export const metadata: Metadata = {
  title: 'Новый товар',
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <div className='flex max-w-2xl flex-col gap-6'>
      <Link
        href='/admin/products'
        className='flex w-fit items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-[#34303d]'
      >
        <ArrowLeft className='h-4 w-4' /> К товарам
      </Link>
      <h2 className='text-xl font-black tracking-tight text-[#34303d]'>Новый товар</h2>
      <ProductForm mode='create' />
    </div>
  );
}
