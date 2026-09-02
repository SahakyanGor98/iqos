import { z } from 'zod';

/**
 * Client-safe product config + validation shared by the admin form and the
 * server actions (no `server-only` import so the client form can use it).
 * Covers every DB-backed catalog category, including accessories (56 rows live
 * in the products table; `assets/accessories.json` is only a fallback when the
 * DB query is empty). The accessories storefront route may be feature-flagged
 * off independently — managing the data here is unaffected.
 */

export const PRODUCT_CATEGORIES = ['gadget', 'sticks', 'water', 'accessories'] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  gadget: 'Устройства',
  sticks: 'Стики',
  water: 'Вода',
  accessories: 'Аксессуары',
};

/** DB category → storefront route segment (for revalidating catalog pages). */
export const CATEGORY_ROUTE: Record<ProductCategory, string> = {
  gadget: 'iqos',
  sticks: 'terea',
  water: 'water',
  accessories: 'accessories',
};

/** Badge flags exposed as checkboxes in the form (others, e.g. bestseller, are
 *  preserved on save but not edited here). */
export const EDITABLE_BADGES = [
  { key: 'isNew', label: 'Новинка' },
  { key: 'isHit', label: 'Хит' },
  { key: 'isExclusive', label: 'Эксклюзив' },
] as const;

/** Full product row as read for the admin screens. */
export type AdminProduct = {
  id: number;
  created_at: string;
  slug: string;
  title: string;
  description: string | null;
  image: string[] | null;
  price: number;
  category: ProductCategory;
  in_stock: boolean;
  brand: string | null;
  badges: Record<string, unknown>;
  attributes: Record<string, unknown>;
};

/** Authoritative create/update payload — validated in the action AND client-side. */
export const productInputSchema = z.object({
  title: z.string().trim().min(1, 'Укажите название'),
  slug: z
    .string()
    .trim()
    .min(1, 'Укажите slug')
    .regex(/^[a-z0-9-]+$/, 'Только строчные латинские буквы, цифры и дефисы'),
  category: z.enum(PRODUCT_CATEGORIES),
  price: z.number().nonnegative('Цена не может быть отрицательной'),
  brand: z.string().trim().default(''),
  description: z.string().default(''),
  in_stock: z.boolean(),
  image: z.array(z.string().url('Некорректный URL изображения')).default([]),
  badges: z.record(z.string(), z.boolean()).default({}),
  attributes: z.record(z.string(), z.unknown()).default({}),
});

export type ProductInput = z.infer<typeof productInputSchema>;
