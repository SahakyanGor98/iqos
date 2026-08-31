import {
  AgeVerification,
  DeliveryNoticeToast,
  FooterContent,
  Navbar,
  PromoToast,
  TelegramFloat,
  YandexMetrika,
} from '@/components';

/**
 * Public marketing site shell (nav, footer, toasts, age gate). Lives in the
 * (site) route group so the /admin area — which uses its own bare shell — never
 * inherits this chrome. Rendered as flex children of the app-shell <body>.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <YandexMetrika />
      <AgeVerification />
      <PromoToast />
      <TelegramFloat />
      <DeliveryNoticeToast />
      <Navbar />
      <main id='main-content' className='flex-1 overflow-y-auto'>
        {children}
        <FooterContent />
      </main>
      {/* Disclaimer: always visible — body is h-screen, main scrolls internally */}
      <footer className='w-full bg-[#272a32] text-white py-3 text-center px-4 flex-shrink-0'>
        <p className='text-[9px] md:text-sm font-bold uppercase tracking-widest text-neutral-400'>
          МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ. Данный продукт не исключает риски.
          Аэрозоль содержит никотин, вызывающий зависимость.
        </p>
      </footer>
    </>
  );
}
