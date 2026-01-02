export type TIqos = {
  id: number;
  slug: string;

  title: string;
  description: string;
  image: string;

  category: 'gadget' | 'sticks';
  line: 'one' | 'i-one' | 'standard' | 'i-standard' | 'prime' | 'i-prime';

  color?: string;

  price: number;
  salePrice?: number;

  badges: {
    isNew: boolean;
    isHit: boolean;
    isExclusive: boolean;
  };

  inStock: boolean;
};
