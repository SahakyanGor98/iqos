import { getAllSlugs, getProductBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AddToCartButton } from '@/components';
import { Product } from '@/types/product';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs('sticks');
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 60;

export default async function TereaSlugPage({ params }: Props) {
  const { slug } = await params;
  const productRow = await getProductBySlug(slug);

  if (!productRow) {
    notFound();
  }

  const { attributes, badges } = productRow;
  const attrs = attributes as Record<string, any>;
  const badgeData = badges as Record<string, boolean>;

  // Map to Store Product Type
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
        {/* Gallery */}
        <div className='flex flex-col gap-4'>
          <div className='relative bg-neutral-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8'>
            <img
              src={`/api/proxy?url=${encodeURIComponent(productRow.image)}`}
              alt={productRow.title}
              className='w-full h-full object-contain transition-transform duration-500 hover:scale-105'
              loading='lazy'
            />
            <div className='absolute top-6 left-6 flex flex-col gap-2'>
              {badgeData.isNew && <span className='badge bg-green-600 px-3 py-1.5'>Новинка</span>}
              {badgeData.isHit && <span className='badge bg-orange-500 px-3 py-1.5'>Хит</span>}
            </div>
          </div>
          {/* Pack Image Preview if exists */}
          {attrs.imagePack && (
            <div className='relative bg-neutral-50 rounded-xl overflow-hidden aspect-[4/3] p-4 flex items-center justify-center'>
              <img
                src={`/api/proxy?url=${encodeURIComponent(attrs.imagePack)}`}
                alt={`${productRow.title} pack`}
                className='w-full h-full object-contain'
                loading='lazy'
              />
              <span className='absolute bottom-2 right-2 text-[10px] text-neutral-400 uppercase font-bold tracking-wider'>
                Вид пачки
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className='flex flex-col justify-center space-y-8'>
          <div>
            <h1 className='text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-900 mb-2'>
              {productRow.title}
            </h1>
            <div className='flex flex-wrap gap-2'>
              {Array.isArray(attrs.flavors) &&
                attrs.flavors.map((flavor: string) => (
                  <span
                    key={flavor}
                    className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700'
                  >
                    {flavor}
                  </span>
                ))}
            </div>
          </div>

          <div className='flex items-end gap-2'>
            <span className='text-4xl font-bold text-neutral-900'>{productRow.price} ₽</span>
            <span className='text-sm font-medium text-neutral-500 mb-2'>/ блок (10 пачек)</span>
          </div>

          <div className='prose prose-neutral max-w-none text-neutral-600 leading-relaxed'>
            <p>{productRow.description}</p>
          </div>

          {/* Attributes Grid */}
          <div className='grid grid-cols-2 gap-4 py-6 border-y border-neutral-100'>
            <div>
              <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                Крепость
              </span>
              <span className='font-semibold text-neutral-900 capitalize'>
                {attrs.strength || 'Средняя'}
              </span>
            </div>
            <div>
              <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                Формат
              </span>
              <span className='font-semibold text-neutral-900'>Стики Smartcore</span>
            </div>
            <div>
              <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                Капсула
              </span>
              <span
                className={`font-semibold ${attrs.hasCapsule ? 'text-blue-600' : 'text-neutral-900'}`}
              >
                {attrs.hasCapsule ? 'Есть' : 'Нет'}
              </span>
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
