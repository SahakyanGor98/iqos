import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { type AdminOrder, getOrderById } from '@/lib/admin-orders';
import { ORDER_STATUS_META, toOrderStatus } from '@/lib/orders';
import { OrderStatusControl } from '../OrderStatusControl';

type Props = {
  params: Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Заказ #${id}`, robots: { index: false, follow: false } };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const status = toOrderStatus(order.status);
  const meta = ORDER_STATUS_META[status];
  const isTradeIn = order.order_type === 'trade_in';

  return (
    <div className='flex max-w-3xl flex-col gap-6'>
      <Link
        href='/admin/orders'
        className='flex w-fit items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-[#34303d]'
      >
        <ArrowLeft className='h-4 w-4' /> К заказам
      </Link>

      {/* Header + status control */}
      <div className='rounded-2xl border border-gray-200 bg-white p-6'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-xl font-black tracking-tight text-[#34303d]'>
                Заказ #{order.id}
              </h2>
              <span className='rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500'>
                {isTradeIn ? 'Трейд-ин' : 'Покупка'}
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
            <p className='mt-1 text-sm text-neutral-500'>
              {dateFormatter.format(new Date(order.created_at))}
            </p>
          </div>
          <p className='text-2xl font-black tracking-tight text-[#34303d]'>
            {formatPrice(order.total_amount)}
          </p>
        </div>

        <div className='mt-5 border-t border-gray-100 pt-4'>
          <p className='mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500'>
            Статус
          </p>
          <OrderStatusControl id={order.id} status={status} />
        </div>
      </div>

      {/* Customer */}
      <section className='rounded-2xl border border-gray-200 bg-white p-6'>
        <h3 className='mb-4 text-base font-bold text-[#34303d]'>Клиент</h3>
        <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
          <Field label='Имя'>{order.user_name}</Field>
          <Field label='Телефон'>
            <a
              href={`tel:${order.user_phone}`}
              className='flex items-center gap-1 text-[#34303d] hover:underline'
            >
              <Phone className='h-3.5 w-3.5' />
              {order.user_phone}
            </a>
          </Field>
          <Field label='Email'>
            <a
              href={`mailto:${order.user_email}`}
              className='flex items-center gap-1 text-[#34303d] hover:underline'
            >
              <Mail className='h-3.5 w-3.5' />
              {order.user_email}
            </a>
          </Field>
        </dl>
        {order.user_message ? (
          <div className='mt-4 rounded-xl bg-gray-50 p-3 text-sm text-neutral-700'>
            <p className='mb-1 text-xs font-bold uppercase tracking-widest text-neutral-500'>
              Комментарий
            </p>
            <p className='whitespace-pre-line'>{order.user_message}</p>
          </div>
        ) : null}
      </section>

      {isTradeIn ? <TradeInDetails order={order} /> : <PurchaseItems order={order} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className='text-xs font-bold uppercase tracking-widest text-neutral-500'>{label}</dt>
      <dd className='mt-0.5 text-neutral-800'>{children}</dd>
    </div>
  );
}

function PurchaseItems({ order }: { order: AdminOrder }) {
  const subtotal = order.items.reduce((sum, item) => sum + item.line_total, 0);

  return (
    <section className='rounded-2xl border border-gray-200 bg-white p-6'>
      <h3 className='mb-4 text-base font-bold text-[#34303d]'>Состав заказа</h3>

      {order.items.length === 0 ? (
        <p className='text-sm text-neutral-500'>Позиции не сохранены.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-100 text-left text-xs uppercase tracking-wider text-neutral-400'>
                <th className='pb-2 font-semibold'>Товар</th>
                <th className='pb-2 text-center font-semibold'>Кол-во</th>
                <th className='pb-2 text-right font-semibold'>Цена</th>
                <th className='pb-2 text-right font-semibold'>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.slug ?? item.title}-${index}`} className='border-b border-gray-50'>
                  <td className='py-2 pr-3 text-[#34303d]'>{item.title}</td>
                  <td className='py-2 text-center text-neutral-600'>{item.quantity}</td>
                  <td className='py-2 text-right text-neutral-600'>
                    {formatPrice(item.unit_price)}
                  </td>
                  <td className='py-2 text-right font-medium text-[#34303d]'>
                    {formatPrice(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='mt-4 flex flex-col items-end gap-1 text-sm'>
        <SummaryRow label='Подытог' value={formatPrice(subtotal)} />
        {order.discount > 0 ? (
          <SummaryRow label='Скидка' value={`−${formatPrice(order.discount)}`} />
        ) : null}
        <div className='mt-1 flex gap-6 border-t border-gray-100 pt-2 text-base font-bold text-[#34303d]'>
          <span>Итого</span>
          <span>{formatPrice(order.total_amount)}</span>
        </div>
      </div>
    </section>
  );
}

function TradeInDetails({ order }: { order: AdminOrder }) {
  const tradeIn = order.metadata?.trade_in;

  if (!tradeIn) {
    return (
      <section className='rounded-2xl border border-gray-200 bg-white p-6'>
        <h3 className='mb-2 text-base font-bold text-[#34303d]'>Трейд-ин</h3>
        <p className='text-sm text-neutral-500'>Детали трейд-ина не сохранены.</p>
      </section>
    );
  }

  const newDevice =
    [tradeIn.target_device, tradeIn.target_color].filter(Boolean).join(' · ') || '—';
  const address =
    [tradeIn.delivery_city, tradeIn.delivery_address].filter(Boolean).join(', ') || '—';

  return (
    <section className='rounded-2xl border border-gray-200 bg-white p-6'>
      <h3 className='mb-4 text-base font-bold text-[#34303d]'>Трейд-ин</h3>
      <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
        <Field label='Старое устройство'>{tradeIn.old_device ?? '—'}</Field>
        <Field label='Новое устройство'>{newDevice}</Field>
        <Field label='Цена устройства'>
          {tradeIn.original_price != null ? formatPrice(tradeIn.original_price) : '—'}
        </Field>
        <Field label='Скидка за трейд-ин'>
          {tradeIn.estimated_discount != null ? `−${formatPrice(tradeIn.estimated_discount)}` : '—'}
        </Field>
        <Field label='Адрес доставки'>{address}</Field>
      </dl>
      <div className='mt-4 flex justify-end gap-6 border-t border-gray-100 pt-3 text-base font-bold text-[#34303d]'>
        <span>Итоговая цена</span>
        <span>{formatPrice(tradeIn.final_price ?? order.total_amount)}</span>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex gap-6 text-neutral-600'>
      <span>{label}</span>
      <span className='min-w-20 text-right'>{value}</span>
    </div>
  );
}
