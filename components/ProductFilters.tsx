'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import { HapticButton } from '@/components/HapticButton';

type FilterOption = {
  label: string;
  value: string;
};

export type SectionType = 'checkbox' | 'range' | 'boolean';

type FilterSection = {
  id: string;
  label: string;
  type: SectionType;
  options?: FilterOption[]; // for checkbox
  min?: number; // for range
  max?: number; // for range
};

type Props = {
  sections: FilterSection[];
};

type Draft = Record<string, string[]>;

/** Build a draft object from URL params — defined outside component to avoid closure issues */
function buildDraft(params: URLSearchParams, sections: FilterSection[]): Draft {
  const d: Draft = {};
  sections.forEach((s) => {
    if (s.type === 'checkbox') d[s.id] = params.getAll(s.id);
    else if (s.type === 'boolean') d[s.id] = params.get(s.id) === 'true' ? ['true'] : [];
    else d[s.id] = [];
  });
  return d;
}

export const ProductFilters = ({ sections }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ── Mobile panel open/close ───────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);

  // ── Draft: pending selections not yet committed to the URL ────────────────
  const [draft, setDraft] = useState<Draft>(() => buildDraft(searchParams, sections));
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Re-sync draft from URL after a successful Apply / Reset (or external navigation)
  useEffect(() => {
    setDraft(buildDraft(searchParams, sections));
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Active filter count (from committed URL, shown on badge) ──────────────
  const activeFilterCount =
    sections.reduce((count, s) => {
      if (s.type === 'checkbox') return count + searchParams.getAll(s.id).length;
      if (s.type === 'boolean') return count + (searchParams.get(s.id) === 'true' ? 1 : 0);
      return count;
    }, 0) + (searchParams.get('minPrice') || searchParams.get('maxPrice') ? 1 : 0);

  // ── Open: initialize draft from current URL ───────────────────────────────
  const handleOpen = () => {
    setDraft(buildDraft(searchParams, sections));
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setIsOpen(true);
  };

  // ── Close via X: discard draft, do NOT commit ─────────────────────────────
  const handleClose = () => {
    setIsOpen(false);
    // Roll draft back to committed state so re-open is clean
    setDraft(buildDraft(searchParams, sections));
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  };

  // ── Draft mutations (no URL change) ───────────────────────────────────────
  const handleCheckboxChange = (sectionId: string, value: string) => {
    setDraft((prev) => {
      const current = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleBooleanChange = (sectionId: string) => {
    setDraft((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || [])[0] === 'true' ? [] : ['true'],
    }));
  };

  // ── Apply: commit draft → URL → close ────────────────────────────────────
  const handleApply = () => {
    // Start from current params to preserve sort/perPage/etc
    const params = new URLSearchParams(searchParams);

    // Clear all filter-owned keys
    sections.forEach((s) => params.delete(s.id));
    params.delete('minPrice');
    params.delete('maxPrice');

    // Write draft values
    Object.entries(draft).forEach(([key, values]) => {
      values.forEach((v) => params.append(key, v));
    });
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', '1');

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
    setIsOpen(false);
  };

  // ── Reset All: clear draft + URL → close ─────────────────────────────────
  const handleResetAll = () => {
    setDraft(sections.reduce<Draft>((d, s) => ({ ...d, [s.id]: [] }), {}));
    setMinPrice('');
    setMaxPrice('');
    startTransition(() => {
      router.replace(pathname);
    });
    setIsOpen(false);
  };

  // ── Shared action buttons (reused in both mobile and desktop) ─────────────
  const actionButtons = (
    <div className='flex gap-3'>
      <HapticButton
        onClick={handleResetAll}
        disabled={isPending}
        hapticPattern={10}
        className='flex-1 border border-neutral-300 text-black text-xs font-bold py-3 rounded-lg uppercase tracking-wider hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
      >
        Сбросить всё
      </HapticButton>
      <HapticButton
        onClick={handleApply}
        disabled={isPending}
        hapticPattern={15}
        className='flex-1 bg-black text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
      >
        {isPending ? 'Загрузка…' : 'Применить'}
      </HapticButton>
    </div>
  );

  return (
    <div className='w-full md:w-64 flex-shrink-0'>
      {/* ── Mobile Toggle Button ── */}
      <button
        className='flex items-center justify-center gap-2 md:hidden bg-[#f5f5f5] p-3 rounded-lg cursor-pointer w-full hover:bg-neutral-200 transition-colors'
        onClick={handleOpen}
      >
        <SlidersHorizontal size={18} />
        <span className='font-bold uppercase text-sm tracking-wide'>Фильтры</span>
        {activeFilterCount > 0 && (
          <span className='ml-1 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none'>
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* ── Desktop Header ── */}
      <div className='hidden md:flex items-center gap-2 mb-6'>
        <h3 className='text-xl font-bold uppercase tracking-wide'>Фильтры</h3>
        {activeFilterCount > 0 && (
          <span className='bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none'>
            {activeFilterCount}
          </span>
        )}
      </div>

      {/* ── Overlay + Panel ── */}
      <div
        className={`fixed inset-0 z-50 md:relative md:z-auto transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
        }`}
      >
        {/* Backdrop (mobile only) */}
        <div
          className='absolute inset-0 bg-black/50 md:hidden'
          onClick={handleClose}
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white flex flex-col transition-transform duration-300 transform md:relative md:w-full md:max-w-none md:bg-transparent md:translate-x-0 md:flex md:flex-col ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Panel Header */}
          <div className='flex items-center justify-between px-6 pt-6 pb-4 md:hidden flex-shrink-0'>
            <h3 className='text-xl font-bold uppercase tracking-wide'>Фильтры</h3>
            <button
              onClick={handleClose}
              className='p-2 hover:bg-neutral-100 rounded-full transition-colors'
              aria-label='Закрыть фильтры'
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable filter list */}
          <div className='flex-1 overflow-y-auto px-6 md:px-0 pb-2 space-y-6'>
            {sections.map((section) => (
              <div key={section.id} className='border-b border-neutral-100 pb-4 last:border-0'>
                <h4 className='font-semibold mb-3 text-sm text-neutral-800 uppercase tracking-wide'>
                  {section.label}
                </h4>

                {/* Checkbox */}
                {section.type === 'checkbox' && section.options && (
                  <div className='space-y-2'>
                    {section.options.map((option) => {
                      const isChecked = (draft[section.id] || []).includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className='flex items-center gap-3 cursor-pointer group'
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-black border-black'
                                : 'bg-white border-neutral-300 group-hover:border-neutral-400'
                            }`}
                          >
                            {isChecked && <Check size={12} className='text-white' />}
                          </div>
                          <input
                            type='checkbox'
                            className='hidden'
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(section.id, option.value)}
                          />
                          <span
                            className={`text-sm transition-colors ${
                              isChecked
                                ? 'text-black font-medium'
                                : 'text-neutral-600 group-hover:text-black'
                            }`}
                          >
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Price Range */}
                {section.type === 'range' && (
                  <div className='flex items-center gap-2'>
                    <input
                      type='number'
                      placeholder='От'
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className='w-full rounded bg-neutral-50 border border-neutral-200 text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all'
                    />
                    <span className='text-neutral-400 flex-shrink-0'>—</span>
                    <input
                      type='number'
                      placeholder='До'
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className='w-full rounded bg-neutral-50 border border-neutral-200 text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all'
                    />
                  </div>
                )}

                {/* Boolean Toggle */}
                {section.type === 'boolean' && (
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <div
                      className={`w-10 h-5 rounded-full border flex items-center transition-colors px-0.5 ${
                        (draft[section.id] || [])[0] === 'true'
                          ? 'bg-black border-black justify-end'
                          : 'bg-neutral-200 border-transparent justify-start'
                      }`}
                    >
                      <div className='w-4 h-4 bg-white rounded-full shadow-sm' />
                    </div>
                    <input
                      type='checkbox'
                      className='hidden'
                      checked={(draft[section.id] || [])[0] === 'true'}
                      onChange={() => handleBooleanChange(section.id)}
                    />
                    <span className='text-sm text-neutral-600 group-hover:text-black transition-colors'>
                      Включить
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* ── Action buttons ──
               Mobile: stuck to bottom of the panel (flex-shrink-0)
               Desktop: regular flow at the bottom of the filter list      */}
          <div className='flex-shrink-0 px-6 pb-6 pt-4 border-t border-neutral-100 bg-white md:px-0 md:pb-0 md:bg-transparent md:border-0 md:pt-6'>
            {actionButtons}
          </div>
        </div>
      </div>
    </div>
  );
};
