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
  } else {
    query = query.order('id', { ascending: true });
  }

  // Dynamic Filters (JSONB)
  // Dynamic Filters (JSONB)
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        // Special handling for 'hasCapsule' boolean logic
        if (key === 'hasCapsule') {
          // value from URL is 'true'
          query = query.contains('attributes', { [key]: value === 'true' });
          return;
        }

        // Supabase .contains() logic:
        // If DB has { "flavors": ["A", "B"] }, searching for "A" via .contains requires
        // passing { "flavors": ["A"] }.
        // If we pass { "flavors": "A" }, it looks for a string value "A", not element in array.

        // HACK: We assume specific keys are arrays based on known schema.
        const knownArrayKeys = ['flavors'];

        if (knownArrayKeys.includes(key)) {
          // Force wrap value in array for .contains to work on JSON arrays
          // Even if value is already array (from multi-select params),
          // we might need to handle it.
          // If param is ?flavors=A -> value='A' -> wrap -> ['A']
          // If param is ?flavors=A&flavors=B -> value=['A','B'] -> use as is or wrap?
          // .contains({flavors: ['A', 'B']}) means "Contains BOTH A and B". (AND logic)
          // If user wants OR, we can't easily do it with simple .contains

          if (Array.isArray(value)) {
            query = query.contains('attributes', { [key]: value });
          } else {
            query = query.contains('attributes', { [key]: [value] });
          }
        } else {
          // Standard string match (e.g. strength, color)
          // DB: { "strength": "strong" } -> Query: { "strength": "strong" }
          if (typeof value === 'string') {
            query = query.contains('attributes', { [key]: value });
          }
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
