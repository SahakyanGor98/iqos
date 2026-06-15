'use client';

import { useState } from 'react';
import { HapticButton } from './HapticButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { placeOrder } from '@/app/actions/checkout';
import { useCartStore } from '@/store/cartStore';
import { DELIVERY_NOTIFICATION_END, DELIVERY_NOTIFICATION_START } from '@/lib/constants';

// Russian error messages and labels
const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

const formSchema = z.object({
  fullName: z.string().min(2, 'Введите ваше ФИО'),
  phone: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(phoneRegex, 'Некорректный формат российского номера (например: +7 999 000-00-00)'),
  email: z.string().email('Введите корректный email'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  onBack: () => void;
  onClose: () => void;
};

export const CheckoutForm = ({ onBack, onClose }: Props) => {
  const { items, clearCart, promoCode, discount } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [tempFormData, setTempFormData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const proceedWithOrder = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await placeOrder(data, items, promoCode, discount);

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

  const onSubmit = async (data: FormData) => {
    const now = new Date();
    const warningStart = new Date(DELIVERY_NOTIFICATION_START);
    const warningEnd = new Date(DELIVERY_NOTIFICATION_END);
    const showWarning = now >= warningStart && now < warningEnd;

    if (showWarning) {
      setTempFormData(data);
      setShowWarningModal(true);
    } else {
      await proceedWithOrder(data);
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
        <HapticButton
          onClick={onClose}
          className='text-black underline underline-offset-4 hover:text-neutral-700'
        >
          Вернуться в магазин
        </HapticButton>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full animate-in slide-in-from-right relative'>
      <div className='flex items-center p-4 border-b'>
        <HapticButton
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
        </HapticButton>
        <h2 className='text-lg font-bold'>Оформление заказа</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex-1 overflow-y-auto p-4 space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>ФИО</label>
          <input
            {...register('fullName')}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${errors.fullName ? 'border-red-500' : 'border-neutral-200'
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
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${errors.phone ? 'border-red-500' : 'border-neutral-200'
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
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${errors.email ? 'border-red-500' : 'border-neutral-200'
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

        <HapticButton
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4'
        >
          {isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}
        </HapticButton>
      </form>

      {/* Delivery Warning Modal */}
      {showWarningModal && (
        <div className='absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-neutral-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200'>
            {/* Warning Icon */}
            <div className='w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600 shadow-inner flex-shrink-0'>
              <svg
                className='w-7 h-7'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>

            {/* Content */}
            <h3 className='text-base font-bold text-neutral-900 mb-2'>Внимание !</h3>
            <p className='text-sm text-neutral-600 mb-6 leading-relaxed'>
              С <strong>19 по 30 июня</strong> наша доставка работать не будет.
              Все оформленные заказы будут доставлены в порядке очереди начиная с <strong>1 июля</strong>.
            </p>

            {/* Actions */}
            <div className='flex flex-col w-full gap-2'>
              <HapticButton
                onClick={async () => {
                  setShowWarningModal(false);
                  if (tempFormData) {
                    await proceedWithOrder(tempFormData);
                  }
                }}
                className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition active:scale-95'
              >
                Да, продолжить
              </HapticButton>
              <HapticButton
                onClick={() => {
                  setShowWarningModal(false);
                  setTempFormData(null);
                }}
                className='w-full bg-neutral-100 text-neutral-700 py-2.5 rounded-lg font-medium hover:bg-neutral-200 transition active:scale-95 text-sm'
              >
                Вернуться назад
              </HapticButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
