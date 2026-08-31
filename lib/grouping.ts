import { ProductRow } from '@/types/supabase';
import { ProductAttributes } from '@/types/product';

export type GroupedCard = {
  primary: ProductRow;
  variants?: ProductRow[];
};

export function getGroupedCards(products: ProductRow[]): GroupedCard[] {
  if (!products || products.length === 0) return [];

  const isGroupable = products.some((p) => p.category === 'gadget' || p.category === 'accessories');

  if (!isGroupable) {
    return products.map((product) => ({ primary: product }));
  }

  const groupsMap = new Map<string, ProductRow[]>();

  products.forEach((product) => {
    const attrs = (product.attributes as ProductAttributes) || {};
    const lineKey = attrs.line
      ? String(attrs.line).toLowerCase().trim()
      : product.title
          .split('-')[0]
          .replace(
            /Pink|Green|Gray|Blue|Beige|Black|Violet|Red|Terracotta|Leaf|Breeze|Digital|Midnight|Aspen|Garnet/gi,
            '',
          )
          .trim();

    if (!groupsMap.has(lineKey)) {
      groupsMap.set(lineKey, []);
    }
    groupsMap.get(lineKey)!.push(product);
  });

  const MODEL_DEFAULT_COLORS: Record<string, string> = {
    i: 'electric purple',
    'i-one': 'electric purple',
    'i prime': 'electric purple',
  };

  const colorOf = (p: ProductRow) =>
    String(
      (p.attributes as ProductAttributes)?.colorVariantName ||
        (p.attributes as ProductAttributes)?.color ||
        p.title,
    ).toLowerCase();

  const isPurple = (c: string) =>
    c.includes('electric purple') || c.includes('фиолетовый') || c.includes('purple');

  const cardsToRender: GroupedCard[] = [];

  groupsMap.forEach((variants, lineKey) => {
    // Show Electric Purple first in the swatch list (rc behaviour).
    variants.sort((a, b) => {
      const pa = isPurple(colorOf(a));
      const pb = isPurple(colorOf(b));
      if (pa && !pb) return -1;
      if (!pa && pb) return 1;
      return 0;
    });

    const preferredColor = MODEL_DEFAULT_COLORS[lineKey];
    const primary =
      (preferredColor && variants.find((v) => v.in_stock && colorOf(v).includes(preferredColor))) ||
      variants.find((v) => v.in_stock) ||
      variants[0];

    cardsToRender.push({ primary, variants });
  });

  return cardsToRender;
}
