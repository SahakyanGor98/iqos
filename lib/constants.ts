export const CONTACTS = {
  email: '24iqos.info@gmail.com', // Public contact email
  supportEmail: 'support@24iqos.ru', // Sender email for transactional
  sender: {
    name: 'IQOS STORE',
    email: 'support@24iqos.ru',
  },
  telegram: {
    handle: '@iqos_msk',
    link: 'https://t.me/iqos_msk',
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

export const ROUTES = {
  home: '/',
  catalog: {
    iqos: '/products/iqos',
    terea: '/products/terea',
  },
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
