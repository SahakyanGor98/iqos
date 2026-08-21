import { getProducts } from '@/lib/api';
import { Pagination, PerPageSelect, ProductGrid, SortSelect } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Питьевая вода | IQOS Shop',
  description:
    'Чистейшая природная питьевая вода в блоках по 12 штук. Быстрая доставка по Москве и области.',
  openGraph: {
    title: 'Природная Питьевая Вода - Купить в блоках по 12 шт.',
    description: 'Чистейшая природная питьевая вода. Поставляется в блоках по 12 бутылок.',
  },
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function WaterPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const { data: products, count } = await getProducts({
    category: 'water',
    page,
    limit,
    sort: params.sort as string,
    priceRange: { min: minPrice, max: maxPrice },
    inStock: params.inStock === 'true',
  });

  return (
    <div className='container mx-auto p-4 flex flex-col gap-8'>
      {/* Hero Header */}
      <section className='text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-100 px-4'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-2 text-neutral-900'>
          Питьевая вода
        </h1>
        <p className='text-neutral-600 text-sm md:text-base max-w-2xl mx-auto'>
          Чистейшая питьевая вода в блоках по 12 штук. Натуральная минерализация и идеальный освежающий вкус.
        </p>
      </section>

      {/* Main Content */}
      <main className='flex-1'>
        {/* Controls Header */}
        <div className='flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-neutral-200'>
          <p className='text-sm text-neutral-500 font-medium'>
            Найдено товаров: <span className='text-neutral-900 font-bold'>{count}</span>
          </p>

          <div className='flex items-center gap-3'>
            <SortSelect />
            <PerPageSelect />
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />

        {/* Pagination */}
        <div className='mt-8'>
          <Pagination totalItems={count} itemsPerPage={limit} />
        </div>
      </main>
    </div>
  );
}
