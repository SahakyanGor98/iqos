'use client';

import { useState, useTransition } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateMessageStatus } from '@/app/actions/messages';

/**
 * Toggles a message between "new" and "read". Optimistically flips, calls the
 * authenticated action, and reverts with an inline error on failure. Local state
 * is seeded from the prop (no effect syncing — see .ai/state.md); a successful
 * write revalidates the inbox + dashboard server-side.
 */
export function MessageStatusButton({ id, status }: { id: number; status: string }) {
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isNew = current === 'new';
  const next = isNew ? 'read' : 'new';

  const handleClick = () => {
    const previous = current;
    setCurrent(next); // optimistic
    setError(null);
    startTransition(async () => {
      const res = await updateMessageStatus({ id, status: next });
      if ('error' in res) {
        setCurrent(previous); // revert
        setError(res.error);
      }
    });
  };

  return (
    <div className='flex items-center gap-3'>
      {error ? <span className='text-xs text-red-600'>{error}</span> : null}
      <button
        type='button'
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60',
          isNew
            ? 'border-[#34303d] bg-[#34303d] text-white hover:bg-black'
            : 'border-gray-200 text-neutral-600 hover:bg-gray-100 hover:text-[#34303d]',
        )}
      >
        {isNew ? (
          <>
            <Check className='h-4 w-4' />
            Отметить прочитанным
          </>
        ) : (
          <>
            <RotateCcw className='h-4 w-4' />
            Вернуть в новые
          </>
        )}
      </button>
    </div>
  );
}
