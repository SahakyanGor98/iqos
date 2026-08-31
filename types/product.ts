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

/**
 * Shape of the JSONB `products.attributes` column. All fields are optional and
 * vary by category; the index signature keeps access to any not-yet-modelled key
 * typed as `unknown` (never `any`).
 */
export type ProductAttributes = {
  line?: string;
  color?: string;
  colorVariantName?: string;
  hex?: string;
  compatibility?: string;
  material?: string;
  origin?: string;
  strength?: string;
  type?: string;
  category?: string;
  imagePack?: string;
  flavors?: string[];
  hasCapsule?: boolean;
  packaging?: string;
  pack_size?: number;
  packSize?: number;
  unit_volume?: string;
  unitVolume?: string;
  total_volume?: string;
  totalVolume?: string;
  pricePack?: number;
  salePrice?: number;
  [key: string]: unknown;
};
