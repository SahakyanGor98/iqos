import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getAdminProductById } from '@/lib/admin-products';
import { ProductForm } from '../ProductForm';
import { DeleteProductButton } from '../DeleteProductButton';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Товар #${id}`, robots: { index: false, follow: false } };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const product = await getAdminProductById(productId);
  if (!product) notFound();

  return (
    <div className='flex max-w-2xl flex-col gap-6'>
      <Link
        href='/admin/products'
        className='flex w-fit items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-[#34303d]'
      >
        <ArrowLeft className='h-4 w-4' /> К товарам
      </Link>
      <h2 className='text-xl font-black tracking-tight text-[#34303d]'>{product.title}</h2>
      <ProductForm mode='edit' product={product} />
      <DeleteProductButton id={product.id} title={product.title} />
    </div>
  );
}
