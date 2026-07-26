'use client';

import React, { useState } from 'react';
import { FaqItem } from '@/lib/content/faq';
import { cn, formatDeviceTitle, fixCasing } from '@/lib/utils';

export interface FaqAccordionProps {
  items: FaqItem[]; // Array of question/answer objects
  initialVisibleCount?: number; // Number of items to display initially. Default: 5
  enableExpandButton?: boolean; // Controls whether the bottom-center dropdown opener arrow is allowed to appear. Default: true
  title?: string; // Section heading title
  subtitle?: string; // Section subtitle description
  className?: string; // Optional container class name
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  initialVisibleCount = 5,
  enableExpandButton = true,
  title = 'Часто задаваемые вопросы',
  subtitle,
  className,
}) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [isListExpanded, setIsListExpanded] = useState<boolean>(false);

  const toggleItem = (id: string) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (_) {}
    }
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  const toggleListExpansion = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }
    setIsListExpanded((prev) => !prev);
  };

  // Determine if the dropdown opener arrow button should be visible
  const hasMoreItems = items.length > initialVisibleCount;
  const shouldShowExpandButton = enableExpandButton && hasMoreItems;

  // Slice items list based on expansion state
  const visibleItems =
    shouldShowExpandButton && !isListExpanded
      ? items.slice(0, initialVisibleCount)
      : items;

  return (
    <section className={cn('py-12 md:py-20 bg-white text-[#34303d]', className)}>
      <div className='container-custom max-w-4xl mx-auto px-4 md:px-6'>
        {/* Header */}
        {(title || subtitle) && (
          <div className='text-center mb-10 md:mb-14'>
            {title && (
              <h2 className='text-2xl md:text-4xl font-black tracking-tight text-[#34303d] text-balance mb-3'>
                {formatDeviceTitle(fixCasing(title, true))}
              </h2>
            )}
            {subtitle && (
              <p className='text-[#34303d]/80 max-w-2xl mx-auto leading-relaxed text-pretty text-sm md:text-base'>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Accordion List */}
        <div className='space-y-3.5'>
          {visibleItems.map((item) => {
            const isOpen = openItemId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-2xl border transition-all duration-300 overflow-hidden',
                  isOpen
                    ? 'border-[#34303d]/30 bg-neutral-50/80 shadow-md'
                    : 'border-neutral-200/80 bg-neutral-50/40 hover:border-neutral-300 hover:bg-neutral-50/70'
                )}
              >
                <button
                  type='button'
                  onClick={() => toggleItem(item.id)}
                  className='w-full px-5 py-4 md:px-7 md:py-5 flex items-center justify-between text-left gap-4 transition-colors'
                  aria-expanded={isOpen}
                >
                  <span className='font-bold text-base md:text-lg text-[#34303d] pr-2 leading-snug'>
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300',
                      isOpen
                        ? 'rotate-180 bg-[#34303d] text-white border-[#34303d]'
                        : 'bg-white text-[#34303d] border-neutral-200'
                    )}
                  >
                    <svg
                      className='w-4 h-4 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2.5}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </span>
                </button>

                {/* Accordion Body */}
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out overflow-hidden',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className='min-h-0 overflow-hidden px-5 md:px-7'>
                    <div className='text-sm md:text-base leading-relaxed text-[#34303d]/85 font-medium border-t border-neutral-200/60 py-4'>
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Middle Dropdown Opener Arrow Button */}
        {shouldShowExpandButton && (
          <div className='flex flex-col items-center justify-center mt-8 md:mt-10'>
            <button
              type='button'
              onClick={toggleListExpansion}
              className='inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-neutral-300 bg-white text-[#34303d] font-bold text-sm shadow-sm hover:border-[#34303d] hover:bg-[#34303d] hover:text-white transition-all duration-300 active:scale-95 group'
            >
              <span>
                {isListExpanded
                  ? 'Свернуть список'
                  : `Показать еще вопросы (${items.length - initialVisibleCount})`}
              </span>
              <span
                className={cn(
                  'flex items-center justify-center transition-transform duration-300',
                  isListExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'
                )}
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2.5}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
