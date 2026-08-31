'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import { ButtonVariant } from '@/components/ButtonTypes';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to logs / monitoring.
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-[#fffdfb] text-[#34303d]'>
      <h1 className='text-2xl md:text-3xl font-black uppercase tracking-tight'>
        Что-то пошло не так
      </h1>
      <p className='mt-3 max-w-md text-sm md:text-base text-neutral-500 leading-relaxed'>
        Произошла непредвиденная ошибка. Попробуйте обновить страницу — если проблема повторится,
        вернитесь на главную.
      </p>
      <div className='mt-8 flex flex-col sm:flex-row items-center gap-3'>
        <Button variant={ButtonVariant.PRIMARY} onClick={reset}>
          Попробовать снова
        </Button>
        <Button href='/' variant={ButtonVariant.SECONDARY}>
          На главную
        </Button>
      </div>
    </div>
  );
}
