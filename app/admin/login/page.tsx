import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Вход в админ-панель',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className='flex min-h-[70vh] items-center justify-center px-4 py-16'>
      <div className='w-full max-w-sm'>
        <div className='mb-6 text-center'>
          <p className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
            Админ-панель
          </p>
          <h1 className='mt-1 text-2xl font-black tracking-tight text-[#34303d]'>Вход</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
