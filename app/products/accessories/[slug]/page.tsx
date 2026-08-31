import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllSlugs, getProductBySlug, getProducts } from '@/lib/api';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { Product } from '@/types/product';
import { fixCasing, formatDeviceTitle, formatPrice, getDeviceColorSwatch } from '@/lib/utils';
import { ENABLE_ACCESSORIES } from '@/lib/constants';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!ENABLE_ACCESSORIES) return [];
  const slugs = await getAllSlugs('accessories');
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
      canonical: `/products/accessories/${slug}`,
    },
    openGraph: {
      title: product.title,
      description: product.description || `Купить ${product.title} по выгодной цене.`,
      images: Array.isArray(product.image) ? [product.image[0]] : [product.image],
    },
  };
}

export const revalidate = 60;

export default async function AccessorySlugPage({ params }: Props) {
  if (!ENABLE_ACCESSORIES) notFound();
  const { slug } = await params;
  const productRow = await getProductBySlug(slug);

  if (!productRow) {
    notFound();
  }

  const { attributes, badges } = productRow;
  const attrs = attributes as Record<string, any>;
  const badgeData = badges as Record<string, boolean>;

  // Fetch sibling color variants for the same line
  let siblingVariants: (typeof productRow)[] = [];
  if (attrs.line) {
    const { data: accessories } = await getProducts({ category: 'accessories', limit: 100 });
    siblingVariants = accessories.filter(
      (p) => (p.attributes as Record<string, any>)?.line === attrs.line,
    );
  }

  // Image Array logic
  const productImages = Array.isArray(productRow.image) ? productRow.image : [productRow.image];

  // Map to Store Product Type for the button
  const storeProduct: Product = {
    id: productRow.id,
    slug: productRow.slug,
    title: productRow.title,
    image: productImages,
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
    image: productImages,
    brand: {
      '@type': 'Brand',
      name: productRow.brand || 'IQOS',
    },
    offers: {
      '@type': 'Offer',
      price: productRow.price,
      priceCurrency: 'RUB',
      availability: productRow.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://24iqos.ru/products/accessories/${productRow.slug}`,
    },
  };

  return (
    <div className='container-custom py-12'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16'>
        {/* Gallery Section */}
        <div className='relative'>
          {productImages.length > 1 ? (
            <ProductImageCarousel images={productImages} title={productRow.title} />
          ) : (
            <div className='relative bg-neutral-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8'>
              <Image
                src={productImages[0]}
                alt={productRow.title}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                priority
                className='object-contain transition-transform duration-500 hover:scale-105'
              />
            </div>
          )}
          {/* Badges Overlay */}
          <div className='absolute top-6 left-6 z-10 flex flex-col gap-2'>
            {badgeData?.isNew && <span className='badge bg-green-600 px-3 py-1.5'>Новинка</span>}
            {badgeData?.isHit && <span className='badge bg-orange-500 px-3 py-1.5'>Хит</span>}
            {badgeData?.isExclusive && (
              <span className='badge bg-purple-600 px-3 py-1.5'>Эксклюзив</span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className='flex flex-col justify-between space-y-8'>
          {/* Top Section */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-2xl md:text-4xl font-black tracking-tight text-[#34303d] mb-2'>
                {formatDeviceTitle(fixCasing(productRow.title, true))}
              </h1>
            </div>

            {siblingVariants.length > 1 && (
              <div className='col-span-2 pt-3 border-t border-neutral-100'>
                <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-2.5 font-medium'>
                  Варианты исполнений ({siblingVariants.length})
                </span>
                <div className='flex items-center gap-2 flex-wrap'>
                  {siblingVariants.map((variant) => {
                    const vAttrs = variant.attributes as Record<string, any>;
                    const isCurrent = variant.slug === productRow.slug;
                    const variantLabel = vAttrs.colorVariantName || vAttrs.color || variant.title;
                    const swatch = getDeviceColorSwatch(variantLabel, variant.title, vAttrs.hex);

                    return (
                      <Link
                        key={variant.id}
                        href={`/products/accessories/${variant.slug}`}
                        title={variantLabel}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 border ${
                          isCurrent
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm scale-105'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                        }`}
                      >
                        <span
                          className='w-3 h-3 rounded-full border border-black/10 shrink-0'
                          style={swatch}
                        />
                        <span>{variantLabel}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className='flex items-end gap-4'>
              <span className='text-4xl font-bold text-[#34303d]'>
                {formatPrice(productRow.price)}
              </span>
            </div>

            {productRow.description && (
              <div className='prose prose-neutral max-w-none text-neutral-600 leading-relaxed'>
                <p>{productRow.description}</p>
              </div>
            )}

            {/* Attributes Grid */}
            <div className='grid grid-cols-2 gap-4 py-6 border-y border-neutral-100'>
              {attrs?.color && (
                <div>
                  <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                    Цвет
                  </span>
                  <span className='font-semibold text-neutral-900'>{attrs.color}</span>
                </div>
              )}
              {attrs?.type && (
                <div>
                  <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                    Тип
                  </span>
                  <span className='font-semibold text-neutral-900'>{attrs.type}</span>
                </div>
              )}
              {attrs?.compatibility && (
                <div>
                  <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                    Совместимость
                  </span>
                  <span className='font-semibold text-neutral-900'>{attrs.compatibility}</span>
                </div>
              )}
              <div>
                <span className='block text-xs uppercase tracking-wider text-neutral-400 mb-1'>
                  Категория
                </span>
                <span className='font-semibold text-neutral-900'>Аксессуар</span>
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
