'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { ArrowUpDown, Calendar, Check, ChevronDown, SortAsc, SortDesc, Type } from 'lucide-react';

const SORT_OPTIONS = [
  { value: '', label: 'По умолчанию', icon: ArrowUpDown },
  { value: 'price_asc', label: 'Сначала дешевые', icon: SortAsc },
  { value: 'price_desc', label: 'Сначала дорогие', icon: SortDesc },
  { value: 'newest', label: 'Новинки', icon: Calendar },
  { value: 'title_asc', label: 'Название (А-Я)', icon: Type },
  { value: 'title_desc', label: 'Название (Я-А)', icon: Type },
];

export const SortSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get('sort') || '';
  const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];
  const Icon = currentOption.icon;

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
    setIsOpen(false);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative md:w-auto w-auto' ref={dropdownRef}>
      <div className='flex items-center gap-2'>
        {/* Mobile Icon Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex md:hidden items-center justify-center bg-[#f5f5f5] hover:bg-neutral-200 transition-colors rounded-lg w-11 h-11 text-black shadow-sm'
          disabled={isPending}
        >
          <Icon size={20} />
        </button>

        {/* Desktop Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='hidden md:flex items-center justify-between gap-2 text-sm bg-[#f5f5f5] hover:bg-neutral-200 transition-colors rounded-lg py-2.5 px-4 md:w-48 text-left group border border-transparent hover:border-neutral-300'
          disabled={isPending}
        >
          <div className='flex items-center gap-2 overflow-hidden'>
            <Icon size={16} className='text-neutral-500 shrink-0' />
            <span className='truncate font-medium'>{currentOption.label}</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-neutral-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className='absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
          {SORT_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-neutral-50 ${currentSort === option.value ? 'text-black font-semibold' : 'text-neutral-600'}`}
              >
                <div className='flex items-center gap-3'>
                  <OptionIcon
                    size={16}
                    className={currentSort === option.value ? 'text-black' : 'text-neutral-400'}
                  />
                  <span>{option.label}</span>
                </div>
                {currentSort === option.value && <Check size={14} className='text-black' />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
