'use client';

import { ProductRow } from '@/types/supabase';
import { ProductCard } from './ProductCard';

type Props = {
  products: ProductRow[];
};

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return <div className='text-center py-10 text-neutral-500'>Товары не найдены</div>;
  }

  const isGadgets = products.some((p) => p.category === 'gadget');

  let cardsToRender: Array<{ primary: ProductRow; variants?: ProductRow[] }> = [];

  if (isGadgets) {
    const groupsMap = new Map<string, ProductRow[]>();

    products.forEach((product) => {
      const attrs = (product.attributes as Record<string, any>) || {};
      const lineKey = attrs.line
        ? String(attrs.line).toLowerCase().trim()
        : product.title
            .split('-')[0]
            .replace(/Pink|Green|Gray|Blue|Beige|Black|Violet|Red|Terracotta|Leaf|Breeze|Digital|Midnight|Aspen|Garnet/gi, '')
            .trim();

      if (!groupsMap.has(lineKey)) {
        groupsMap.set(lineKey, []);
      }
      groupsMap.get(lineKey)!.push(product);
    });

    const MODEL_DEFAULT_COLORS: Record<string, string> = {
      'i': 'electric purple',
      'i-one': 'electric purple',
      'i prime': 'electric purple',
    };

    groupsMap.forEach((variants, lineKey) => {
      // Sort variants so Electric Purple is first in the swatch list
      variants.sort((a, b) => {
        const colorA = String((a.attributes as any)?.colorVariantName || (a.attributes as any)?.color || a.title).toLowerCase();
        const colorB = String((b.attributes as any)?.colorVariantName || (b.attributes as any)?.color || b.title).toLowerCase();
        const isPurpleA = colorA.includes('electric purple') || colorA.includes('фиолетовый') || colorA.includes('purple');
        const isPurpleB = colorB.includes('electric purple') || colorB.includes('фиолетовый') || colorB.includes('purple');
        if (isPurpleA && !isPurpleB) return -1;
        if (!isPurpleA && isPurpleB) return 1;
        return 0;
      });

      const preferredColor = MODEL_DEFAULT_COLORS[lineKey];
      const primary =
        (preferredColor &&
          variants.find(
            (v) =>
              v.in_stock &&
              String((v.attributes as Record<string, any>)?.colorVariantName || (v.attributes as Record<string, any>)?.color || v.title)
                .toLowerCase()
                .includes(preferredColor)
          )) ||
        variants.find((v) => v.in_stock) ||
        variants[0];

      cardsToRender.push({ primary, variants });
    });
  } else {
    cardsToRender = products.map((product) => ({ primary: product }));
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {cardsToRender.map(({ primary, variants }) => (
        <ProductCard key={primary.id} product={primary} variants={variants} />
      ))}
    </div>
  );
}
