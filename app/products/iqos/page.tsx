import { getProducts } from '@/lib/api';
import { getGroupedCards } from '@/lib/grouping';
import { Pagination, PerPageSelect, ProductFilters, ProductGrid, SortSelect } from '@/components';
import { IQOS_LINES } from '@/lib/constants';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Устройства IQOS | Купить оригинал',
  description:
    'Каталог оригинальных устройств IQOS. ILUMA, ILUMA ONE, ILUMA PRIME. Выберите свой цвет и модель.',
  openGraph: {
    title: 'Каталог устройств IQOS - Оригинал, Гарантия',
    description: 'Все модели IQOS в наличии. Быстрая доставка по городу. Гарантия качества.',
  },
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function IqosPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 25;

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const filterSections = [
    {
      id: 'price',
      label: 'Цена',
      type: 'range' as const,
    },
    {
      id: 'color',
      label: 'Цвет',
      type: 'checkbox' as const,
      options: [
        { label: 'Зеленый', value: 'Зеленый' },
        { label: 'Серый', value: 'Серый' },
        { label: 'Синий', value: 'Синий' },
        { label: 'Золотой', value: 'Золотой' },
        { label: 'Красный', value: 'Красный' },
      ],
    },
    {
      id: 'line',
      label: 'Модель',
      type: 'checkbox' as const,
      options: Object.entries(IQOS_LINES).map(([value, label]) => ({
        label,
        value,
      })),
    },
    {
      id: 'inStock',
      label: 'В наличии',
      type: 'boolean' as const,
    },
  ];

  const { data: allProducts } = await getProducts({
    category: 'gadget',
    page: 1,
    limit: 500,
    sort: params.sort as string,
    priceRange: { min: minPrice, max: maxPrice },
    inStock: params.inStock === 'true',
    filters: {
      color: params.color as string | string[],
      line: params.line as string | string[],
    },
  });

  const allCards = getGroupedCards(allProducts);
  const totalCardsCount = allCards.length;
  const paginatedCards = allCards.slice((page - 1) * limit, page * limit);

  return (
    <div className='container mx-auto p-4 flex flex-col md:flex-row gap-8'>
      {/* Desktop Sidebar */}
      <aside className='hidden md:block md:mt-16 md:w-64'>
        <ProductFilters sections={filterSections} />
      </aside>

      <div className='flex-1'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <h1 className='text-2xl font-bold'>Устройства IQOS</h1>

          {/* Controls Row */}
          <div className='flex items-center justify-between gap-2 w-full md:w-auto'>
            {/* Mobile Filter Button */}
            <div className='md:hidden'>
              <ProductFilters sections={filterSections} />
            </div>
            {/* Sort Icon Button */}
            <div>
              <SortSelect />
            </div>
          </div>
        </div>

        <ProductGrid cards={paginatedCards} />
        <Pagination totalItems={totalCardsCount} itemsPerPage={limit} />
        <div className='flex justify-center mt-8'>
          <PerPageSelect />
        </div>
      </div>
    </div>
  );
}
