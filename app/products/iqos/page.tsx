import { getProducts } from '@/lib/api';
import { ProductGrid, ProductFilters, Pagination, SortSelect } from '@/components';

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

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const { data: products, count } = await getProducts({
    category: 'gadget',
    page,
    limit: 12,
    sort: params.sort as string,
    priceRange: { min: minPrice, max: maxPrice },
    filters: {
      color: params.color as string,
    },
  });

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
  ];

  return (
    <div className='container mx-auto p-4 flex flex-col md:flex-row gap-8'>
      <aside className='w-full md:mt-16 md:w-64'>
        <ProductFilters sections={filterSections} />
      </aside>

      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Устройства IQOS</h1>
          <SortSelect />
        </div>
        <ProductGrid products={products} />
        <Pagination totalItems={count || 0} itemsPerPage={12} />
      </div>
    </div>
  );
}
