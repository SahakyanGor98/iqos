import { supabase } from './supabase';
import { ProductRow, TradeInDeviceRow } from '@/types/supabase';
import { IQOS_LINES } from '@/lib/constants';

export type ProductParams = {
  category: 'gadget' | 'sticks' | 'water';
  page?: number;
  limit?: number;
  sort?: string; // 'price_asc' | 'price_desc' | 'newest'
  priceRange?: {
    min?: number;
    max?: number;
  };
  // Dynamic filters
  query?: string;
  inStock?: boolean;
  filters?: Record<string, string | string[]>;
};

export type PaginatedResult = {
  data: ProductRow[];
  count: number;
};

export async function getProducts(params: ProductParams): Promise<PaginatedResult> {
  const { category, page = 1, limit = 12, sort, filters } = params;

  let query = supabase.from('products').select('*', { count: 'exact' }).eq('category', category);

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  // Sorting
  // Always prioritize available products
  query = query.order('in_stock', { ascending: false });

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'title_asc') {
    query = query.order('title', { ascending: true });
  } else if (sort === 'title_desc') {
    query = query.order('title', { ascending: false });
  } else {
    query = query.order('id', { ascending: true });
  }

  // Dynamic Filters (JSONB)
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      // Special handling for 'hasCapsule' boolean logic
      if (key === 'hasCapsule') {
        // value from URL is 'true'
        query = query.contains('attributes', { [key]: value === 'true' });
        return;
      }

      const knownArrayKeys = ['flavors'];

      if (Array.isArray(value)) {
        // Multiple values selected -> OR logic
        if (knownArrayKeys.includes(key)) {
          // For array fields in DB (attributes->flavors)
          // attributes->flavors.cs.["A"],attributes->flavors.cs.["B"]
          const orCondition = value.map((v) => `attributes->${key}.cs.["${v}"]`).join(',');
          query = query.or(orCondition);
        } else {
          // For string fields in DB (attributes->color)
          // attributes->>color.eq.Red,attributes->>color.eq.Blue
          const orCondition = value.map((v) => `attributes->>${key}.eq.${v}`).join(',');
          query = query.or(orCondition);
        }
      } else {
        // Single value
        if (knownArrayKeys.includes(key)) {
          query = query.contains('attributes', { [key]: [value] });
        } else {
          query = query.contains('attributes', { [key]: value });
        }
      }
    });
  }

  // Price Range
  if (params.priceRange) {
    if (params.priceRange.min !== undefined) {
      query = query.gte('price', params.priceRange.min);
    }
    if (params.priceRange.max !== undefined) {
      query = query.lte('price', params.priceRange.max);
    }
  }

  // Stock Filter
  if (params.inStock) {
    query = query.eq('in_stock', true);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(`Error fetching ${category}:`, error);
    return { data: [], count: 0 };
  }

  return { data: data as ProductRow[], count: count || 0 };
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
  if (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
  return data as ProductRow;
}

export type IqosLineupItem = {
  line: string;
  name: string;
  description: string;
  ctaLabel: string;
  slug: string;
  image: string;
};

export async function getIqosLineupProducts(
  lineup: ReadonlyArray<{
    line: string;
    name: string;
    description: string;
    ctaLabel: string;
    fallbackSlug: string;
    fallbackImage: string;
  }>,
): Promise<IqosLineupItem[]> {
  const { data, error } = await supabase
    .from('products')
    .select('slug, image, attributes, in_stock')
    .eq('category', 'gadget');

  if (error) {
    console.error('Error fetching IQOS lineup products:', error);
  }

  const products = data ?? [];

  return lineup.map((item) => {
    const matches = products.filter(
      (product) => (product.attributes as Record<string, string>)?.line === item.line,
    );
    const featured =
      matches.find(
        (product) =>
          product.in_stock &&
          String(
            (product.attributes as Record<string, string>)?.colorVariantName ||
              (product.attributes as Record<string, string>)?.color ||
              product.slug,
          )
            .toLowerCase()
            .includes('purple'),
      ) ??
      matches.find((product) => product.in_stock) ??
      matches[0];
    const imageValue = featured?.image;
    const image = Array.isArray(imageValue) ? imageValue[0] : imageValue;

    return {
      line: item.line,
      name: item.name,
      description: item.description,
      ctaLabel: item.ctaLabel,
      slug: featured?.slug ?? item.fallbackSlug,
      image: image ?? item.fallbackImage,
    };
  });
}

export async function getAllSlugs(category: 'gadget' | 'sticks' | 'water'): Promise<string[]> {
  const { data, error } = await supabase.from('products').select('slug').eq('category', category);

  if (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }

  return data?.map((p) => p.slug) || [];
}

/* -------------------------------------------------------------------------- */
/* Trade-in: old devices (dedicated table) + target devices (from products)   */
/* -------------------------------------------------------------------------- */

export type TradeInDeviceView = {
  key: string; // device_key
  name: string;
  description: string | null;
  image: string | null; // first image url, or null (e.g. "other device")
  discount: number; // base_discount in RUB
  badge: string | null;
};

export async function getTradeInDevices(): Promise<TradeInDeviceView[]> {
  const { data, error } = await supabase
    .from('trade_in_devices')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching trade-in devices:', error);
    return [];
  }

  return (data as TradeInDeviceRow[]).map((d) => ({
    key: d.device_key,
    name: d.name,
    description: d.description,
    image: Array.isArray(d.image) ? (d.image[0] ?? null) : null,
    discount: Number(d.base_discount),
    badge: d.badge,
  }));
}

export type TradeInTargetColor = {
  productId: number;
  slug: string;
  colorLabel: string;
  price: number;
  image: string | null;
  inStock: boolean;
};

export type TradeInTargetLine = {
  line: string;
  name: string;
  colors: TradeInTargetColor[];
};

// Which gadget lines can be received via trade-in, in display order.
const TRADE_IN_TARGET_LINES = ['i-one', 'i', 'i prime'];

// Preferred default colour per line (mirrors the catalog's ProductGrid).
const TRADE_IN_DEFAULT_COLORS: Record<string, string> = {
  i: 'breeze blue',
  'i-one': 'digital violet',
  'i prime': 'aspen green',
};

export async function getTradeInTargets(): Promise<TradeInTargetLine[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, price, in_stock, attributes, image')
    .eq('category', 'gadget');

  if (error) {
    console.error('Error fetching trade-in targets:', error);
    return [];
  }

  const byLine = new Map<string, TradeInTargetColor[]>();

  for (const row of data ?? []) {
    const attrs = (row.attributes as Record<string, unknown>) || {};
    const line = String(attrs.line ?? '')
      .toLowerCase()
      .trim();
    if (!TRADE_IN_TARGET_LINES.includes(line)) continue;

    const imageValue = row.image as string[] | string | null;
    const image = Array.isArray(imageValue) ? (imageValue[0] ?? null) : (imageValue ?? null);

    const color: TradeInTargetColor = {
      productId: row.id,
      slug: row.slug,
      colorLabel: (attrs.color as string) || row.slug,
      price: Number(row.price),
      image,
      inStock: !!row.in_stock,
    };

    if (!byLine.has(line)) byLine.set(line, []);
    byLine.get(line)!.push(color);
  }

  const sortColors = (line: string, colors: TradeInTargetColor[]): TradeInTargetColor[] => {
    const preferred = TRADE_IN_DEFAULT_COLORS[line];
    return [...colors].sort((a, b) => {
      const aPref = preferred && a.colorLabel.toLowerCase().includes(preferred) ? 1 : 0;
      const bPref = preferred && b.colorLabel.toLowerCase().includes(preferred) ? 1 : 0;
      if (aPref !== bPref) return bPref - aPref; // preferred first
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1; // in-stock first
      return a.price - b.price; // cheaper first
    });
  };

  return TRADE_IN_TARGET_LINES.filter((line) => byLine.has(line)).map((line) => ({
    line,
    name: IQOS_LINES[line] ?? line,
    colors: sortColors(line, byLine.get(line)!),
  }));
}
