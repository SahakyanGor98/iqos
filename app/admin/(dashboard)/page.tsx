import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
} from 'lucide-react';
import { type DashboardStats, getDashboardStats } from '@/lib/admin-stats';

export const metadata: Metadata = {
  title: 'Панель управления',
  robots: { index: false, follow: false },
};

const STAT_CARDS = [
  {
    key: 'pendingOrders',
    label: 'Новые заказы',
    hint: 'Ожидают обработки',
    icon: Clock,
    href: '/admin/orders?status=pending',
  },
  {
    key: 'orders',
    label: 'Всего заказов',
    hint: 'За всё время',
    icon: ShoppingCart,
    href: '/admin/orders',
  },
  {
    key: 'activeProducts',
    label: 'Активные товары',
    hint: 'В наличии',
    icon: Package,
    href: '/admin/products',
  },
  {
    key: 'unreadMessages',
    label: 'Новые сообщения',
    hint: 'Из формы контактов',
    icon: MessageSquare,
    href: '/admin/messages',
  },
] as const satisfies ReadonlyArray<{
  key: keyof DashboardStats;
  label: string;
  hint: string;
  icon: typeof ShoppingCart;
  href: string;
}>;

const QUICK_ACTIONS = [
  {
    label: 'Настройки сайта',
    description: 'Баннеры и доступ к страницам',
    href: '/admin/settings',
    icon: Settings,
  },
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

      {/* Stat cards — each drills into its section */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className='group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#34303d]/30 hover:shadow-sm'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-neutral-500'>{card.label}</p>
                <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-neutral-500 transition-colors group-hover:bg-[#34303d] group-hover:text-white'>
                  <Icon className='h-[18px] w-[18px]' />
                </span>
              </div>
              <p className='mt-4 text-3xl font-black tracking-tight text-[#34303d]'>
                {formatStat(stats[card.key])}
              </p>
              <p className='mt-1 flex items-center gap-1 text-xs text-neutral-400'>
                {card.hint}
                <ArrowUpRight className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100' />
              </p>
            </Link>
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
