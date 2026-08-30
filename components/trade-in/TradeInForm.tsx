'use client';

import React, { useEffect, useState } from 'react';
import { submitTradeIn } from '@/app/actions/tradein';
import { formatPrice } from '@/lib/utils';
import { HapticButton } from '@/components/HapticButton';

interface TradeInFormProps {
  isOpen?: boolean;
  oldDeviceName: string;
  oldDeviceId?: string;
  targetDeviceName: string;
  targetSlug?: string;
  targetFullPrice: number;
  estimatedDiscount: number;
  finalPrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TradeInForm: React.FC<TradeInFormProps> = ({
  isOpen = true,
  oldDeviceName,
  oldDeviceId,
  targetDeviceName,
  targetSlug,
  targetFullPrice,
  estimatedDiscount,
  finalPrice,
  onSuccess,
  onCancel,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const phoneRegex =
    /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Введите ваше ФИО (минимум 2 символа)');
      return;
    }

    if (!phoneRegex.test(phone.trim())) {
      setErrorMsg('Введите корректный номер телефона РФ (+7 999 000-00-00)');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Введите корректный email адрес');
      return;
    }

    setLoading(true);

    const res = await submitTradeIn({
      name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      oldDevice: oldDeviceName,
      oldDeviceId,
      targetDevice: targetDeviceName,
      targetSlug,
      targetFullPrice,
      estimatedDiscount,
      finalPrice,
      address: address.trim() || undefined,
      comment: comment.trim() || undefined,
    });

    setLoading(false);

    if (res.success) {
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(res.error || 'Произошла ошибка при отправке заявки');
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in'
        onClick={onCancel}
      />

      {/* Right Drawer Panel (Matching CartDrawer / CheckoutForm) */}
      <div className='fixed top-0 right-0 z-[100] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col animate-in slide-in-from-right text-neutral-900'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-neutral-200'>
          <div className='flex items-center gap-2'>
            {onCancel && (
              <HapticButton
                onClick={onCancel}
                className='p-1.5 -ml-1 rounded-full hover:bg-neutral-100 transition text-neutral-600'
                aria-label='Назад'
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
            )}
            <h2 className='text-lg font-bold text-[#34303d]'>Оформление Трейд-ин</h2>
          </div>
          {onCancel && (
            <HapticButton
              onClick={onCancel}
              className='p-2 rounded-full hover:bg-neutral-100 transition text-neutral-500 hover:text-neutral-900'
              aria-label='Закрыть'
            >
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </HapticButton>
          )}
        </div>

        {/* Content Container */}
        {isSuccess ? (
          <div className='flex-1 overflow-y-auto p-6 text-center flex flex-col items-center justify-center animate-in fade-in'>
            <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 shrink-0'>
              <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-[#34303d] mb-2'>Заявка оформлена!</h3>
            <p className='text-sm text-neutral-600 mb-6 leading-relaxed'>
              Спасибо, <strong>{fullName}</strong>! Заявка на обмен <strong>{oldDeviceName}</strong>{' '}
              на <strong>{targetDeviceName}</strong> принята. Мы свяжемся с вами по номеру{' '}
              <strong>{phone}</strong>.
            </p>

            <div className='w-full p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 mb-6 text-left space-y-2 text-xs sm:text-sm'>
              <div className='flex justify-between text-neutral-600'>
                <span>Сдаете:</span>
                <span className='font-bold text-neutral-900'>{oldDeviceName}</span>
              </div>
              <div className='flex justify-between text-neutral-600'>
                <span>Получаете:</span>
                <span className='font-bold text-neutral-900'>{targetDeviceName}</span>
              </div>
              <div className='flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-200'>
                <span>К оплате курьеру:</span>
                <span className='text-emerald-700 font-black'>{formatPrice(finalPrice)} ₽</span>
              </div>
            </div>

            <HapticButton
              onClick={onCancel}
              className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition active:scale-95'
            >
              Вернуться в магазин
            </HapticButton>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='flex-1 overflow-y-auto p-4 md:p-6 space-y-4 text-left'
          >
            {/* Selected Items Summary Box */}
            <div className='p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2 text-xs sm:text-sm mb-4'>
              <div className='flex justify-between items-center text-neutral-600'>
                <span>Сдаете:</span>
                <span className='font-bold text-neutral-900'>{oldDeviceName}</span>
              </div>
              <div className='flex justify-between items-center text-neutral-600'>
                <span>Получаете:</span>
                <span className='font-bold text-neutral-900'>{targetDeviceName}</span>
              </div>
              <div className='flex justify-between items-center text-neutral-600'>
                <span>Город:</span>
                <span className='font-semibold text-neutral-900'>Москва</span>
              </div>
              <div className='border-t border-neutral-200/80 pt-2 flex justify-between items-center font-bold text-xs sm:text-sm'>
                <span className='text-neutral-700'>Скидка по Трейд-ин:</span>
                <span className='text-emerald-700'>-{formatPrice(estimatedDiscount)} ₽</span>
              </div>
              <div className='flex justify-between items-center font-black text-sm sm:text-base text-neutral-900'>
                <span>Итого к оплате:</span>
                <span className='text-base sm:text-lg text-neutral-900'>
                  {formatPrice(finalPrice)} ₽
                </span>
              </div>
            </div>

            {/* Form Inputs */}
            <div>
              <label className='block text-sm font-medium mb-1'>ФИО</label>
              <input
                type='text'
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder='Иван Иванов'
                className='w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Телефон</label>
              <input
                type='tel'
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='+7 (999) 000-00-00'
                className='w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='example@mail.ru'
                className='w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Город</label>
              <input
                type='text'
                readOnly
                value='Москва'
                className='w-full p-3 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-600 text-sm font-medium cursor-not-allowed select-none'
              />
              <p className='text-xs text-neutral-400 mt-1 font-normal'>
                Обмен и доставка только по г. Москва
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Адрес доставки <span className='text-neutral-400 font-normal'>(необязательно)</span>
              </label>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='ул. Тверская, д. 1, кв. 10'
                className='w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Комментарий к заказу{' '}
                <span className='text-neutral-400 font-normal'>(необязательно)</span>
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Укажите удобное время доставки или особенности заказа...'
                className='w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition resize-none'
              />
            </div>

            {errorMsg && (
              <div className='p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium'>
                {errorMsg}
              </div>
            )}

            <HapticButton
              type='submit'
              disabled={loading}
              className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4'
            >
              {loading ? 'Оформляем...' : 'Подтвердить заказ'}
            </HapticButton>
          </form>
        )}
      </div>
    </div>
  );
};
