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
    default: 'IQOS & TEREA - Купить стики и устройства',
  },
  description:
    'Официальные устройства IQOS и стики TEREA. Большой выбор вкусов, быстрая доставка, гарантия качества.',
  openGraph: {
    title: 'IQOS & TEREA - Магазин оригинальных устройств и стиков',
    description: 'Широкий ассортимент устройств IQOS и стиков TEREA. Доставка по городу.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'IQOS Shop',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
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
