import { supabase } from './supabase';
import { ProductRow } from '@/types/supabase';

export type ProductParams = {
  category: 'gadget' | 'sticks';
  page?: number;
  limit?: number;
  sort?: string; // 'price_asc' | 'price_desc' | 'newest'
  priceRange?: {
    min?: number;
    max?: number;
  };
  // Dynamic filters
  query?: string;
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
          const orCondition = value
            .map((v) => `attributes->${key}.cs.["${v}"]`)
            .join(',');
          query = query.or(orCondition);
        } else {
          // For string fields in DB (attributes->color)
          // attributes->>color.eq.Red,attributes->>color.eq.Blue
          const orCondition = value
            .map((v) => `attributes->>${key}.eq.${v}`)
            .join(',');
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

export async function getAllSlugs(category: 'gadget' | 'sticks'): Promise<string[]> {
  const { data, error } = await supabase.from('products').select('slug').eq('category', category);

  if (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }

  return data?.map((p) => p.slug) || [];
}
