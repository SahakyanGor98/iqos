import {
  AgeVerification,
  DeliveryNoticeToast,
  FloatingPromo,
  FooterContent,
  Navbar,
  PromoToast,
  TelegramFloat,
  WaterBanner,
  YandexMetrika,
} from '@/components';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsProvider';
import { getSiteSettingsMap } from '@/lib/settings';

/**
 * Public marketing site shell (nav, footer, toasts, age gate). Lives in the
 * (site) route group so the /admin area — which uses its own bare shell — never
 * inherits this chrome. Rendered as flex children of the app-shell <body>.
 *
 * CMS feature flags are read once here (ISR-safe, cookie-free — see
 * .ai/architecture.md) and drive the banners plus the accessories nav/footer
 * links. A toggle in /admin/settings invalidates the shared cache tag and this
 * layout, so changes surface on the next request.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettingsMap();

  const pages = {
    accessories: settings.page_accessories,
    compare: settings.page_compare,
    tradein: settings.page_tradein,
    about: settings.page_about,
    contact: settings.page_contact,
  };

  return (
    <FeatureFlagsProvider flags={pages}>
      <YandexMetrika />
      <AgeVerification />
      <PromoToast />
      <TelegramFloat />
      {settings.banner_floating_promo ? <FloatingPromo /> : null}
      <DeliveryNoticeToast />
      <Navbar pages={pages} />
      <main id='main-content' className='flex-1 overflow-y-auto'>
        {settings.banner_water ? <WaterBanner /> : null}
        {children}
        <FooterContent pages={pages} />
      </main>
      {/* Disclaimer: always visible — body is h-screen, main scrolls internally */}
      <footer className='w-full bg-[#272a32] text-white py-3 text-center px-4 flex-shrink-0'>
        <p className='text-[9px] md:text-sm font-bold uppercase tracking-widest text-neutral-400'>
          МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ. Данный продукт не исключает риски.
          Аэрозоль содержит никотин, вызывающий зависимость.
        </p>
      </footer>
    </FeatureFlagsProvider>
  );
}
