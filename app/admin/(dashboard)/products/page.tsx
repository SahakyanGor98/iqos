import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Plus, Search } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { getAdminProducts } from '@/lib/admin-products';
import {
  type AdminProduct,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  type ProductCategory,
} from '@/lib/product-form';

export const metadata: Metadata = {
  title: 'Товары',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const activeCategory: ProductCategory | null = (PRODUCT_CATEGORIES as readonly string[]).includes(
    category ?? '',
  )
    ? (category as ProductCategory)
    : null;
  const query = (q ?? '').trim().toLowerCase();

  const all = await getAdminProducts();
  let products = activeCategory ? all.filter((p) => p.category === activeCategory) : all;
  if (query) {
    products = products.filter(
      (p) => p.title.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query),
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap gap-2'>
          <CategoryChip
            href='/admin/products'
            active={!activeCategory}
            label='Все'
            count={all.length}
          />
          {PRODUCT_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              href={`/admin/products?category=${c}`}
              active={activeCategory === c}
              label={PRODUCT_CATEGORY_LABELS[c]}
              count={all.filter((p) => p.category === c).length}
            />
          ))}
        </div>
        <Link
          href='/admin/products/new'
          className='flex items-center gap-2 rounded-lg bg-[#34303d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black'
        >
          <Plus className='h-4 w-4' /> Создать товар
        </Link>
      </div>

      {/* Search (preserves the active category) */}
      <form className='relative max-w-sm'>
        {activeCategory ? <input type='hidden' name='category' value={activeCategory} /> : null}
        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400' />
        <input
          type='search'
          name='q'
          defaultValue={q ?? ''}
          placeholder='Поиск по названию или slug…'
          className='w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#34303d]'
        />
      </form>

      {products.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center'>
          <p className='text-lg font-bold text-[#34303d]'>Товары не найдены</p>
          <p className='mt-1 text-sm text-neutral-500'>Измените фильтр или создайте новый товар.</p>
        </div>
      ) : (
        <ul className='flex flex-col gap-2'>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
        active ? 'bg-[#34303d] text-white' : 'text-neutral-600 hover:bg-gray-100',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 text-xs',
          active ? 'bg-white/20 text-white' : 'bg-gray-200 text-neutral-600',
        )}
      >
        {count}
      </span>
    </Link>
  );
}

function ProductRow({ product }: { product: AdminProduct }) {
  const thumb = product.image?.[0];

  return (
    <li>
      <Link
        href={`/admin/products/${product.id}`}
        className='flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 transition-colors hover:border-[#34303d]/30 hover:bg-gray-50'
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=''
            className='h-12 w-12 shrink-0 rounded-lg border border-gray-100 object-cover'
          />
        ) : (
          <div className='h-12 w-12 shrink-0 rounded-lg border border-dashed border-gray-300 bg-gray-50' />
        )}
        <div className='min-w-0 flex-1'>
          <p className='truncate font-semibold text-[#34303d]'>{product.title}</p>
          <p className='truncate text-xs text-neutral-400'>{product.slug}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            product.in_stock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-neutral-500',
          )}
        >
          {product.in_stock ? 'В наличии' : 'Нет'}
        </span>
        <p className='w-24 shrink-0 text-right font-semibold text-[#34303d]'>
          {formatPrice(product.price)}
        </p>
        <ChevronRight className='h-4 w-4 shrink-0 text-neutral-300' />
      </Link>
    </li>
  );
}
