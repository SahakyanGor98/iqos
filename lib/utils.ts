import React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(pattern);
  }
}

export function formatPrice(price: number | string): string {
  const numeric = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^\d.]/g, ''));
  if (isNaN(numeric)) return String(price) + '\u00A0₽';
  const formattedNumber = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric);
  return `${formattedNumber}\u00A0₽`;
}

export function fixCasing(title: string, uppercase = false): string {
  if (!title) return '';
  const parts = title.split(/(\s+)/);
  return parts
    .map((part) => {
      const trimmed = part.trim();
      if (trimmed.toLowerCase() === 'i') {
        return 'i';
      }
      return uppercase ? part.toUpperCase() : part;
    })
    .join('');
}

export function formatDeviceTitle(
  title: string,
  iqosColor?: string,
  remainingColor?: string
): React.ReactNode {
  if (!title) return '';
  const parts = title.split(/(IQOS)/i);
  return React.createElement(
    React.Fragment,
    null,
    ...parts.map((part, index) => {
      if (part.toUpperCase() === 'IQOS') {
        const style = iqosColor ? { color: iqosColor } : undefined;
        return React.createElement(
          'span',
          {
            key: index,
            className: 'font-[family-name:var(--font-christ)] normal-case tracking-wide text-[1.1em] inline',
            style,
          },
          part
        );
      }
      if (remainingColor) {
        return React.createElement(
          'span',
          {
            key: index,
            style: { color: remainingColor },
          },
          part
        );
      }
      return React.createElement(React.Fragment, { key: index }, part);
    })
  );
}
