import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const christFont = localFont({
  src: '../assets/christ.100.ttf',
  variable: '--font-christ',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://24iqos.ru'),
  title: {
    template: '%s | IQOS & TEREA',
    default: 'IQOS & TEREA - Купить стики и устройства в Москве',
  },
  description:
    'Официальные устройства IQOS и стики TEREA. Большой выбор вкусов, быстрая доставка по Москве и области, гарантия качества.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'IQOS & TEREA - Магазин оригинальных устройств и стиков',
    description: 'Широкий ассортимент устройств IQOS и стиков TEREA. Доставка по городу.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'IQOS Shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IQOS & TEREA - Магазин оригинальных устройств и стиков',
    description: 'Широкий ассортимент устройств IQOS и стиков TEREA.',
  },
  icons: {
    icon: '/icon8.webp',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IQOS & TEREA Shop',
  url: 'https://24iqos.ru',
  logo: 'https://24iqos.ru/icon.webp',
};

/**
 * Root layout — the ONLY layout that owns <html>/<body>. It provides the global
 * head, fonts, and the app-shell body (full-viewport flex column). The visual
 * chrome is intentionally NOT here: the marketing site's nav/footer live in the
 * (site) group layout, and /admin has its own bare shell. Each group layout
 * fills this flex-column body.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`antialiased h-[100dvh] overflow-hidden flex flex-col font-sans bg-[#fffdfb] text-[#34303d] ${christFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
