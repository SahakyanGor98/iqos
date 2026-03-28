import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const christFont = localFont({
  src: '../assets/christ.100.ttf',
  variable: '--font-christ',
});

import {
  AgeVerification,
  Footer,
  Navbar,
  PromoToast,
  TelegramFloat,
  YandexMetrika,
} from '@/components';

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
    icon: '/icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IQOS & TEREA Shop',
  url: 'https://24iqos.ru',
  logo: 'https://24iqos.ru/icon.png',
};

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
      <body className={`antialiased min-h-screen flex flex-col font-sans ${christFont.variable}`}>
        <YandexMetrika />
        <AgeVerification />
        <PromoToast />
        <TelegramFloat />
        <Navbar />
        <main className='flex-grow'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
