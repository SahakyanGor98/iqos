'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductRow } from '@/types/supabase';
import { useCartStore } from '@/store/cartStore';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Product } from '@/types/product';

type Props = {
  product: ProductRow;
};

// Helper to map DB row to Store Product
const mapToStoreProduct = (row: ProductRow): Product => {
  const attrs = row.attributes as Record<string, any>;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    image: row.image,
    price: row.price,
    category: row.category,
    brand: row.brand || undefined,
    line: attrs.line,
    color: attrs.color,
  };
};

export const ProductCard = ({ product }: Props) => {
  const badges = product.badges as { isNew?: boolean; isHit?: boolean; isExclusive?: boolean };
  const attributes = product.attributes as Record<string, any>;



  return (
    <Link
      href={`/products/${product.category === 'gadget' ? 'iqos' : 'terea'}/${product.slug}`}
      className='group block rounded-xl border border-neutral-200 bg-white p-4 transition hover:shadow-md h-full flex flex-col'
    >
      {/* Image */}
      <div className='relative aspect-square mb-4'>
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
          className='object-contain'
        />

        {/* Badges */}
        <div className='absolute top-2 left-2 flex flex-col gap-1'>
          {badges?.isNew && <span className='badge bg-green-600'>NEW</span>}
          {badges?.isHit && <span className='badge bg-orange-500'>HIT</span>}
          {badges?.isExclusive && <span className='badge bg-purple-600'>EXCLUSIVE</span>}
        </div>

        {!product.in_stock && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold'>
            Нет в наличии
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 flex flex-col'>
        <h3 className='text-sm font-medium leading-snug mb-1 line-clamp-2'>{product.title}</h3>

        {/* Attributes Display */}
        <div className='text-xs text-neutral-500 mb-2 mt-auto'>
          {product.category === 'gadget' && attributes.color && (
            <span>Цвет: {attributes.color}</span>
          )}
          {product.category === 'sticks' && attributes.flavors && (
            <span className='line-clamp-1'>
              {Array.isArray(attributes.flavors)
                ? attributes.flavors.join(', ')
                : attributes.flavors}
            </span>
          )}
          {product.category === 'sticks' && attributes.origin && (
            <div className='flex items-center gap-1.5 mt-1.5'>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                {(() => {
                  const origin = String(attributes.origin).toLowerCase();
                  const map: Record<string, string> = {
                    armenia: 'Армения',
                    kazakhstan: 'Казахстан',
                    russia: 'Россия',
                    japan: 'Япония',
                    italy: 'Италия',
                  };
                  return map[origin] || attributes.origin;
                })()}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className='flex items-center gap-2 mt-2'>
          {attributes.salePrice ? (
            <>
              <span className='text-lg font-bold text-red-600'>{product.price} ₽</span>
              <span className='text-sm text-neutral-400 line-through'>
                {attributes.salePrice} ₽
              </span>
            </>
          ) : (
            <span className='text-lg font-bold'>{product.price} ₽</span>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      {/* Add to Cart */}
      <div className='mt-4'>
        <AddToCartButton
          product={mapToStoreProduct(product)}
          disabled={!product.in_stock}
          className="text-sm py-2.5"
        />
      </div>
    </Link>
  );
};
