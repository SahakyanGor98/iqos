'use client';

import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { CheckoutForm } from './CheckoutForm';
import { HapticButton } from './HapticButton';
import { fixCasing, formatDeviceTitle, formatPrice } from '@/lib/utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CartDrawer = ({ isOpen, onClose }: Props) => {
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const discount = useCartStore((s) => s.discount);
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const clearPromo = useCartStore((s) => s.clearPromo);

  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Hydration fix for persist middleware
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset checkout state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setIsCheckingOut(false);
    }
  }, [isOpen]);

  const applyPromo = () => {
    if (!promoInput.trim()) return;

    const success = setPromoCode(promoInput);

    if (!success) {
      setPromoError('Неверный промокод');
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handleCheckout = () => {
    // If user typed a promo but forgot to click OK, try to apply it now
    if (promoInput.trim()) {
      const success = setPromoCode(promoInput);
      if (success) {
        setPromoInput('');
        setPromoError('');
      } else {
        // If it's invalid, we block the checkout and show the error
        setPromoError('Неверный промокод');
        return;
      }
    }
    setIsCheckingOut(true);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-[100] h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex h-full flex-col'>
          {isCheckingOut ? (
            <CheckoutForm onBack={() => setIsCheckingOut(false)} onClose={onClose} />
          ) : (
            <>
              {/* Header */}
              <div className='flex items-center justify-between p-4 border-b'>
                <h2 className='text-lg font-bold'>Корзина</h2>
                <HapticButton
                  onClick={onClose}
                  className='p-2 rounded-full hover:bg-neutral-100 transition'
                >
                  <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </HapticButton>
              </div>

              {/* Items */}
              <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {items.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-full text-neutral-500'>
                    <p>Корзина пуста</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className='flex gap-4 border-b pb-4 last:border-0'>
                      <div className='relative w-20 h-20 flex-shrink-0 bg-neutral-50 rounded-md overflow-hidden'>
                        <img
                          src={`/api/proxy?url=${encodeURIComponent(Array.isArray(item.product.image) ? item.product.image[0] : item.product.image)}`}
                          alt={item.product.title}
                          className='w-full h-full object-contain p-1'
                          loading='lazy'
                        />
                      </div>
                      <div className='flex-1'>
                        <div className='flex justify-between items-start'>
                          <h3 className='text-sm font-medium line-clamp-2'>
                            {formatDeviceTitle(fixCasing(item.product.title, false))}
                          </h3>
                          <HapticButton
                            onClick={() => removeFromCart(item.product.id)}
                            className='text-red-500 hover:text-red-700 ml-2'
                          >
                            <svg
                              className='w-5 h-5'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                              />
                            </svg>
                          </HapticButton>
                        </div>
                        <p className='text-sm text-neutral-500 mt-1'>
                          {formatPrice(item.product.price)} / шт
                        </p>

                        <div className='flex items-center justify-between mt-3'>
                          <div className='flex items-center border rounded-md'>
                            <HapticButton
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className='px-2 py-1 hover:bg-neutral-100 transition'
                              disabled={item.quantity <= 1}
                            >
                              -
                            </HapticButton>
                            <span className='px-2 py-1 min-w-[32px] text-center text-sm'>
                              {item.quantity}
                            </span>
                            <HapticButton
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className='px-2 py-1 hover:bg-neutral-100 transition'
                            >
                              +
                            </HapticButton>
                          </div>
                          <p className='font-semibold'>
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className='p-4 border-t bg-neutral-50'>
                  <div className='mb-4'>
                    {promoCode ? (
                      <div className='flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm'>
                        <span>✓ Промокод {promoCode} применён</span>
                        <button onClick={clearPromo} className='text-red-500 text-sm'>
                          Удалить
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className='flex gap-2'>
                          <input
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                            placeholder='Промокод'
                            className='flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black'
                          />
                          <button
                            onClick={applyPromo}
                            className={`px-4 rounded-lg text-sm font-medium transition-colors ${
                              promoInput.trim()
                                ? 'bg-black text-white'
                                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                            }`}
                          >
                            OK
                          </button>
                        </div>

                        {promoError && <p className='text-red-500 text-xs mt-1'>{promoError}</p>}
                      </>
                    )}
                  </div>

                  <div className='space-y-2 mb-4'>
                    {/* Subtotal */}
                    <div className='flex justify-between items-center text-sm text-neutral-600'>
                      <span>Товары</span>
                      <span>
                        {formatPrice(
                          items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
                        )}
                      </span>
                    </div>

                    {/* Discount */}
                    {discount > 0 && (
                      <div className='flex justify-between items-center text-sm text-green-600 font-medium'>
                        <span>Скидка</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className='border-t pt-3 flex justify-between items-center'>
                      <span className='text-lg font-medium'>Итого:</span>
                      <span className='text-2xl font-black'>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                  <HapticButton
                    onClick={handleCheckout}
                    className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition active:scale-95'
                  >
                    Оформить заказ
                  </HapticButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
