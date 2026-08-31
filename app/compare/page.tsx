import { Metadata } from 'next';
import { CompareContent } from './CompareContent';

export const metadata: Metadata = {
  title: 'Сравнение моделей',
  description:
    'Сравните характеристики, технологии и цены устройств IQOS ILUMA и стиков TEREA, чтобы выбрать подходящую модель.',
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    title: 'Сравнение моделей IQOS и TEREA',
    description: 'Сравните характеристики, технологии и цены устройств IQOS и стиков TEREA.',
  },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialCategory = typeof params.category === 'string' ? params.category : undefined;
  const initialSlugs = typeof params.slugs === 'string' ? params.slugs : undefined;

  return <CompareContent initialCategory={initialCategory} initialSlugs={initialSlugs} />;
}
