'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type AdminProduct,
  EDITABLE_BADGES,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  type ProductCategory,
  productInputSchema,
} from '@/lib/product-form';
import { createProduct, updateProduct } from '@/app/actions/products-admin';

const inputClass =
  'w-full rounded-lg border border-gray-200 p-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#34303d]';
const labelClass = 'mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500';
const cardClass = 'flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6';

type BadgeState = Record<(typeof EDITABLE_BADGES)[number]['key'], boolean>;

function initialBadges(badges: Record<string, unknown> | undefined): BadgeState {
  return {
    isNew: Boolean(badges?.isNew),
    isHit: Boolean(badges?.isHit),
    isExclusive: Boolean(badges?.isExclusive),
  };
}

/** Preserve any non-edited boolean badge keys (e.g. bestseller) on save. */
function mergeBadges(existing: Record<string, unknown> | undefined, edited: BadgeState) {
  const base: Record<string, boolean> = {};
  if (existing) {
    for (const [key, value] of Object.entries(existing)) {
      if (typeof value === 'boolean') base[key] = value;
    }
  }
  return { ...base, ...edited };
}

export function ProductForm({
  mode,
  product,
}: {
  mode: 'create' | 'edit';
  product?: AdminProduct;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(product?.title ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? 'gadget');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [brand, setBrand] = useState(product?.brand ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [images, setImages] = useState<string[]>(product?.image?.length ? product.image : ['']);
  const [badges, setBadges] = useState<BadgeState>(initialBadges(product?.badges));
  const [attributesText, setAttributesText] = useState(
    JSON.stringify(product?.attributes ?? {}, null, 2),
  );

  const setImageAt = (index: number, value: string) =>
    setImages((arr) => arr.map((url, i) => (i === index ? value : url)));
  const addImage = () => setImages((arr) => [...arr, '']);
  const removeImage = (index: number) =>
    setImages((arr) => (arr.length === 1 ? [''] : arr.filter((_, i) => i !== index)));

  const submit = () => {
    setError(null);

    const priceNum = Number(price);
    if (!price.trim() || Number.isNaN(priceNum)) {
      setError('Укажите корректную цену');
      return;
    }

    let attributes: Record<string, unknown>;
    try {
      const parsed = attributesText.trim() ? JSON.parse(attributesText) : {};
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('not an object');
      }
      attributes = parsed;
    } catch {
      setError('Атрибуты: некорректный JSON (ожидается объект)');
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      price: priceNum,
      brand: brand.trim(),
      description,
      in_stock: inStock,
      image: images.map((url) => url.trim()).filter(Boolean),
      badges: mergeBadges(product?.badges, badges),
      attributes,
    };

    const check = productInputSchema.safeParse(payload);
    if (!check.success) {
      setError(check.error.issues[0]?.message ?? 'Проверьте заполнение полей');
      return;
    }

    startTransition(async () => {
      const res =
        mode === 'edit' && product
          ? await updateProduct(product.id, check.data)
          : await createProduct(check.data);

      if ('error' in res) {
        setError(res.error);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className='flex flex-col gap-6'
    >
      {/* Basics */}
      <div className={cardClass}>
        <div>
          <label htmlFor='title' className={labelClass}>
            Название
          </label>
          <input
            id='title'
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label htmlFor='slug' className={labelClass}>
              Slug
            </label>
            <input
              id='slug'
              className={inputClass}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder='iqos-iluma-i-midnight-black'
            />
          </div>
          <div>
            <label htmlFor='category' className={labelClass}>
              Категория
            </label>
            <select
              id='category'
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {PRODUCT_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label htmlFor='price' className={labelClass}>
              Цена, ₽
            </label>
            <input
              id='price'
              type='number'
              min='0'
              step='1'
              className={inputClass}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='brand' className={labelClass}>
              Бренд
            </label>
            <input
              id='brand'
              className={inputClass}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder='IQOS'
            />
          </div>
        </div>

        <div>
          <label htmlFor='description' className={labelClass}>
            Описание
          </label>
          <textarea
            id='description'
            rows={4}
            className={cn(inputClass, 'resize-y')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <label className='flex w-fit items-center gap-2 text-sm font-medium text-[#34303d]'>
          <input
            type='checkbox'
            className='h-4 w-4 rounded border-gray-300'
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          В наличии
        </label>
      </div>

      {/* Images */}
      <div className={cardClass}>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-bold text-[#34303d]'>Изображения (URL)</h3>
          <button
            type='button'
            onClick={addImage}
            className='flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-gray-100'
          >
            <Plus className='h-3.5 w-3.5' /> Добавить
          </button>
        </div>
        <div className='flex flex-col gap-2'>
          {images.map((url, index) => (
            <div key={index} className='flex items-center gap-2'>
              {url.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt=''
                  className='h-10 w-10 shrink-0 rounded-lg border border-gray-200 object-cover'
                />
              ) : (
                <div className='h-10 w-10 shrink-0 rounded-lg border border-dashed border-gray-300 bg-gray-50' />
              )}
              <input
                className={inputClass}
                value={url}
                onChange={(e) => setImageAt(index, e.target.value)}
                placeholder='https://…supabase.co/storage/v1/object/public/…'
              />
              <button
                type='button'
                onClick={() => removeImage(index)}
                className='shrink-0 rounded-lg border border-gray-200 p-2 text-neutral-400 hover:bg-gray-100 hover:text-red-600'
                aria-label='Удалить изображение'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Badges + attributes */}
      <div className={cardClass}>
        <div>
          <h3 className='mb-2 text-sm font-bold text-[#34303d]'>Бейджи</h3>
          <div className='flex flex-wrap gap-4'>
            {EDITABLE_BADGES.map((badge) => (
              <label
                key={badge.key}
                className='flex items-center gap-2 text-sm font-medium text-[#34303d]'
              >
                <input
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300'
                  checked={badges[badge.key]}
                  onChange={(e) => setBadges((b) => ({ ...b, [badge.key]: e.target.checked }))}
                />
                {badge.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor='attributes' className={labelClass}>
            Атрибуты (JSON)
          </label>
          <textarea
            id='attributes'
            rows={8}
            spellCheck={false}
            className={cn(inputClass, 'resize-y font-mono text-xs')}
            value={attributesText}
            onChange={(e) => setAttributesText(e.target.value)}
          />
          <p className='mt-1 text-xs text-neutral-400'>
            Зависят от категории: устройства — line/color; стики — origin/flavors/strength; вода —
            pack_size/packaging.
          </p>
        </div>
      </div>

      {error ? (
        <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700'>
          {error}
        </div>
      ) : null}

      <div className='flex items-center gap-3'>
        <button
          type='submit'
          disabled={isPending}
          className='rounded-lg bg-[#34303d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-60'
        >
          {isPending ? 'Сохранение…' : mode === 'edit' ? 'Сохранить' : 'Создать товар'}
        </button>
        <Link
          href='/admin/products'
          className='rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-gray-100'
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
