import { supabase } from './supabase';
import { ProductRow } from '@/types/supabase';
import accessoriesData from '@/assets/accessories.json';

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

// Helper to format JSON asset to ProductRow
function formatAccessoryRow(item: any): ProductRow {
  return {
    id: item.id,
    created_at: new Date().toISOString(),
    slug: item.slug,
    title: item.title,
    description: item.description,
    image: Array.isArray(item.image) ? item.image : [item.image],
    price: item.price,
    category: 'accessories',
    in_stock: item.inStock ?? true,
    badges: item.badges || { isNew: false, isHit: false, isExclusive: false },
    attributes: item.attributes || {},
    brand: item.brand || 'IQOS',
  };
}

export async function getProducts(params: ProductParams): Promise<PaginatedResult> {
  const { category, page = 1, limit = 25, sort, filters } = params;

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
        query = query.contains('attributes', { [key]: value === 'true' });
        return;
      }

      const knownArrayKeys = ['flavors'];

      if (Array.isArray(value)) {
        if (knownArrayKeys.includes(key)) {
          const orCondition = value.map((v) => `attributes->${key}.cs.["${v}"]`).join(',');
          query = query.or(orCondition);
        } else {
          const orCondition = value.map((v) => `attributes->>${key}.eq.${v}`).join(',');
          query = query.or(orCondition);
        }
      } else {
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

  if (error || !data || data.length === 0) {
    if (category === 'accessories') {
      let mockList = accessoriesData.map(formatAccessoryRow);

      if (filters?.color) {
        const colors = Array.isArray(filters.color) ? filters.color : [filters.color];
        mockList = mockList.filter((item) => colors.includes((item.attributes as any)?.color));
      }
      if (filters?.type) {
        const types = Array.isArray(filters.type) ? filters.type : [filters.type];
        mockList = mockList.filter((item) => types.includes((item.attributes as any)?.type));
      }
      if (filters?.compatibility) {
        const comps = Array.isArray(filters.compatibility)
          ? filters.compatibility
          : [filters.compatibility];
        mockList = mockList.filter((item) =>
          comps.includes((item.attributes as any)?.compatibility),
        );
      }
      if (params.inStock) {
        mockList = mockList.filter((item) => item.in_stock);
      }
      if (params.priceRange?.min !== undefined) {
        mockList = mockList.filter((item) => item.price >= params.priceRange!.min!);
      }
      if (params.priceRange?.max !== undefined) {
        mockList = mockList.filter((item) => item.price <= params.priceRange!.max!);
      }

      const paginatedMock = mockList.slice((page - 1) * limit, page * limit);
      return { data: paginatedMock, count: mockList.length };
    }
    if (error) {
      console.error(`Error fetching ${category}:`, error);
    }
    return { data: [], count: 0 };
  }

  return { data: data as ProductRow[], count: count || 0 };
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
  if (error || !data) {
    const mockMatch = accessoriesData.find((item) => item.slug === slug);
    if (mockMatch) {
      return formatAccessoryRow(mockMatch);
    }
    if (error) {
      console.error(`Error fetching product ${slug}:`, error);
    }
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
    const featured = matches.find((product) => product.in_stock) ?? matches[0];
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

  if (error || !data || data.length === 0) {
    if (category === 'accessories') {
      return accessoriesData.map((item) => item.slug);
    }
    if (error) {
      console.error('Error fetching slugs:', error);
    }
    return [];
  }

  return data.map((p) => p.slug);
}
