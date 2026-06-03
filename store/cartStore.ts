import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

const PROMO_CODES: Record<string, number> = {
  SALE500: 500,
  WELCOME1000: 1000,
  SMOKE500: 500,
  DISCOUNT500: 500,
  VIP500: 500,
  NEW500: 500,
  IQOS500: 500,
};

interface CartState {
  items: CartItem[];

  promoCode: string | null;
  discount: number;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  setPromoCode: (code: string) => boolean;
  clearPromo: () => void;

  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      promoCode: null,
      discount: 0,

      addToCart: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeFromCart: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        }));
      },
      clearCart: () => {
        set({
          items: [],
          promoCode: null,
          discount: 0,
        });
      },

      setPromoCode: (code: string) => {
        const normalized = code.trim().toUpperCase();

        if (PROMO_CODES[normalized]) {
          set({
            promoCode: normalized,
            discount: PROMO_CODES[normalized],
          });
          return true;
        }

        return false;
      },

      clearPromo: () => {
        set({
          promoCode: null,
          discount: 0,
        });
      },
      getTotalPrice: () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
        const discount = get().discount;
        return Math.max(0, total - discount);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'iqos-cart-storage',
    },
  ),
);
