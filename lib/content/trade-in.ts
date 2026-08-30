export const DEFAULT_TRADE_IN_DISCOUNT = 1500;

export interface OldDeviceOption {
  id: string;
  name: string;
  baseDiscount?: number; // Discount in RUB. If omitted, DEFAULT_TRADE_IN_DISCOUNT is used
  badge?: string;
  description: string;
  image: string;
}

export const getDeviceDiscount = (device: OldDeviceOption): number => {
  return device.baseDiscount ?? DEFAULT_TRADE_IN_DISCOUNT;
};

export interface TargetDeviceOption {
  id: string;
  line: string;
  name: string;
  slug: string;
  fullPrice: number; // Original price in RUB
  image: string;
  tagline: string;
  features: string[];
}

export const OLD_DEVICES: OldDeviceOption[] = [
  {
    id: 'iqos-3-duo',
    name: 'IQOS 3 DUO',
    baseDiscount: 2500,
    badge: 'Популярно',
    description: 'Легендарное устройство с двойным сеансом',
    image: '/iqos.webp',
  },
  {
    id: 'iqos-3-multi',
    name: 'IQOS 3 MULTI',
    baseDiscount: 2000,
    description: 'Компактное моноустройство',
    image: '/about/intro.webp',
  },
  {
    id: 'iqos-24-plus',
    name: 'IQOS 2.4 / 2.4 Plus',
    // Uses default discount (1500 ₽)
    description: 'Классическая модель IQOS',
    image: '/smokeIqos.webp',
  },
  {
    id: 'iqos-3',
    name: 'IQOS 3',
    // Uses default discount (1500 ₽)
    description: 'Стандартная модель третьего поколения',
    image: '/iqos.webp',
  },
  {
    id: 'lil-solid',
    name: 'lil SOLID / lil SOLID 2.0',
    baseDiscount: 1800,
    description: 'Устройство с нагревательным стержнем',
    image: '/about/IQOS_lilSOLIDEz.webp',
  },
  {
    id: 'lil-solid-ez',
    name: 'lil SOLID Ez',
    // Uses default discount (1500 ₽)
    description: 'Компактная версия lil SOLID',
    image: '/about/IQOS_lilSOLIDEz.webp',
  },
  {
    id: 'iqos-iluma-one',
    name: 'IQOS ILUMA ONE',
    baseDiscount: 2200,
    description: 'Моноблок с технологией SMARTCORE',
    image: '/devices1.webp',
  },
  {
    id: 'iqos-iluma',
    name: 'IQOS ILUMA (предыдущая версия)',
    baseDiscount: 2500,
    description: 'Стандартная модель серии ILUMA',
    image: '/devices2.webp',
  },
  {
    id: 'glo-all',
    name: 'Glo (Hyper / Pro / Series)',
    // Uses default discount (1500 ₽)
    description: 'Устройства нагрева табака системы Glo',
    image: '/about/heated-tobacco.webp',
  },
  {
    id: 'other-device',
    name: 'Другая модель / Электронная сигарета',
    // Uses default discount (1500 ₽)
    description: 'Принимаем устройства любых производителей',
    image: '/about/teaser.webp',
  },
];

export const TARGET_DEVICES: TargetDeviceOption[] = [
  {
    id: 'iluma-i-one',
    line: 'i-one',
    name: 'IQOS ILUMA i ONE',
    slug: 'iqos-iluma-i-one',
    fullPrice: 7990,
    image: '/devices1.webp',
    tagline: 'Компактный моноблок до 20 сеансов без подзарядки',
    features: ['SMARTCORE INDUCTION SYSTEM™', 'Без чистки и лезвия', 'Функция FlexPuff'],
  },
  {
    id: 'iluma-i',
    line: 'i',
    name: 'IQOS ILUMA i',
    slug: 'iqos-iluma-i',
    fullPrice: 11990,
    image: '/devices2.webp',
    tagline: 'Инновационный сенсорный экран и режим паузы',
    features: ['Сенсорный дисплей Touch Screen', 'Режим паузы FlexPuff', 'Без лезвий и без нагара'],
  },
  {
    id: 'iluma-i-prime',
    line: 'i prime',
    name: 'IQOS ILUMA i PRIME',
    slug: 'iqos-iluma-i-prime',
    fullPrice: 16990,
    image: '/ILUMA_i_Prime.webp',
    tagline: 'Премиальный алюминиевый корпус и матерчатый чехол',
    features: ['Флагманский дизайн', 'Touch Screen & FlexPuff', 'Смарт-зарядка на 3 сеанса'],
  },
];

export const TRADE_IN_STEPS = [
  {
    step: '01',
    title: 'Выберите устройства',
    description:
      'Укажите модель вашего старого устройства в онлайн-калькуляторе и выберите новый IQOS ILUMA.',
  },
  {
    step: '02',
    title: 'Оформите заявку за 1 минуту',
    description:
      'Заполните имя и номер телефона. Наш специалист свяжется с вами для подтверждения обмена.',
  },
  {
    step: '03',
    title: 'Простой обмен при получении',
    description:
      'Передайте старое устройство курьеру или в точке выдачи и получите новый IQOS ILUMA со скидкой.',
  },
];

export const TRADE_IN_BENEFITS = [
  {
    icon: 'sparkles',
    title: 'Скидка до 2 500 ₽',
    description:
      'Максимально выгодный обмен старых моделей IQOS и lil SOLID на новые флагманы ILUMA i.',
  },
  {
    icon: 'leaf',
    title: 'Экологичная утилизация',
    description:
      'Все сданные старые девайсы отправляются на профессиональную переработку и утилизацию.',
  },
  {
    icon: 'zap',
    title: 'Без лишней бюрократии',
    description:
      'Не нужны чеки или заводская коробка — просто сдайте сам девайс и получите скидку.',
  },
];

import { FaqItem } from './faq';

export const TRADE_IN_FAQ: FaqItem[] = [
  {
    id: 'tradein-1',
    question: 'В каком состоянии можно сдать старое устройство?',
    answer:
      'Мы принимаем устройства IQOS, lil SOLID и других брендов в любом состоянии — как полностью рабочие, так и с царапинами, повреждениями корпуса или нерабочим аккумулятором/лезвием.',
  },
  {
    id: 'tradein-2',
    question: 'Нужна ли коробка, зарядный кабель или документы?',
    answer:
      'Нет, комплектность не обязательна. Вы можете сдать только сам держатель и зарядный кейс (или моноблок). Коробка и документы не требуются.',
  },
  {
    id: 'tradein-3',
    question: 'Как происходит процесс обмена при доставке?',
    answer:
      'При выборе курьерской доставки вы передаете старое устройство курьеру прямо в момент вручения вашего нового IQOS ILUMA и оплачиваете сумму уже с учетом рассчитанной скидки.',
  },
  {
    id: 'tradein-4',
    question: 'Можно ли сдать сразу несколько старых устройств?',
    answer:
      'Да, вы можете сдать 2 и более устройств. Наш менеджер при подтверждении заказа рассчитает суммарную скидку на покупку нового девайса.',
  },
  {
    id: 'tradein-5',
    question: 'Чем IQOS ILUMA лучше предыдущих поколений IQOS?',
    answer:
      'В IQOS ILUMA используется индукционная технология SMARTCORE INDUCTION SYSTEM™ без нагревательного лезвия. Девайс не требует чистки, в нем нечему ломаться, и отсутствует запах табачного нагара.',
  },
];
