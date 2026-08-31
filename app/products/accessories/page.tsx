import { getProducts } from '@/lib/api';
import { getGroupedCards } from '@/lib/grouping';
import { Pagination, PerPageSelect, ProductFilters, ProductGrid, SortSelect } from '@/components';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ENABLE_ACCESSORIES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Аксессуары IQOS | Чехлы, колпачки, зарядные устройства',
  description:
    'Каталог оригинальных аксессуаров для устройств IQOS. Чехлы, сменные панели, колпачки, зарядные станции и аксессуары для чистки.',
  openGraph: {
    title: 'Каталог аксессуаров IQOS - Оригинальные аксессуары',
    description:
      'Широкий выбор оригинальных аксессуаров для IQOS ILUMA. Персонализируйте свое устройство.',
  },
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AccessoriesPage({ searchParams }: Props) {
  if (!ENABLE_ACCESSORIES) notFound();
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
        { label: 'Черный', value: 'Черный' },
        { label: 'Серый / Серебряный', value: 'Серый' },
        { label: 'Синий', value: 'Синий' },
        { label: 'Зеленый', value: 'Зеленый' },
        { label: 'Золотой / Бежевый', value: 'Золотой' },
        { label: 'Коралловый / Красный', value: 'Красный' },
      ],
    },
    {
      id: 'type',
      label: 'Тип аксессуара',
      type: 'checkbox' as const,
      options: [
        { label: 'Чехлы и панели', value: 'Чехлы и панели' },
        { label: 'Колпачки', value: 'Колпачки' },
        { label: 'Зарядные устройства', value: 'Зарядные устройства' },
        { label: 'Чистка и уход', value: 'Чистка и уход' },
      ],
    },
    {
      id: 'compatibility',
      label: 'Совместимость',
      type: 'checkbox' as const,
      options: [
        { label: 'IQOS ILUMA i', value: 'IQOS ILUMA i' },
        { label: 'IQOS ILUMA i ONE', value: 'IQOS ILUMA i ONE' },
        { label: 'IQOS ILUMA i PRIME', value: 'IQOS ILUMA i PRIME' },
      ],
    },
    {
      id: 'inStock',
      label: 'В наличии',
      type: 'boolean' as const,
    },
  ];

  const { data: allProducts } = await getProducts({
    category: 'accessories',
    page: 1,
    limit: 500,
    sort: params.sort as string,
    priceRange: { min: minPrice, max: maxPrice },
    inStock: params.inStock === 'true',
    filters: {
      color: params.color as string | string[],
      type: params.type as string | string[],
      compatibility: params.compatibility as string | string[],
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
          <h1 className='text-2xl font-bold'>Аксессуары IQOS</h1>

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
