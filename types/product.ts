import { TIqos } from './iqos';
import { TTerea } from './terea';

export type Product = {
  id: number;
  slug: string;
  title: string;
  image: string[];
  price: number;
  category: 'gadget' | 'sticks' | 'water' | 'accessories';
  // Optional fields to preserve specific data if needed for UI, but not strictly required for Cart logic if handled there
  brand?: string;
  line?: string;
  color?: string;
  quantity?: number; // Useful for UI display in cart
};

// Helper to adapt specific types to Product
export const toProduct = (item: TIqos | TTerea | any): Product => {
  if (item.category === 'gadget') {
    const iqos = item as TIqos;
    return {
      id: iqos.id,
      slug: iqos.slug,
      title: iqos.title,
      image: Array.isArray(iqos.image) ? iqos.image : [iqos.image],
      price: iqos.price,
      category: 'gadget',
      line: iqos.line,
      color: iqos.color,
    };
  } else if (item.category === 'accessories') {
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      image: Array.isArray(item.image) ? item.image : [item.image],
      price: item.price,
      category: 'accessories',
      color: item.color || item.attributes?.color,
      brand: item.brand,
    };
  } else {
    const terea = item as TTerea;
    return {
      id: terea.id,
      slug: terea.slug,
      title: terea.title,
      image: Array.isArray(terea.imageBlock) ? terea.imageBlock : [terea.imageBlock], // Assuming imageBlock might be the array or single
      price: terea.priceBlock, // Using Block price
      category: 'sticks',
      brand: terea.brand,
    };
  }
};
