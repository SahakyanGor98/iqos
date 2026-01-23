import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '@/components';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
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
      <body className={`${outfit.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <Navbar />
        <main className='flex-grow'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
