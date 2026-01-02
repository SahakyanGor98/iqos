import { TIqos } from './iqos';
import { TTerea } from './terea';

export type Product = {
  id: number;
  slug: string;
  title: string;
  image: string;
  price: number;
  category: 'gadget' | 'sticks';
  // Optional fields to preserve specific data if needed for UI, but not strictly required for Cart logic if handled there
  brand?: string;
  line?: string;
  color?: string;
  quantity?: number; // Useful for UI display in cart
};

// Helper to adapt specific types to Product
export const toProduct = (item: TIqos | TTerea): Product => {
  if (item.category === 'gadget') {
    const iqos = item as TIqos;
    return {
      id: iqos.id,
      slug: iqos.slug,
      title: iqos.title,
      image: iqos.image,
      price: iqos.price,
      category: 'gadget',
      line: iqos.line,
      color: iqos.color,
    };
  } else {
    const terea = item as TTerea;
    return {
      id: terea.id,
      slug: terea.slug,
      title: terea.title,
      image: terea.imageBlock, // Using Block image
      price: terea.priceBlock, // Using Block price
      category: 'sticks',
      brand: terea.brand,
    };
  }
};
