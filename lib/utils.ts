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

export type DeviceColorConfig = {
  keywords: string[];
  swatch: { background: string; border?: string };
};

export const DEVICE_COLOR_SWATCH_MAP: DeviceColorConfig[] = [
  {
    keywords: ['neon', 'we edition'],
    swatch: { background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)' },
  },
  {
    keywords: ['oasis'],
    swatch: { background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)' },
  },
  {
    keywords: ['midnight black', 'black', 'черный', 'чёрный', 'темно-серый', 'тёмно-серый'],
    swatch: { background: '#212429' },
  },
  {
    keywords: ['breeze blue', 'blue', 'синий'],
    swatch: { background: '#4f86c6' },
  },
  {
    keywords: ['digital violet', 'violet', 'purple', 'electric purple', 'фиолетовый'],
    swatch: { background: '#705096' },
  },
  {
    keywords: ['aspen green', 'leaf green', 'green', 'зеленый', 'зелёный'],
    swatch: { background: '#406651' },
  },
  {
    keywords: ['garnet red', 'red', 'красный', 'pink', 'розовый'],
    swatch: { background: '#9e3232' },
  },
  {
    keywords: ['terracotta', 'orange', 'оранжевый'],
    swatch: { background: '#cf5e2b' },
  },
  {
    keywords: ['beige', 'бежевый'],
    swatch: { background: '#d7c2a7' },
  },
  {
    keywords: ['gray', 'серый'],
    swatch: { background: '#6c757d' },
  },
  {
    keywords: ['gold', 'bright', 'желтый', 'жёлтый'],
    swatch: { background: '#e0a838' },
  },
];

const DEFAULT_SWATCH = { background: '#9ca3af' };

export function getDeviceColorSwatch(colorName?: string, title?: string): { background: string; border?: string } {
  const name = (colorName || title || '').toLowerCase();
  if (!name) return DEFAULT_SWATCH;

  const matched = DEVICE_COLOR_SWATCH_MAP.find((item) =>
    item.keywords.some((keyword) => name.includes(keyword))
  );

  return matched ? matched.swatch : DEFAULT_SWATCH;
}


