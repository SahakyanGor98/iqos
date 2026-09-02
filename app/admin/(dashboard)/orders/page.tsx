import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, PackageOpen } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { type AdminOrder, getOrders } from '@/lib/admin-orders';
import { ORDER_STATUS_META, ORDER_STATUSES, type OrderStatus, toOrderStatus } from '@/lib/orders';

export const metadata: Metadata = {
  title: 'Заказы',
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const TYPE_LABEL: Record<AdminOrder['order_type'], string> = {
  purchase: 'Покупка',
  trade_in: 'Трейд‑ин',
};

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const activeFilter: OrderStatus | null = (ORDER_STATUSES as readonly string[]).includes(
    status ?? '',
  )
    ? (status as OrderStatus)
    : null;

  const all = await getOrders();
  const orders = activeFilter ? all.filter((o) => o.status === activeFilter) : all;

  const countFor = (s: OrderStatus) => all.filter((o) => o.status === s).length;

  return (
    <div className='flex flex-col gap-6'>
      {/* Status filter chips */}
      <div className='flex flex-wrap gap-2'>
        <FilterChip href='/admin/orders' active={!activeFilter} label='Все' count={all.length} />
        {ORDER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin/orders?status=${s}`}
            active={activeFilter === s}
            label={ORDER_STATUS_META[s].label}
            count={countFor(s)}
          />
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className='flex flex-col gap-3'>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
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

function OrderRow({ order }: { order: AdminOrder }) {
  const meta = ORDER_STATUS_META[toOrderStatus(order.status)];

  return (
    <li>
      <Link
        href={`/admin/orders/${order.id}`}
        className='flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#34303d]/30 hover:bg-gray-50'
      >
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='font-semibold text-[#34303d]'>#{order.id}</span>
            <span className='rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500'>
              {TYPE_LABEL[order.order_type]}
            </span>
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                meta.badge,
              )}
            >
              {meta.label}
            </span>
          </div>
          <p className='mt-1 truncate text-sm text-neutral-600'>
            {order.user_name} · {order.user_phone}
          </p>
        </div>
        <div className='shrink-0 text-right'>
          <p className='font-semibold text-[#34303d]'>{formatPrice(order.total_amount)}</p>
          <p className='text-xs text-neutral-400'>
            {dateFormatter.format(new Date(order.created_at))}
          </p>
        </div>
        <ChevronRight className='h-4 w-4 shrink-0 text-neutral-300' />
      </Link>
    </li>
  );
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-neutral-400'>
        <PackageOpen className='h-6 w-6' />
      </div>
      <h2 className='text-lg font-bold text-[#34303d]'>Заказов нет</h2>
      <p className='mt-1 text-sm text-neutral-500'>С выбранным статусом заказов не найдено.</p>
    </div>
  );
}
