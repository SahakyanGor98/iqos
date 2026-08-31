'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from '@/app/actions/auth';
import { Button } from '@/components/Button';
import { ButtonSize, ButtonVariant } from '@/components/ButtonTypes';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

type FormData = z.infer<typeof loginSchema>;

const inputClass =
  'w-full rounded-lg border border-neutral-200 p-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#34303d]';

export const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const res = await signIn(data);
    // On success the action redirects; we only get here on failure.
    if (res?.error) {
      setError(res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6'
    >
      <div>
        <label htmlFor='email' className='mb-1 block text-sm font-medium text-neutral-700'>
          Email
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          placeholder='admin@24iqos.ru'
          className={inputClass}
          {...register('email')}
        />
        {errors.email && <p className='mt-1 text-xs text-red-600'>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor='password' className='mb-1 block text-sm font-medium text-neutral-700'>
          Пароль
        </label>
        <input
          id='password'
          type='password'
          autoComplete='current-password'
          placeholder='••••••••'
          className={inputClass}
          {...register('password')}
        />
        {errors.password && <p className='mt-1 text-xs text-red-600'>{errors.password.message}</p>}
      </div>

      {error && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600'>
          {error}
        </div>
      )}

      <Button
        type='submit'
        disabled={isSubmitting}
        variant={ButtonVariant.PRIMARY}
        size={ButtonSize.MEDIUM}
        className='mt-1 w-full'
      >
        {isSubmitting ? 'Вход…' : 'Войти'}
      </Button>
    </form>
  );
};
