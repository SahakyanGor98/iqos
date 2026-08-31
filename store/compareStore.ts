import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductRow } from '@/types/supabase';

export type CategoryKey = 'gadget' | 'sticks' | 'water' | 'accessories';

export interface CompareState {
  itemsByCategory: Record<CategoryKey, ProductRow[]>;
  slotIndices: Record<CategoryKey, [number, number, number]>;
  isThirdSlotOpen: boolean;

  addToCompare: (product: ProductRow) => {
    success: boolean;
  };
  addMultipleToCompare: (products: ProductRow[]) => void;
  removeFromCompare: (productId: number, category?: CategoryKey) => void;
  clearCategoryCompare: (category: CategoryKey) => void;
  clearAllCompare: () => void;
  isInCompare: (productId: number) => boolean;
  getItemsByCategory: (category: CategoryKey) => ProductRow[];
  cycleSlotIndex: (category: CategoryKey, slotIndex: 0 | 1 | 2, direction: 'prev' | 'next') => void;
  setSlotIndex: (category: CategoryKey, slotIndex: 0 | 1 | 2, targetItemIndex: number) => void;
  setThirdSlotOpen: (open: boolean) => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      itemsByCategory: {
        gadget: [],
        sticks: [],
        water: [],
        accessories: [],
      },
      slotIndices: {
        gadget: [0, 1, 2],
        sticks: [0, 1, 2],
        water: [0, 1, 2],
        accessories: [0, 1, 2],
      },
      isThirdSlotOpen: false,

      getItemsByCategory: (category: CategoryKey) => {
        const { itemsByCategory } = get();
        return itemsByCategory[category] || [];
      },

      addToCompare: (product: ProductRow) => {
        const idStr = String(product.id);
        const catKey = (product.category as CategoryKey) || 'gadget';

        set((state) => {
          const currentList = state.itemsByCategory[catKey] || [];
          // Toggle: remove if already present, otherwise append (unlimited pool).
          const alreadyIn = currentList.some((i) => String(i.id) === idStr);
          const nextList = alreadyIn
            ? currentList.filter((i) => String(i.id) !== idStr)
            : [...currentList, product];

          return {
            itemsByCategory: {
              ...state.itemsByCategory,
              [catKey]: nextList,
            },
          };
        });

        return { success: true };
      },

      addMultipleToCompare: (products: ProductRow[]) => {
        set((state) => {
          const nextState = { ...state.itemsByCategory };

          products.forEach((product) => {
            const catKey = (product.category as CategoryKey) || 'gadget';
            const currentList = [...(nextState[catKey] || [])];
            if (!currentList.some((i) => String(i.id) === String(product.id))) {
              currentList.push(product);
              nextState[catKey] = currentList;
            }
          });

          return { itemsByCategory: nextState };
        });
      },

      removeFromCompare: (productId: number, category?: CategoryKey) => {
        set((state) => {
          const idStr = String(productId);
          const nextState = { ...state.itemsByCategory };

          if (category && nextState[category]) {
            nextState[category] = nextState[category].filter((i) => String(i.id) !== idStr);
          } else {
            (Object.keys(nextState) as CategoryKey[]).forEach((key) => {
              nextState[key] = (nextState[key] || []).filter((i) => String(i.id) !== idStr);
            });
          }

          return { itemsByCategory: nextState };
        });
      },

      clearCategoryCompare: (category: CategoryKey) => {
        set((state) => ({
          itemsByCategory: {
            ...state.itemsByCategory,
            [category]: [],
          },
          slotIndices: {
            ...state.slotIndices,
            [category]: [0, 1, 2],
          },
        }));
      },

      clearAllCompare: () => {
        set({
          itemsByCategory: {
            gadget: [],
            sticks: [],
            water: [],
            accessories: [],
          },
          slotIndices: {
            gadget: [0, 1, 2],
            sticks: [0, 1, 2],
            water: [0, 1, 2],
            accessories: [0, 1, 2],
          },
          isThirdSlotOpen: false,
        });
      },

      isInCompare: (productId: number) => {
        const { itemsByCategory } = get();
        const idStr = String(productId);
        return Object.values(itemsByCategory).some((list) =>
          (list || []).some((item) => String(item.id) === idStr),
        );
      },

      cycleSlotIndex: (
        category: CategoryKey,
        slotPosition: 0 | 1 | 2,
        direction: 'prev' | 'next',
      ) => {
        const { itemsByCategory, slotIndices } = get();
        const pool = itemsByCategory[category] || [];
        if (pool.length === 0) return;

        const currentSlotIndices = [...(slotIndices[category] || [0, 1, 2])];
        const currentIndex = currentSlotIndices[slotPosition] || 0;

        let nextIndex = currentIndex;
        if (direction === 'next') {
          nextIndex = (currentIndex + 1) % pool.length;
        } else {
          nextIndex = (currentIndex - 1 + pool.length) % pool.length;
        }

        currentSlotIndices[slotPosition] = nextIndex;

        set({
          slotIndices: {
            ...slotIndices,
            [category]: currentSlotIndices as [number, number, number],
          },
        });
      },

      setSlotIndex: (category: CategoryKey, slotPosition: 0 | 1 | 2, targetItemIndex: number) => {
        const { slotIndices } = get();
        const currentSlotIndices = [...(slotIndices[category] || [0, 1, 2])];
        currentSlotIndices[slotPosition] = targetItemIndex;

        set({
          slotIndices: {
            ...slotIndices,
            [category]: currentSlotIndices as [number, number, number],
          },
        });
      },

      setThirdSlotOpen: (open: boolean) => {
        set({ isThirdSlotOpen: open });
      },
    }),
    {
      name: 'iqos-compare-storage-v4',
    },
  ),
);
