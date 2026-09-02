import type { Metadata } from 'next';
import Link from 'next/link';
import { Inbox, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ContactMessage, getContactMessages } from '@/lib/messages';
import { MessageStatusButton } from './MessageStatusButton';

export const metadata: Metadata = {
  title: 'Сообщения',
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { status } = await searchParams;
  // Default to the unread queue — that's what needs action.
  const showRead = status === 'read';

  const all = await getContactMessages();
  const newMessages = all.filter((m) => m.status === 'new');
  const readMessages = all.filter((m) => m.status !== 'new');
  const messages = showRead ? readMessages : newMessages;

  return (
    <div className='flex max-w-3xl flex-col gap-6'>
      {/* Status tabs */}
      <div className='flex items-center gap-2'>
        <FilterTab
          href='/admin/messages'
          active={!showRead}
          label='Новые'
          count={newMessages.length}
        />
        <FilterTab
          href='/admin/messages?status=read'
          active={showRead}
          label='Прочитанные'
          count={readMessages.length}
        />
      </div>

      {messages.length === 0 ? (
        <EmptyState showRead={showRead} />
      ) : (
        <ul className='flex flex-col gap-4'>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterTab({
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

function MessageItem({ message }: { message: ContactMessage }) {
  const isNew = message.status === 'new';

  return (
    <li
      className={cn(
        'rounded-2xl border bg-white p-5',
        isNew ? 'border-[#34303d]/30' : 'border-gray-200',
      )}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <h3 className='truncate font-semibold text-[#34303d]'>{message.name}</h3>
            {isNew ? (
              <span className='rounded bg-[#34303d] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
                Новое
              </span>
            ) : null}
          </div>
          <div className='mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500'>
            <a
              href={`mailto:${message.email}`}
              className='flex items-center gap-1 transition-colors hover:text-[#34303d]'
            >
              <Mail className='h-3.5 w-3.5' />
              {message.email}
            </a>
            <a
              href={`tel:${message.phone}`}
              className='flex items-center gap-1 transition-colors hover:text-[#34303d]'
            >
              <Phone className='h-3.5 w-3.5' />
              {message.phone}
            </a>
          </div>
        </div>
        <time className='shrink-0 text-xs text-neutral-400' dateTime={message.created_at}>
          {dateFormatter.format(new Date(message.created_at))}
        </time>
      </div>

      <p className='mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-700'>
        {message.message}
      </p>

      <div className='mt-4 flex justify-end'>
        <MessageStatusButton id={message.id} status={message.status} />
      </div>
    </li>
  );
}

function EmptyState({ showRead }: { showRead: boolean }) {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-neutral-400'>
        <Inbox className='h-6 w-6' />
      </div>
      <h2 className='text-lg font-bold text-[#34303d]'>
        {showRead ? 'Прочитанных сообщений нет' : 'Новых сообщений нет'}
      </h2>
      <p className='mt-1 text-sm text-neutral-500'>
        {showRead
          ? 'Обработанные сообщения появятся здесь.'
          : 'Все сообщения обработаны — новых пока нет.'}
      </p>
    </div>
  );
}
