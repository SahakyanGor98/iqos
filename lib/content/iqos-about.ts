export const IQOS_ABOUT_IMAGES = {
  entry: '/about/entry.webp',
  hero: '/about/hero.webp',
  intro: '/about/intro.webp',
  heatedTobacco: '/about/heated-tobacco.webp',
  science: '/about/science.webp',
  teaser: '/about/teaser.webp',
  history: '/about/history.webp',
  historyMobile: '/about/history-mobile.webp',
  stickConstruction: '/about/constructtionOfStick.webp',
} as const;

export const IQOS_HOME_TEASER = {
  title: 'Что такое IQOS?',
  subtitle: 'Бездымная альтернатива курению. Думаете о переходе?',
  ctaLabel: 'Узнать больше',
  ctaHref: '/about/iqos',
} as const;

export type IqosAboutSectionLayout = 'default' | 'text-only' | 'background-right';

export type IqosAboutSection = {
  id: string;
  title: string;
  paragraphs: string[];
  footnotes?: string[];
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
  layout?: IqosAboutSectionLayout;
  backgroundImage?: string;
  backgroundImageMobile?: string;
  imageClassName?: string;
};

export const IQOS_ABOUT_SECTIONS: IqosAboutSection[] = [
  {
    id: 'why-iqos',
    title: 'Почему появился IQOS?',
    paragraphs: [
      'Десятилетиями единственным способом употребления табака было его сжигание.',
      'Однако именно процесс горения является основной причиной образования большинства вредных веществ в сигаретном дыме.',
      'Philip Morris International поставила перед собой цель создать инновационную альтернативу — продукт, позволяющий совершеннолетним курильщикам получать никотин и вкус настоящего табака без горения, дыма и пепла.',
    ],
    image: IQOS_ABOUT_IMAGES.teaser,
    imageAlt: 'История и миссия создания IQOS',
    reverse: false,
  },
  {
    id: 'aerosol-science',
    title: 'Что представляет собой аэрозоль IQOS?',
    paragraphs: [
      'Аэрозоль IQOS — это смесь мельчайших частиц и газов, содержащая никотин, воду, глицерин и натуральные ароматические вещества табака.',
      'В отличие от сигаретного дыма, аэрозоль образуется при бесконтактном нагревании табака без воспламенения и не оставляет въевшегося сигаретного запаха на одежде, коврах и волосах.',
    ],
    footnotes: [
      'Важная информация: это не означает, что IQOS безопасен или полностью исключает риск. Продукт содержит никотин, вызывающий зависимость.',
    ],
    image: IQOS_ABOUT_IMAGES.science,
    imageAlt: 'Аэрозоль IQOS и натуральные вещества табака',
    reverse: true,
  },
  {
    id: 'history',
    title: 'История развития IQOS',
    paragraphs: [
      'Работа над технологией началась в 2008 году с участием сотен инженеров, химиков, биологов и врачей.',
      'Многомиллиардные инвестиции в R&D привели к выпуску первых устройств в 2014 году. Позже появились поколения IQOS 2.4, IQOS 3, DUO, ORIGINALS, а затем индукционная линейка IQOS ILUMA и семейство IQOS ILUMA i.',
      'Каждое поколение улучшало качество нагрева, удобство и надежность. Сегодня более 22 миллионов взрослых курильщиков по всему миру выбрали IQOS.',
    ],
    footnotes: [
      'Данные отчетности PMI по состоянию на 2024 год. Пользователи продуктов PMI с технологией нагревания табака, полностью отказавшиеся от сигарет.',
    ],
    layout: 'background-right',
    backgroundImage: IQOS_ABOUT_IMAGES.history,
    backgroundImageMobile: IQOS_ABOUT_IMAGES.historyMobile,
    imageAlt: 'История развития IQOS',
  },
];

// Table Comparison: Cigarettes vs IQOS
export interface ComparisonRow {
  feature: string;
  cigarette: string;
  iqos: string;
}

export const CIGARETTE_VS_IQOS_TABLE: ComparisonRow[] = [
  {
    feature: 'Процесс',
    cigarette: 'Табак сгорает (>600°C)',
    iqos: 'Табак нагревается (~300–350°C)',
  },
  {
    feature: 'Выделение',
    cigarette: 'Образуется плотный дым',
    iqos: 'Образуется табачный аэрозоль',
  },
  {
    feature: 'Огонь и пепел',
    cigarette: 'Есть источник огня и пепел',
    iqos: 'Нет огня, нет пепла',
  },
  {
    feature: 'Запах',
    cigarette: 'Сильный въедающийся запах',
    iqos: 'Запах значительно менее выражен',
  },
  {
    feature: 'Вредные вещества',
    cigarette: 'Образуется огромное количество продуктов горения (смолы, CO)',
    iqos: 'Количество многих вредных веществ значительно ниже',
  },
];

// Comparison: E-Cigarettes vs IQOS
export const ECIG_VS_IQOS = {
  iqos: {
    title: 'IQOS',
    points: [
      'Использует настоящий табачный лист',
      'Нагревает натуральный табак',
      'Передает аутентичный вкус настоящего табака',
    ],
  },
  ecig: {
    title: 'Электронные сигареты (вейпы)',
    points: [
      'Используют жидкость с ароматизаторами',
      'Испаряют жидкость при помощи спирали',
      'Не содержат натурального табачного листа',
    ],
  },
};

// SMARTCORE INDUCTION SYSTEM Benefits
export const SMARTCORE_BENEFITS = [
  {
    title: 'Без нагревательного лезвия',
    description:
      'Внутри устройства больше нет хрупкого керамического лезвия — больше нечему ломаться.',
  },
  {
    title: 'Нулевая чистка',
    description:
      'Стики TEREA запаяны с обеих сторон. Частицы табака не выпадают внутрь держателя, устройство не требует чистки от нагара.',
  },
  {
    title: 'Индукционный элемент',
    description:
      'Внутри каждого стика TEREA встроен металлический элемент, нагреваемый индукционным электромагнитным полем.',
  },
  {
    title: 'Равномерный прогрев',
    description:
      'Табак прогревается изнутри максимально равномерно, раскрывая чистый вкус от первой до последней затяжки.',
  },
];

// TEREA Flavors Categories
export const TEREA_CATEGORIES = [
  { name: 'Классический табак', desc: 'Насыщенные и сбалансированные табачные бленды' },
  { name: 'Мягкий табак', desc: 'Легкие табачные ноты с мягким послевкусием' },
  { name: 'Охлаждающий ментол', desc: 'Освежающие мятные и ментоловые оттенки' },
  { name: 'Фруктовые комбинации', desc: 'Ягодные и цитрусовые ароматические акценты' },
];

// Key Facts Summary Grid
export const IQOS_KEY_FACTS = [
  'IQOS нагревает табак, а не сжигает его.',
  'В устройстве используется настоящий табачный лист.',
  'Вместо сигаретного дыма образуется аэрозоль.',
  'Отсутствуют огонь, угарный газ и пепел.',
  'Запах на руках и одежде значительно менее выражен.',
  'IQOS не является безопасным продуктом и содержит никотин.',
  'Продукт предназначен исключительно для совершеннолетних курильщиков.',
  'Полный отказ от табака и никотина остаётся лучшим выбором для здоровья.',
];

export const IQOS_DEVICE_LINEUP = [
  {
    line: 'i prime',
    name: 'IQOS ILUMA i PRIME',
    description: 'Премиальная модель из высококачественных материалов с расширенным функционалом.',
    ctaLabel: 'Узнать больше',
    fallbackSlug: 'iqos-iluma-i-prime-aspen-green',
    fallbackImage: '/ILUMA_i_Prime.webp',
  },
  {
    line: 'i',
    name: 'IQOS ILUMA i',
    description: 'Основная модель серии — идеальный баланс технологий, сенсорного экрана и стиля.',
    ctaLabel: 'Узнать больше',
    fallbackSlug: 'iqos-iluma-i-midnight-black',
    fallbackImage: '/devices1.webp',
  },
  {
    line: 'i-one',
    name: 'IQOS ILUMA i ONE',
    description: 'Компактный моноблок «всё в одном», рассчитанный на 20 сеансов без подзарядки.',
    ctaLabel: 'Узнать больше',
    fallbackSlug: 'iqos-iluma-i-one-breeze-blue',
    fallbackImage:
      'https://sjqoinxhewxxbcczliyl.supabase.co/storage/v1/object/public/illuma/Iqos%20Iluma%20i%20One%20Breeze%20Blue.webp',
  },
] as const;

export const IQOS_DISCLAIMERS = [
  'Данная продукция не исключает всех рисков. Аэрозоль содержит никотин, который вызывает привыкание. Только для использования совершеннолетними лицами.',
  'IQOS ILUMA™ предназначен для использования только со стиками TEREA™. Не используйте IQOS ILUMA™ с HEETS™, а также стики TEREA™ с предыдущими поколениями IQOS™.',
] as const;
