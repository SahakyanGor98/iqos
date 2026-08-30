import { ProductRow } from '@/types/supabase';

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
    const attrs = (product.attributes as Record<string, any>) || {};
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
    i: 'breeze blue',
    'i-one': 'digital violet',
    'i prime': 'aspen green',
  };

  const cardsToRender: GroupedCard[] = [];

  groupsMap.forEach((variants, lineKey) => {
    const preferredColor = MODEL_DEFAULT_COLORS[lineKey];
    const primary =
      (preferredColor &&
        variants.find(
          (v) =>
            v.in_stock &&
            String((v.attributes as Record<string, any>)?.color || v.title)
              .toLowerCase()
              .includes(preferredColor),
        )) ||
      variants.find((v) => v.in_stock) ||
      variants[0];

    cardsToRender.push({ primary, variants });
  });

  return cardsToRender;
}
