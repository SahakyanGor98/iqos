'use client';

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { updateSiteSetting } from '@/app/actions/settings';
import type { SiteSettingRow } from '@/lib/settings';

/**
 * One flag row: label + description + a self-contained toggle switch (plain
 * Tailwind + brand slate, no component library). Optimistically flips, calls the
 * authenticated `updateSiteSetting` action, and reverts with an inline error if
 * the write fails. Local state is initialised from props (no effect syncing —
 * see .ai/state.md); a successful save revalidates and re-renders server-side.
 */
export function SettingToggle({ setting }: { setting: SiteSettingRow }) {
  const [enabled, setEnabled] = useState(setting.value);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const labelId = `setting-${setting.key}-label`;

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next); // optimistic
    setError(null);
    startTransition(async () => {
      const res = await updateSiteSetting({ key: setting.key, value: next });
      if ('error' in res) {
        setEnabled(!next); // revert
        setError(res.error);
      }
    });
  };

  return (
    <div className='flex items-start justify-between gap-4 py-4'>
      <div className='space-y-1'>
        <p id={labelId} className='text-sm font-semibold text-[#34303d]'>
          {setting.label}
        </p>
        {setting.description ? (
          <p className='text-xs text-neutral-500'>{setting.description}</p>
        ) : null}
        {error ? <p className='text-xs text-red-600'>{error}</p> : null}
      </div>

      <button
        type='button'
        role='switch'
        aria-checked={enabled}
        aria-labelledby={labelId}
        disabled={isPending}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#34303d]',
          'disabled:cursor-not-allowed disabled:opacity-60',
          enabled ? 'bg-[#34303d]' : 'bg-neutral-200',
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200',
            enabled ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}
