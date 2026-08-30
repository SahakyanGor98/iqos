'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductRow } from '@/types/supabase';
import { AddToCartButton } from '@/components/AddToCartButton';
import { CompareButton } from '@/components/CompareButton';
import { Product } from '@/types/product';
import { fixCasing, formatDeviceTitle, formatPrice, getDeviceColorSwatch } from '@/lib/utils';

type Props = {
  product: ProductRow;
  variants?: ProductRow[];
};

// Helper to map DB row to Store Product
const mapToStoreProduct = (row: ProductRow): Product => {
  const attrs = row.attributes as Record<string, any>;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    image: Array.isArray(row.image) ? row.image : [row.image],
    price: row.price,
    category: row.category,
    brand: row.brand || undefined,
    line: attrs.line,
    color: attrs.color,
  };
};

export const ProductCard = ({ product, variants }: Props) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductRow>(product);

  useEffect(() => {
    setSelectedVariant(product);
  }, [product]);

  const activeProduct = selectedVariant || product;
  const badges = activeProduct.badges as {
    isNew?: boolean;
    isHit?: boolean;
    isExclusive?: boolean;
  };
  const attributes = activeProduct.attributes as Record<string, any>;

  const colorVariants =
    variants && variants.length > 0
      ? variants
      : product.category === 'gadget' || product.category === 'accessories'
        ? [product]
        : [];

  const mainImage = Array.isArray(activeProduct.image)
    ? activeProduct.image[0]
    : activeProduct.image;
  const getCategoryPath = (cat: string) => {
    if (cat === 'gadget') return 'iqos';
    if (cat === 'accessories') return 'accessories';
    if (cat === 'water') return 'water';
    return 'terea';
  };

  return (
    <Link
      href={`/products/${getCategoryPath(activeProduct.category)}/${activeProduct.slug}`}
      className='group rounded-xl border border-neutral-200 bg-white transition hover:shadow-md h-full flex flex-col overflow-hidden relative'
    >
      {/* Image */}
      <div className='relative aspect-square bg-neutral-50 overflow-hidden'>
        <img
          src={`/api/proxy?url=${encodeURIComponent(mainImage)}`}
          alt={activeProduct.title}
          className='w-full h-full object-cover transition-all duration-300 group-hover:scale-105'
          loading='lazy'
        />

        {/* Compare Button (Top Right) */}
        <div className='absolute top-2.5 right-2.5 z-20'>
          <CompareButton product={activeProduct} variant='icon' />
        </div>

        {/* Badges */}
        <div className='absolute top-2 left-2 flex flex-col gap-1 z-10'>
          {badges?.isNew && <span className='badge bg-green-600'>NEW</span>}
          {badges?.isHit && <span className='badge bg-orange-500'>HIT</span>}
          {badges?.isExclusive && <span className='badge bg-purple-600'>EXCLUSIVE</span>}
        </div>

        {!activeProduct.in_stock && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold z-10'>
            Нет в наличии
          </div>
        )}

        {/* Hidden Preloader for Instant Color Variant Switching */}
        {colorVariants.length > 1 && (
          <div className='hidden' aria-hidden='true'>
            {colorVariants.map((variant) => {
              const vImg = Array.isArray(variant.image) ? variant.image[0] : variant.image;
              return (
                <img key={variant.id} src={`/api/proxy?url=${encodeURIComponent(vImg)}`} alt='' />
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 flex flex-col p-4'>
        <h3 className='text-sm font-medium leading-snug mb-2 line-clamp-2'>
          {formatDeviceTitle(fixCasing(activeProduct.title, false))}
        </h3>

        {/* Color Swatches Controller for Gadgets & Accessories directly below main title */}
        {(activeProduct.category === 'gadget' || activeProduct.category === 'accessories') &&
          colorVariants.length > 1 && (
            <>
              {attributes.color && (
                <span className='text-[11px] text-neutral-500 font-medium block mb-3'>
                  Цвет: <span className='text-neutral-800 font-semibold'>{attributes.color}</span>
                </span>
              )}
              <div
                className='flex items-center gap-2 flex-wrap mb-1.5'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {colorVariants.map((variant) => {
                  const vAttrs = variant.attributes as Record<string, any>;
                  const colorLabel = vAttrs.color || variant.title;
                  const isSelected = variant.id === activeProduct.id;
                  const swatch = getDeviceColorSwatch(
                    vAttrs.colorVariantName || vAttrs.color,
                    variant.title,
                    vAttrs.hex,
                  );

                  return (
                    <button
                      key={variant.id}
                      type='button'
                      title={colorLabel}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariant(variant);
                      }}
                      className={`relative w-5 h-5 rounded-full transition-all duration-200 flex items-center justify-center focus:outline-none cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-neutral-900 ring-offset-2 scale-110 shadow-sm z-10'
                          : 'hover:scale-110 opacity-80 hover:opacity-100'
                      }`}
                      style={swatch}
                    />
                  );
                })}
              </div>
            </>
          )}

        {/* Attributes Display for Non-Gadgets */}
        <div className='text-xs text-neutral-500 mb-2 mt-auto'>
          {activeProduct.category === 'water' && (
            <span>{attributes.packaging || 'Упаковка 12 шт.'}</span>
          )}
          {activeProduct.category === 'sticks' && attributes.flavors && (
            <span className='line-clamp-1'>
              {Array.isArray(attributes.flavors)
                ? attributes.flavors.join(', ')
                : attributes.flavors}
            </span>
          )}
          {activeProduct.category === 'sticks' && attributes.origin && (
            <div className='flex items-center gap-1.5 mt-1.5'>
              <span className='text-[10px] uppercase tracking-wider text-neutral-400 font-medium'>
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
        <div className='flex items-center gap-2 mt-auto pt-1'>
          {attributes.salePrice ? (
            <>
              <span className='text-lg font-bold text-red-600'>
                {formatPrice(activeProduct.price)}
              </span>
              <span className='text-sm text-neutral-400 line-through'>
                {formatPrice(attributes.salePrice)}
              </span>
            </>
          ) : (
            <span className='text-lg font-bold'>{formatPrice(activeProduct.price)}</span>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      <div className='m-4 pt-0'>
        <AddToCartButton
          product={mapToStoreProduct(activeProduct)}
          disabled={!activeProduct.in_stock}
          className='text-sm py-2.5'
        />
      </div>
    </Link>
  );
};
