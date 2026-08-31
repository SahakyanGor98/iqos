import { CartItem } from '@/store/cartStore';

/**
 * Self-contained snapshot of a single ordered line, stored on `orders.items`.
 * Kept independent of the catalog so an order is fully readable with no joins
 * and survives product deletion / non-catalog items (e.g. trade-in devices).
 */
export interface OrderItemSnapshot {
  title: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_id: number | null;
  slug: string | null;
}

export function cartToSnapshot(items: CartItem[]): OrderItemSnapshot[] {
  return items.map((item) => ({
    title: item.product.title,
    quantity: item.quantity,
    unit_price: item.product.price,
    line_total: item.product.price * item.quantity,
    product_id: item.product.id,
    slug: item.product.slug,
  }));
}
