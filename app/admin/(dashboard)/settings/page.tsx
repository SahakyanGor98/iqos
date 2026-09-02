import type { Metadata } from 'next';
import { getSiteSettingsForAdmin, type SiteSettingRow } from '@/lib/settings';
import { SettingToggle } from './SettingToggle';

export const metadata: Metadata = {
  title: 'Настройки сайта',
  robots: { index: false, follow: false },
};

const GROUP_META: Record<string, { title: string; description: string }> = {
  banners: {
    title: 'Баннеры и промо',
    description: 'Управление промо-баннерами и виджетами на витрине.',
  },
  pages: {
    title: 'Доступ к страницам',
    description: 'Включение и отключение разделов каталога.',
  },
  general: {
    title: 'Общие настройки',
    description: 'Прочие настройки сайта.',
  },
};

/** Group rows into an ordered list, preserving the query's (group_name,
 *  sort_order) ordering. */
function groupSettings(settings: SiteSettingRow[]) {
  const order: string[] = [];
  const byGroup = new Map<string, SiteSettingRow[]>();

  for (const setting of settings) {
    const group = byGroup.get(setting.group_name);
    if (group) {
      group.push(setting);
    } else {
      byGroup.set(setting.group_name, [setting]);
      order.push(setting.group_name);
    }
  }

  return order.map((key) => ({ key, items: byGroup.get(key)! }));
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsForAdmin();
  const groups = groupSettings(settings);

  return (
    <div className='flex max-w-2xl flex-col gap-6'>
      {groups.length === 0 ? (
        <div className='rounded-2xl border border-gray-200 bg-white p-6 text-sm text-neutral-500'>
          Настройки не найдены. Выполните миграцию{' '}
          <code className='rounded bg-gray-100 px-1 py-0.5 text-xs'>site_settings</code> в Supabase.
        </div>
      ) : (
        groups.map((group) => {
          const meta = GROUP_META[group.key] ?? { title: group.key, description: '' };
          return (
            <section key={group.key} className='rounded-2xl border border-gray-200 bg-white p-6'>
              <div className='mb-2'>
                <h2 className='text-base font-bold text-[#34303d]'>{meta.title}</h2>
                {meta.description ? (
                  <p className='mt-0.5 text-sm text-neutral-500'>{meta.description}</p>
                ) : null}
              </div>
              <div className='flex flex-col divide-y divide-gray-100'>
                {group.items.map((item) => (
                  <SettingToggle key={item.key} setting={item} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
