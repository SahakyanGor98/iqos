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

/**
 * Order lifecycle — shared by purchases and trade-ins (trade-ins typically skip
 * 'shipped'). Canonical set: enforced in app/actions/orders.ts and by the
 * `orders_status_check` DB constraint (supabase/migrations/20260902_orders_status.sql).
 * Client-safe (no server-only imports) so both the admin UI and the status
 * control can use it.
 */
export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'shipped',
  'completed',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Label + Tailwind badge classes per status (used by the list, detail, control). */
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; badge: string }> = {
  pending: { label: 'Новый', badge: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Подтверждён', badge: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'В доставке', badge: 'bg-indigo-100 text-indigo-700' },
  completed: { label: 'Выполнен', badge: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Отменён', badge: 'bg-red-100 text-red-700' },
};

/** Narrow an arbitrary DB status string to a known OrderStatus (fallback: pending). */
export function toOrderStatus(value: string): OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value) ? (value as OrderStatus) : 'pending';
}

/** Structured extras stored on `orders.metadata.trade_in` for trade-in orders. */
export type TradeInMetadata = {
  old_device?: string;
  old_device_id?: string;
  target_device?: string;
  target_slug?: string;
  target_color?: string;
  original_price?: number;
  final_price?: number;
  estimated_discount?: number;
  delivery_city?: string;
  delivery_address?: string;
};
