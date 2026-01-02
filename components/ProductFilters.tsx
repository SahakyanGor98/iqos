'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

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

export const ProductFilters = ({ sections }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for price inputs to avoid url thrashing on every keystroke
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  const updateParams = (newParams: URLSearchParams) => {
    newParams.set('page', '1');
    startTransition(() => {
      router.replace(`${pathname}?${newParams.toString()}`);
    });
  };

  const handleCheckboxChange = (sectionId: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    // Single select logic for now to stay robust with current API,
    // implies "replace value"
    if (params.get(sectionId) === value) {
      params.delete(sectionId);
    } else {
      params.set(sectionId, value);
    }
    updateParams(params);
  };

  const handleBooleanChange = (sectionId: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get(sectionId) === 'true') {
      params.delete(sectionId);
    } else {
      params.set(sectionId, 'true');
    }
    updateParams(params);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    updateParams(params);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    startTransition(() => {
      router.replace(pathname);
    });
  };

  return (
    <div className='w-full md:w-64 flex-shrink-0 space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-bold uppercase tracking-wide'>Фильтры</h3>
        <button
          onClick={handleClearFilters}
          className='text-xs text-neutral-500 hover:text-black uppercase tracking-wider underline decoration-neutral-300'
        >
          Сбросить
        </button>
      </div>

      <div className='space-y-4'>
        {sections.map((section) => (
          <div key={section.id} className='border-b border-neutral-100 pb-4 last:border-0'>
            {/* Simple header - could be collapsible detail but keep open for visibility for now */}
            <h4 className='font-semibold mb-3 text-sm text-neutral-800 uppercase tracking-wide'>
              {section.label}
            </h4>

            {section.type === 'checkbox' && section.options && (
              <div className='space-y-2'>
                {section.options.map((option) => {
                  const isChecked = searchParams.get(section.id) === option.value;
                  return (
                    <label
                      key={option.value}
                      className='flex items-center gap-3 cursor-pointer group'
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-black border-black' : 'bg-white border-neutral-300 group-hover:border-neutral-400'}`}
                      >
                        {isChecked && (
                          <svg
                            className='w-3 h-3 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={3}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                        )}
                      </div>
                      <input
                        type='checkbox'
                        className='hidden'
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(section.id, option.value)}
                      />
                      <span
                        className={`text-sm transition-colors ${isChecked ? 'text-black font-medium' : 'text-neutral-600 group-hover:text-black'}`}
                      >
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {section.type === 'range' && (
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    placeholder='От'
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className='w-full rounded bg-neutral-50 border-neutral-200 text-sm py-2 px-3 focus:ring-black focus:border-black transition-all'
                  />
                  <span className='text-neutral-400'>-</span>
                  <input
                    type='number'
                    placeholder='До'
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className='w-full rounded bg-neutral-50 border-neutral-200 text-sm py-2 px-3 focus:ring-black focus:border-black transition-all'
                  />
                </div>
                <button
                  onClick={applyPriceFilter}
                  className='w-full bg-black text-white text-xs font-bold py-2 rounded uppercase tracking-wider hover:bg-neutral-800 transition'
                >
                  Применить
                </button>
              </div>
            )}

            {section.type === 'boolean' && (
              <label className='flex items-center gap-3 cursor-pointer group'>
                <div
                  className={`w-10 h-5 rounded-full border flex items-center transition-colors px-0.5 ${searchParams.get(section.id) === 'true' ? 'bg-black border-black justify-end' : 'bg-neutral-200 border-transparent justify-start'}`}
                >
                  <div className='w-4 h-4 bg-white rounded-full shadow-sm' />
                </div>
                <input
                  type='checkbox'
                  className='hidden'
                  checked={searchParams.get(section.id) === 'true'}
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

      {isPending && (
        <div className='text-xs text-center text-neutral-400 animate-pulse'>Обновление...</div>
      )}
    </div>
  );
};
