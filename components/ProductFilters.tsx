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

  const [isOpen, setIsOpen] = useState(false);

  // Close filters when searching/navigating on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  const updateParams = (newParams: URLSearchParams) => {
    newParams.set('page', '1');
    startTransition(() => {
      router.replace(`${pathname}?${newParams.toString()}`);
    });
  };

  const handleCheckboxChange = (sectionId: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.getAll(sectionId);

    if (currentValues.includes(value)) {
      params.delete(sectionId);
      currentValues.filter((v) => v !== value).forEach((v) => params.append(sectionId, v));
    } else {
      params.append(sectionId, value);
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
    <div className='w-full md:w-64 flex-shrink-0 space-y-4 md:space-y-6'>
      {/* Mobile Toggle */}
      <div
        className='flex items-center justify-between md:hidden bg-[#f5f5f5] p-3 rounded-lg cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='4' y1='21' x2='4' y2='14'></line>
            <line x1='4' y1='10' x2='4' y2='3'></line>
            <line x1='12' y1='21' x2='12' y2='12'></line>
            <line x1='12' y1='8' x2='12' y2='3'></line>
            <line x1='20' y1='21' x2='20' y2='16'></line>
            <line x1='20' y1='12' x2='20' y2='3'></line>
            <line x1='1' y1='14' x2='7' y2='14'></line>
            <line x1='9' y1='8' x2='15' y2='8'></line>
            <line x1='17' y1='16' x2='23' y2='16'></line>
          </svg>
          <span className='font-bold uppercase text-sm tracking-wide'>Фильтры</span>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <polyline points='6 9 12 15 18 9'></polyline>
          </svg>
        </div>
      </div>

      <div className='hidden md:flex items-center justify-between'>
        <h3 className='text-xl font-bold uppercase tracking-wide'>Фильтры</h3>
        <button
          onClick={handleClearFilters}
          className='text-xs text-neutral-500 hover:text-black uppercase tracking-wider underline decoration-neutral-300'
        >
          Сбросить
        </button>
      </div>

      <div
        className={`${isOpen ? 'block' : 'hidden'} md:block space-y-4 animate-in slide-in-from-top-2 duration-200 md:animate-none`}
      >
        {sections.map((section) => (
          <div key={section.id} className='border-b border-neutral-100 pb-4 last:border-0'>
            {/* Simple header - could be collapsible detail but keep open for visibility for now */}
            <h4 className='font-semibold mb-3 text-sm text-neutral-800 uppercase tracking-wide'>
              {section.label}
            </h4>

            {section.type === 'checkbox' && section.options && (
              <div className='space-y-2'>
                {section.options.map((option) => {
                  const isChecked = searchParams.getAll(section.id).includes(option.value);
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

      <div className={`${isOpen ? 'block' : 'hidden'} md:block md:mt-4`}>
        <button
          onClick={handleClearFilters}
          className='md:hidden w-full text-center text-xs text-neutral-500 hover:text-black uppercase tracking-wider underline decoration-neutral-300 py-2 mb-2'
        >
          Сбросить все
        </button>
      </div>

      {isPending && (
        <div className='text-xs text-center text-neutral-400 animate-pulse'>Обновление...</div>
      )}
    </div>
  );
};
