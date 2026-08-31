import { getProducts } from '@/lib/api';
import { Pagination, PerPageSelect, ProductFilters, ProductGrid, SortSelect } from '@/components';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Стики TEREA | Большой выбор вкусов',
  description:
    'Купить стики TEREA для IQOS ILUMA. Все вкусы в наличии: от классических табачных до освежающих фруктовых.',
  openGraph: {
    title: 'Стики TEREA для IQOS ILUMA - Все вкусы',
    description: 'Оригинальные стики TEREA. Широкий ассортимент. Доставка.',
  },
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TereaPage({ searchParams }: Props) {
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
      id: 'strength',
      label: 'Крепость',
      type: 'checkbox' as const,
      options: [
        { label: 'Легкий', value: 'легкий' },
        { label: 'Средний', value: 'средний' },
        { label: 'Крепкий', value: 'крепкий' },
      ],
    },
    {
      id: 'flavors',
      label: 'Вкус',
      type: 'checkbox' as const,
      options: [
        { label: 'Ментол', value: 'Ментол' },
        { label: 'Табачный вкус', value: 'Табачный вкус' },
        { label: 'Фруктовый вкус', value: 'Фруктовый вкус' },
        { label: 'Экзотические', value: 'Экзотические' },
      ],
    },
    {
      id: 'origin',
      label: 'Страна производства',
      type: 'checkbox' as const,
      options: [
        { label: 'Армения', value: 'armenia' },
        { label: 'Казахстан', value: 'kazakhstan' },
        { label: 'Россия', value: 'russia' },
      ],
    },
    {
      id: 'hasCapsule',
      label: 'С капсулой',
      type: 'boolean' as const,
    },
    {
      id: 'inStock',
      label: 'В наличии',
      type: 'boolean' as const,
    },
  ];

  const { data: products, count } = await getProducts({
    category: 'sticks',
    page,
    limit,
    sort: params.sort as string,
    priceRange: { min: minPrice, max: maxPrice },
    inStock: params.inStock === 'true',
    filters: {
      flavors: params.flavors as string | string[],
      strength: params.strength as string | string[],
      hasCapsule: params.hasCapsule as string | string[],
      origin: params.origin as string | string[],
    },
  });

  return (
    <div className='container mx-auto p-4 flex flex-col md:flex-row gap-8'>
      {/* Desktop Sidebar */}
      <aside className='hidden md:block md:mt-16 md:w-64'>
        <ProductFilters sections={filterSections} />
      </aside>

      <div className='flex-1'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <h1 className='text-2xl font-bold'>Стики TEREA</h1>

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

        <ProductGrid products={products} />
        <Pagination totalItems={count || 0} itemsPerPage={limit} />
        <div className='flex justify-center mt-8'>
          <PerPageSelect />
        </div>
      </div>
    </div>
  );
}
