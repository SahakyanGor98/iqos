import { supabase } from './supabase';
import { ProductRow } from '@/types/supabase';

export type ProductParams = {
  category: 'gadget' | 'sticks' | 'water' | 'accessories';
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

      if (key === 'hasCapsule') {
        const valBool = Array.isArray(value) ? value.includes('true') : value === 'true';
        if (valBool) {
          query = query.eq('attributes->>hasCapsule', 'true');
        }
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          query = query.in(`attributes->>${key}`, value);
        }
      } else {
        query = query.eq(`attributes->>${key}`, value);
      }
    });
  }

  // Text Search
  if (params.query) {
    const q = params.query.trim();

    // Check for exact device/line search terms
    if (/iluma\s*i\s*prime/i.test(q)) {
      query = query.eq('attributes->>line', 'ILUMA i PRIME');
    } else if (/iluma\s*i\s*one/i.test(q)) {
      query = query.eq('attributes->>line', 'ILUMA i ONE');
    } else if (/iluma\s*i/i.test(q)) {
      query = query.or(
        'attributes->>line.eq.ILUMA i,attributes->>line.eq.ILUMA i ONE,attributes->>line.eq.ILUMA i PRIME',
      );
    } else if (/prime/i.test(q)) {
      query = query.or('attributes->>line.eq.ILUMA PRIME,attributes->>line.eq.ILUMA i PRIME');
    } else if (/one/i.test(q)) {
      query = query.or('attributes->>line.eq.ILUMA ONE,attributes->>line.eq.ILUMA i ONE');
    } else {
      query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
    }
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

export async function getProductsBySlugs(slugs: string[]): Promise<ProductRow[]> {
  if (!slugs || slugs.length === 0) return [];
  const { data, error } = await supabase.from('products').select('*').in('slug', slugs);
  if (error) {
    console.error(`Error fetching products by slugs:`, error);
    return [];
  }
  return (data as ProductRow[]) || [];
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
          String((product.attributes as Record<string, string>)?.colorVariantName || (product.attributes as Record<string, string>)?.color || product.slug)
            .toLowerCase()
            .includes('purple')
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

export async function getAllSlugs(
  category: 'gadget' | 'sticks' | 'water' | 'accessories',
): Promise<string[]> {
  const { data, error } = await supabase.from('products').select('slug').eq('category', category);

  if (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }

  return data?.map((p) => p.slug) || [];
}
