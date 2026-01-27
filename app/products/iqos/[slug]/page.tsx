import { getAllSlugs, getProductBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AddToCartButton } from '@/components';
import { Product } from '@/types/product';

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate all possible slugs for static generation
export async function generateStaticParams() {
  const slugs = await getAllSlugs('gadget');
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 60;

export default async function IqosSlugPage({ params }: Props) {
  const { slug } = await params;
  const productRow = await getProductBySlug(slug);

  if (!productRow) {
    notFound();
  }

  const { attributes, badges } = productRow;
  const attrs = attributes as Record<string, any>;
  const badgeData = badges as Record<string, boolean>;

  // Map to Store Product Type for the button
  const storeProduct: Product = {
    id: productRow.id,
    slug: productRow.slug,
    title: productRow.title,
    image: productRow.image,
    price: productRow.price,
    category: productRow.category,
    brand: productRow.brand || undefined,
    line: attrs.line,
    color: attrs.color,
  };

  return (
    <div className='container-custom py-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16'>
        {/* Gallery Section */}
        <div className='relative bg-neutral-50 rounded-3xl overflow-hidden aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center p-8'>
          <img
            src={`/api/proxy?url=${encodeURIComponent(productRow.image)}`}
            alt={productRow.title}
            className='w-full h-full object-contain transition-transform duration-500 hover:scale-105'
            loading='lazy'
          />
          {/* Badges Overlay */}
          <div className='absolute top-6 left-6 flex flex-col gap-2'>
            {badgeData.isNew && <span className='badge bg-green-600 px-3 py-1.5'>Новинка</span>}
            {badgeData.isHit && <span className='badge bg-orange-500 px-3 py-1.5'>Хит</span>}
            {badgeData.isExclusive && (
              <span className='badge bg-purple-600 px-3 py-1.5'>Эксклюзив</span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className='flex flex-col justify-center space-y-8'>
          <div>
            <h1 className='text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-900 mb-2'>
              {productRow.title}
            </h1>
            <p className='text-lg text-neutral-500 font-medium'>{attrs.line || 'IQOS Original'}</p>
          </div>

          <div className='flex items-end gap-4'>
            {attrs.salePrice ? (
              <>
                <span className='text-4xl font-bold text-red-600 line-clamp-1'>
                  {productRow.price} ₽
                </span>
                <span className='text-xl text-neutral-400 line-through mb-1'>
                  {attrs.salePrice} ₽
                </span>
              </>
            ) : (
              <span className='text-4xl font-bold text-neutral-900'>{productRow.price} ₽</span>
            )}
          </div>

          <div className='prose prose-neutral max-w-none text-neutral-600 leading-relaxed'>
            <p>{productRow.description}</p>
          </div>

          {/* Attributes Grid */}
          <div className='grid grid-cols-2 gap-4 py-6 border-y border-neutral-100'>
            {attrs.color && (
              <div>
                <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                  Цвет
                </span>
                <span className='font-semibold text-neutral-900'>{attrs.color}</span>
              </div>
            )}
            <div>
              <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                Категория
              </span>
              <span className='font-semibold text-neutral-900'>Устройство</span>
            </div>
            <div>
              <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                Бренд
              </span>
              <span className='font-semibold text-neutral-900'>IQOS</span>
            </div>
            <div>
              <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                Статус
              </span>
              {productRow.in_stock ? (
                <span className='font-semibold text-green-600'>В наличии</span>
              ) : (
                <span className='font-semibold text-red-600'>Нет в наличии</span>
              )}
            </div>
          </div>

          <div className='pt-4'>
            <AddToCartButton product={storeProduct} disabled={!productRow.in_stock} />
          </div>
        </div>
      </div>
    </div>
  );
}
