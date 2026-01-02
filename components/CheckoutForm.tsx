'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { placeOrder } from '@/app/actions/checkout';
import { useCartStore } from '@/store/cartStore';

// Russian error messages and labels
const formSchema = z.object({
  fullName: z.string().min(2, 'Введите ваше ФИО'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  onBack: () => void;
};

export const CheckoutForm = ({ onBack }: Props) => {
  const { items, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await placeOrder(data, items);

      if (result.success) {
        setSuccess(true);
        clearCart();
      } else {
        setError(result.error || 'Произошла ошибка при оформлении заказа');
      }
    } catch (e) {
      setError('Произошла непредвиденная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className='flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
          <svg
            className='w-8 h-8 text-green-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h3 className='text-xl font-bold mb-2'>Заказ оформлен!</h3>
        <p className='text-neutral-600 mb-6'>Мы отправили подтверждение на вашу почту.</p>
        <button
          onClick={onBack}
          className='text-black underline underline-offset-4 hover:text-neutral-700'
        >
          Вернуться в магазин
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full animate-in slide-in-from-right'>
      <div className='flex items-center p-4 border-b'>
        <button
          onClick={onBack}
          className='mr-4 p-2 -ml-2 rounded-full hover:bg-neutral-100 transition'
        >
          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>
        <h2 className='text-lg font-bold'>Оформление заказа</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex-1 overflow-y-auto p-4 space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>ФИО</label>
          <input
            {...register('fullName')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
              errors.fullName ? 'border-red-500' : 'border-neutral-200'
            }`}
            placeholder='Иван Иванов'
          />
          {errors.fullName && (
            <p className='text-red-500 text-xs mt-1'>{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Телефон</label>
          <input
            {...register('phone')}
            type='tel'
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
              errors.phone ? 'border-red-500' : 'border-neutral-200'
            }`}
            placeholder='+7 (999) 000-00-00'
          />
          {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone.message}</p>}
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Email</label>
          <input
            {...register('email')}
            type='email'
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
              errors.email ? 'border-red-500' : 'border-neutral-200'
            }`}
            placeholder='ivan@example.com'
          />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>
            Комментарий к заказу{' '}
            <span className='text-neutral-400 font-normal'>(необязательно)</span>
          </label>
          <textarea
            {...register('message')}
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition border-neutral-200 min-h-[100px] resize-none'
            placeholder='Дополнительная информация...'
          />
        </div>

        {error && <div className='p-3 bg-red-50 text-red-600 rounded-lg text-sm'>{error}</div>}

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4'
        >
          {isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}
        </button>
      </form>
    </div>
  );
};
