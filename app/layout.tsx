import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { LoadingProvider } from '@/context/LoadingContext';
import {
  AgeVerification,
  // FloatingPromo,
  FooterContent,
  // GlobalLoader,
  Navbar,
  PromoToast,
  TelegramFloat,
  YandexMetrika,
} from '@/components';
// import { ENABLE_PROMO } from '@/lib/constants';
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
      <body className={`antialiased h-[100dvh] overflow-hidden flex flex-col font-sans ${christFont.variable}`}>
        <LoadingProvider>
          {/* <GlobalLoader /> */}
          <YandexMetrika />
          <AgeVerification />
          <PromoToast />
          <TelegramFloat />
          {/* {ENABLE_PROMO && <FloatingPromo />} */}
          <Navbar />
          <main id='main-content' className='flex-1 overflow-y-auto'>
            {children}
            <FooterContent />
          </main>
          {/* Disclaimer: always visible — body is h-screen, main scrolls internally */}
          <footer className='w-full bg-[#272a32] text-white py-3 text-center px-4 flex-shrink-0'>
            <p className='text-[9px] md:text-sm font-bold uppercase tracking-widest text-neutral-400'>
              МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ. Данный продукт не исключает риски. Аэрозоль содержит никотин, вызывающий зависимость.
            </p>
          </footer>
        </LoadingProvider>
      </body>
    </html>
  );
}
