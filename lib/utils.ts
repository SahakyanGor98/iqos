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

export interface FormatDeviceTitleOptions {
  title: string;
  iqosColor?: string;
  remainingColor?: string;
}

export function formatDeviceTitle(
  titleOrOptions: string | FormatDeviceTitleOptions,
  iqosColorParam?: string,
  remainingColorParam?: string
): React.ReactNode {
  let title = '';
  let iqosColor = iqosColorParam;
  let remainingColor = remainingColorParam;

  if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
    title = titleOrOptions.title;
    iqosColor = titleOrOptions.iqosColor;
    remainingColor = titleOrOptions.remainingColor;
  } else {
    title = titleOrOptions || '';
  }

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
            className: 'font-[family-name:var(--font-christ)] normal-case tracking-wide text-[1.06em] inline',
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
