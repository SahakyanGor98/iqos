import { getProducts } from '@/lib/api';
import { ProductGrid, ProductFilters, Pagination, SortSelect } from '@/components';

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

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const { data: products, count } = await getProducts({
    category: 'sticks',
    page,
    limit: 12,
    sort: params.sort as string,
    priceRange: { min: minPrice, max: maxPrice },
    filters: {
      flavors: params.flavors as string,
      strength: params.strength as string,
      hasCapsule: params.hasCapsule as string,
    },
  });

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
      id: 'hasCapsule',
      label: 'С капсулой',
      type: 'boolean' as const,
    },
  ];

  return (
    <div className='container mx-auto p-4 flex flex-col md:flex-row gap-8'>
      <aside className='w-full md:mt-16 md:w-64'>
        <ProductFilters sections={filterSections} />
      </aside>

      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Стики Terea</h1>
          <SortSelect />
        </div>
        <ProductGrid products={products} />
        <Pagination totalItems={count || 0} itemsPerPage={12} />
      </div>
    </div>
  );
}
