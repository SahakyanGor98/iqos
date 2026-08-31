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
  const numeric =
    typeof price === 'number' ? price : parseFloat(String(price).replace(/[^\d.]/g, ''));
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
  remainingColorParam?: string,
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
            className:
              'font-[family-name:var(--font-christ)] normal-case tracking-wide text-[1.06em] inline',
            style,
          },
          part,
        );
      }
      if (remainingColor) {
        return React.createElement(
          'span',
          {
            key: index,
            style: { color: remainingColor },
          },
          part,
        );
      }
      return React.createElement(React.Fragment, { key: index }, part);
    }),
  );
}

export type DeviceColorConfig = {
  keywords: string[];
  swatch: { background: string; border?: string };
};

export const DEVICE_COLOR_SWATCH_MAP: DeviceColorConfig[] = [
  {
    keywords: ['seletti', 'gold', 'golden', 'золотой', 'золото'],
    swatch: { background: 'linear-gradient(135deg, #d4af37 0%, #fef08a 50%, #b45309 100%)' },
  },
  {
    keywords: ['neon', 'we edition'],
    swatch: { background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)' },
  },
  {
    keywords: ['oasis'],
    swatch: { background: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)' },
  },
  {
    keywords: ['chromo', 'silver', 'серебряный', 'серебро'],
    swatch: { background: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 50%, #4b5563 100%)' },
  },
  {
    keywords: [
      'midnight black',
      'obsidian',
      'black',
      'черный',
      'чёрный',
      'темно-серый',
      'тёмно-серый',
    ],
    swatch: { background: '#18181b' },
  },
  {
    keywords: [
      'breeze blue',
      'brisk blue',
      'chill blue',
      'vivid blue',
      'bold blue',
      'charming blue',
      'delicate blue',
      'serene blue',
      'bright blue',
      'blue',
      'синий',
      'голубой',
      'indigo',
    ],
    swatch: { background: '#2563eb' },
  },
  {
    // Electric Purple (Фиолетовый) keeps its dedicated shade from rc; matched
    // before the general violet entry below so it wins first-match.
    keywords: ['electric purple', 'фиолетовый'],
    swatch: { background: '#705096' },
  },
  {
    keywords: [
      'digital violet',
      'wise violet',
      'majestic purple',
      'mysterious purple',
      'night shade',
      'purple plume',
      'violet',
      'purple',
      'фиолетовый',
    ],
    swatch: { background: '#7c3aed' },
  },
  {
    keywords: [
      'aspen green',
      'leaf green',
      'moss green',
      'amber green',
      'jade green',
      'easy green',
      'green',
      'зеленый',
      'зелёный',
    ],
    swatch: { background: '#059669' },
  },
  {
    keywords: [
      'pink',
      'serene pink',
      'bright coral',
      'розовый',
      'нежно-розовый',
      'коралл',
      'coral',
    ],
    swatch: { background: '#ec4899' },
  },
  {
    keywords: [
      'garnet red',
      'claret red',
      'bold ruby',
      'warm red',
      'red',
      'ruby',
      'claret',
      'красный',
      'красно-коричневый',
    ],
    swatch: { background: '#dc2626' },
  },
  {
    keywords: ['terracotta', 'vibrant orange', 'orange', 'оранжевый'],
    swatch: { background: '#ea580c' },
  },
  {
    keywords: [
      'khaki',
      'taupe',
      'bronze',
      'bronze taupe',
      'golden khaki',
      'pebble beige',
      'beige',
      'бежевый',
    ],
    swatch: { background: '#d7c2a7' },
  },
  {
    keywords: ['gray', 'grey', 'pebble grey', 'mystical grey', 'серый'],
    swatch: { background: '#6b7280' },
  },
  {
    keywords: ['zest yellow', 'wishful yellow', 'yellow', 'желтый', 'жёлтый', 'bright'],
    swatch: { background: '#eab308' },
  },
];

const DEFAULT_SWATCH = { background: '#9ca3af' };

export function getDeviceColorSwatch(
  colorName?: string,
  title?: string,
  customHex?: string,
): { background: string; border?: string } {
  if (customHex) {
    return { background: customHex };
  }

  const name = (colorName || title || '').toLowerCase();
  if (!name) return DEFAULT_SWATCH;

  const matched = DEVICE_COLOR_SWATCH_MAP.find((item) =>
    item.keywords.some((keyword) => name.includes(keyword)),
  );

  return matched ? matched.swatch : DEFAULT_SWATCH;
}
