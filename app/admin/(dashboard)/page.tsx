import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Package, Settings, ShoppingCart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Панель управления',
  robots: { index: false, follow: false },
};

/**
 * Placeholder KPIs. Values are '—' until wired to real queries (orders /
 * contact_messages are RLS-locked and would read via the service-role client;
 * products via the public client). Kept as scaffolding per the current scope.
 */
const STATS = [
  { label: 'Всего заказов', value: '—', hint: 'За всё время', icon: ShoppingCart },
  { label: 'Активные товары', value: '—', hint: 'В каталоге', icon: Package },
  { label: 'Непрочитанные сообщения', value: '—', hint: 'Из формы контактов', icon: MessageSquare },
];

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

export default function AdminDashboardPage() {
  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2 className='text-sm font-semibold text-[#34303d]'>Обзор</h2>
        <p className='mt-0.5 text-sm text-neutral-500'>
          Показатели ниже — заглушки; подключим реальные данные позже.
        </p>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className='rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm'
            >
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-neutral-500'>{stat.label}</p>
                <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-neutral-500'>
                  <Icon className='h-[18px] w-[18px]' />
                </span>
              </div>
              <p className='mt-4 text-3xl font-black tracking-tight text-[#34303d]'>{stat.value}</p>
              <p className='mt-1 text-xs text-neutral-400'>{stat.hint}</p>
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
