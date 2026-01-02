export type TTerea = {
  id: number;
  slug: string;

  title: string;
  description: string;

  imageBlock: string;
  imagePack: string;

  category: 'sticks';
  brand: 'Terea';

  origin: 'armenia' | 'europe' | 'poland' | 'indonesia' | 'kazakhstan';

  flavors: string[];
  strength: 'легкий' | 'средний' | 'крепкий';

  hasCapsule: boolean;

  priceBlock: number;
  pricePack: number;

  badges: {
    isNew: boolean;
    isHit: boolean;
  };

  inStock: boolean;
};
