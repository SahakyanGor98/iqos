import { Metadata } from 'next';
import { getAllSlugs, getProductBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { Product } from '@/types/product';
import { formatPrice, formatDeviceTitle, fixCasing } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs('sticks');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Товар не найден',
    };
  }

  return {
    title: product.title,
    description: product.description || `Купить ${product.title} по выгодной цене.`,
    alternates: {
      canonical: `/products/terea/${slug}`,
    },
    openGraph: {
      title: product.title,
      description: product.description || `Купить ${product.title} по выгодной цене.`,
      images: Array.isArray(product.image) ? [product.image[0]] : [product.image],
    },
  };
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

  // Image Array logic
  const mainImages = Array.isArray(productRow.image) ? productRow.image : [productRow.image];
  // Add pack image to gallery if exists
  const allImages = attrs.imagePack ? [...mainImages, attrs.imagePack] : mainImages;

  // Map to Store Product Type
  const storeProduct: Product = {
    id: productRow.id,
    slug: productRow.slug,
    title: productRow.title,
    image: mainImages,
    price: productRow.price,
    category: productRow.category,
    brand: productRow.brand || undefined,
    line: attrs.line,
    color: attrs.color,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productRow.title,
    description: productRow.description,
    image: mainImages,
    brand: {
      '@type': 'Brand',
      name: 'TEREA',
    },
    offers: {
      '@type': 'Offer',
      price: productRow.price,
      priceCurrency: 'RUB',
      availability: productRow.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://24iqos.ru/products/terea/${productRow.slug}`,
    },
  };

  return (
    <div className='container-custom py-12'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16'>
        {/* Gallery */}
        <div className='relative'>
          {allImages.length > 1 ? (
            <ProductImageCarousel images={allImages} title={productRow.title} />
          ) : (
            <div className='relative bg-neutral-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center'>
              <img
                src={`/api/proxy?url=${encodeURIComponent(allImages[0])}`}
                alt={productRow.title}
                className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
                loading='lazy'
              />
            </div>
          )}
          <div className='absolute top-6 left-6 z-10 flex flex-col gap-2'>
            {badgeData.isNew && <span className='badge bg-green-600 px-3 py-1.5'>Новинка</span>}
            {badgeData.isHit && <span className='badge bg-orange-500 px-3 py-1.5'>Хит</span>}
          </div>
        </div>

        {/* Info Column */}
        <div className='flex flex-col justify-between space-y-8'>
          {/* Top Section */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-2xl md:text-4xl font-black tracking-tight text-[#34303d] mb-2'>
                {formatDeviceTitle(fixCasing(productRow.title, true))}
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
              <span className='text-4xl font-bold text-[#34303d]'>{formatPrice(productRow.price)}</span>
              <span className='text-sm font-medium text-neutral-500 mb-2'>/ блок (10 пачек)</span>
            </div>

            {productRow.description && (
              <div className='prose prose-neutral max-w-none text-neutral-600 leading-relaxed'>
                <p>{productRow.description}</p>
              </div>
            )}

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
          </div>

          {/* Bottom Section (Buy Button) */}
          <div className='pt-4'>
            <AddToCartButton product={storeProduct} disabled={!productRow.in_stock} />
          </div>
        </div>
      </div>
    </div>
  );
}
