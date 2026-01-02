'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitContact } from '@/app/actions/contact';

const contactSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email'),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
});

type FormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitContact(data);

      if (result.success) {
        setSuccess(true);
        reset();
      } else {
        setError(result.error || 'Произошла ошибка при отправке');
      }
    } catch (e) {
      setError('Произошла непредвиденная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className='flex flex-col items-center justify-center p-8 bg-neutral-50 rounded-2xl text-center h-full min-h-[400px] animate-in fade-in'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6'>
          <svg
            className='w-8 h-8 text-green-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h3 className='text-2xl font-bold mb-4'>Сообщение отправлено!</h3>
        <p className='text-neutral-600 mb-8 max-w-sm'>
          Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className='px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition'
        >
          Отправить еще одно
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white p-8 rounded-2xl shadow-sm border border-neutral-100'
    >
      <div className='grid gap-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>Ваше Имя</label>
          <input
            {...register('name')}
            className={`w-full p-4 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
              errors.name ? 'border-red-500' : 'border-transparent'
            }`}
            placeholder='Иван Иванов'
          />
          {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium mb-2'>Телефон</label>
            <input
              {...register('phone')}
              type='tel'
              className={`w-full p-4 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                errors.phone ? 'border-red-500' : 'border-transparent'
              }`}
              placeholder='+7 (999) 000-00-00'
            />
            {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Email</label>
            <input
              {...register('email')}
              type='email'
              className={`w-full p-4 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                errors.email ? 'border-red-500' : 'border-transparent'
              }`}
              placeholder='ivan@example.com'
            />
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Сообщение</label>
          <textarea
            {...register('message')}
            className={`w-full p-4 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition min-h-[150px] resize-none ${
              errors.message ? 'border-red-500' : 'border-transparent'
            }`}
            placeholder='Напишите ваш вопрос или предложение...'
          />
          {errors.message && <p className='text-red-500 text-sm mt-1'>{errors.message.message}</p>}
        </div>

        {error && <div className='p-4 bg-red-50 text-red-600 rounded-xl text-sm'>{error}</div>}

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2'
        >
          {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
        </button>
      </div>
    </form>
  );
};
