import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { signOut } from '@/app/actions/auth';
import { Button } from '@/components/Button';
import { ButtonSize, ButtonVariant } from '@/components/ButtonTypes';

export const metadata: Metadata = {
  title: 'Панель управления',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='container-custom py-12'>
      <div className='mx-auto max-w-2xl'>
        <div className='flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8'>
          <div>
            <p className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
              Админ-панель
            </p>
            <h1 className='mt-1 text-2xl font-black tracking-tight text-[#34303d]'>
              Панель управления
            </h1>
          </div>

          <div className='rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700'>
            Вы вошли как <strong className='text-[#34303d]'>{user?.email}</strong>
          </div>

          <form action={signOut}>
            <Button type='submit' variant={ButtonVariant.SECONDARY} size={ButtonSize.MEDIUM}>
              Выйти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
