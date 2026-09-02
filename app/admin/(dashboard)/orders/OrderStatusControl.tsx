'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_META, ORDER_STATUSES, type OrderStatus } from '@/lib/orders';
import { updateOrderStatus } from '@/app/actions/orders';

/**
 * Pipeline of status buttons; clicking one sets that status. Optimistically
 * highlights the choice, calls the authenticated action, and reverts with an
 * inline error on failure. Local state is seeded from the prop (no effect
 * syncing — see .ai/state.md); a successful write revalidates server-side.
 */
export function OrderStatusControl({ id, status }: { id: number; status: OrderStatus }) {
  const [current, setCurrent] = useState<OrderStatus>(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const change = (next: OrderStatus) => {
    if (next === current) return;
    const previous = current;
    setCurrent(next); // optimistic
    setError(null);
    startTransition(async () => {
      const res = await updateOrderStatus({ id, status: next });
      if ('error' in res) {
        setCurrent(previous); // revert
        setError(res.error);
      }
    });
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap gap-2'>
        {ORDER_STATUSES.map((s) => {
          const active = s === current;
          return (
            <button
              key={s}
              type='button'
              onClick={() => change(s)}
              disabled={isPending}
              aria-pressed={active}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60',
                active
                  ? 'border-[#34303d] bg-[#34303d] text-white'
                  : 'border-gray-200 text-neutral-600 hover:bg-gray-100 hover:text-[#34303d]',
              )}
            >
              {ORDER_STATUS_META[s].label}
            </button>
          );
        })}
      </div>
      {error ? <p className='text-xs text-red-600'>{error}</p> : null}
    </div>
  );
}
