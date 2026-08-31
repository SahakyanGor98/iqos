export const CONTACTS = {
  email: '24iqos.info@gmail.com', // Public contact email
  supportEmail: 'support@24iqos.ru', // Sender email for transactional
  sender: {
    name: 'IQOS STORE',
    email: 'support@24iqos.ru',
  },
  telegram: {
    handle: '@iqos_msk',
    link: 'https://t.me/iqos_ms',
    label: 'Telegram',
  },
  phone: {
    display: '+7 (999) 000-00-00', // Placeholder, update if real one exists
    link: 'tel:+79990000000',
  },
  website: {
    name: 'IQOS STORE',
    url: 'https://24iqos.ru',
  },
};

export const ANALYTICS = {
  yandexMetrikaId: Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID) || 107242786,
};

export const ROUTES = {
  home: '/',
  about: {
    iqos: '/about/iqos',
  },
  catalog: {
    iqos: '/products/iqos',
    terea: '/products/terea',
    accessories: '/products/accessories',
    water: '/products/water',
  },
  tradeIn: '/trade-in',
  contact: '/contact',
  cart: '/cart', // If used
};

export const SOCIALS = [
  {
    name: 'Telegram',
    link: CONTACTS.telegram.link,
    icon: 'telegram', // You can use this key to render icons
  },
];

export const IQOS_LINES: Record<string, string> = {
  i: 'IQOS ILUMA i',
  'i-one': 'IQOS ILUMA i ONE',
  'i prime': 'IQOS ILUMA i PRIME',
  'i x Seletti': 'IQOS ILUMA i x SELETTI',
  'prime i x Seletti': 'IQOS ILUMA PRIME i x SELETTI',
};

export const ENABLE_PROMO = false;

export const DELIVERY_NOTIFICATION_START = '2026-06-19';
export const DELIVERY_NOTIFICATION_END = '2026-07-01';
