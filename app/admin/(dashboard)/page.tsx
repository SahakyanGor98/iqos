import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Package, Settings, ShoppingCart } from 'lucide-react';
import { type DashboardStats, getDashboardStats } from '@/lib/admin-stats';

export const metadata: Metadata = {
  title: 'Панель управления',
  robots: { index: false, follow: false },
};

const STAT_CARDS = [
  { key: 'orders', label: 'Всего заказов', hint: 'За всё время', icon: ShoppingCart },
  { key: 'activeProducts', label: 'Активные товары', hint: 'В наличии', icon: Package },
  {
    key: 'unreadMessages',
    label: 'Новые сообщения',
    hint: 'Из формы контактов',
    icon: MessageSquare,
  },
] as const satisfies ReadonlyArray<{
  key: keyof DashboardStats;
  label: string;
  hint: string;
  icon: typeof ShoppingCart;
}>;

const QUICK_ACTIONS = [
  {
    label: 'Настройки сайта',
    description: 'Баннеры и доступ к страницам',
    href: '/admin/settings',
    icon: Settings,
  },
  { label: 'Товары', description: 'Управление каталогом', href: '/admin/products', icon: Package },
  { label: 'Заказы', description: 'История заказов', href: '/admin/orders', icon: ShoppingCart },
];

const numberFormatter = new Intl.NumberFormat('ru-RU');

/** Real count, or "—" when the query failed (never a misleading 0). */
function formatStat(value: number | null): string {
  return value === null ? '—' : numberFormatter.format(value);
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2 className='text-sm font-semibold text-[#34303d]'>Обзор</h2>
        <p className='mt-0.5 text-sm text-neutral-500'>Ключевые показатели магазина.</p>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className='rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-neutral-500'>{card.label}</p>
                <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-neutral-500'>
                  <Icon className='h-[18px] w-[18px]' />
                </span>
              </div>
              <p className='mt-4 text-3xl font-black tracking-tight text-[#34303d]'>
                {formatStat(stats[card.key])}
              </p>
              <p className='mt-1 text-xs text-neutral-400'>{card.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className='mb-3 text-sm font-semibold text-[#34303d]'>Быстрые действия</h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className='group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-[#34303d]/30 hover:bg-gray-50'
              >
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#34303d] text-white'>
                  <Icon className='h-5 w-5' />
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-semibold text-[#34303d]'>{action.label}</p>
                  <p className='truncate text-xs text-neutral-500'>{action.description}</p>
                </div>
                <ArrowRight className='h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-[#34303d]' />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
