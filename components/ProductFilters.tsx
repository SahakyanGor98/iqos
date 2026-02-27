'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SlidersHorizontal, X, Check } from 'lucide-react';

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
    <div className='w-full md:w-64 flex-shrink-0'>
      {/* Mobile Toggle Button */}
      <button
        className='flex items-center justify-center gap-2 md:hidden bg-[#f5f5f5] p-3 rounded-lg cursor-pointer w-full hover:bg-neutral-200 transition-colors'
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal size={18} />
        <span className='font-bold uppercase text-sm tracking-wide'>Фильтры</span>
      </button>

      {/* Desktop Header */}
      <div className='hidden md:flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold uppercase tracking-wide'>Фильтры</h3>
        <button
          onClick={handleClearFilters}
          className='text-xs text-neutral-500 hover:text-black uppercase tracking-wider underline decoration-neutral-300'
        >
          Сбросить
        </button>
      </div>

      {/* Sidebar Overlay and Content */}
      <div
        className={`fixed inset-0 z-50 md:relative md:z-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}
      >
        {/* Backdrop */}
        <div className='absolute inset-0 bg-black/50 md:hidden' onClick={() => setIsOpen(false)} />

        {/* Sidebar Panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-6 overflow-y-auto transition-transform duration-300 transform md:relative md:w-full md:max-w-none md:p-0 md:bg-transparent md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className='flex items-center justify-between mb-6 md:hidden'>
            <h3 className='text-xl font-bold uppercase tracking-wide'>Фильтры</h3>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 hover:bg-neutral-100 rounded-full transition-colors'
            >
              <X size={24} />
            </button>
          </div>

          <div className='space-y-6'>
            {sections.map((section) => (
              <div key={section.id} className='border-b border-neutral-100 pb-4 last:border-0'>
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
                            {isChecked && <Check size={12} className='text-white' />}
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

            <div className='pt-4 md:hidden'>
              <button
                onClick={handleClearFilters}
                className='w-full text-center text-xs text-neutral-500 hover:text-black uppercase tracking-wider underline decoration-neutral-300 py-2'
              >
                Сбросить все
              </button>
            </div>
          </div>
        </div>
      </div>

      {isPending && (
        <div className='hidden md:block text-xs text-center text-neutral-400 animate-pulse mt-4'>
          Обновление...
        </div>
      )}
    </div>
  );
};
