'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { CheckoutForm } from './CheckoutForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CartDrawer = ({ isOpen, onClose }: Props) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex h-full flex-col'>
          {isCheckingOut ? (
            <CheckoutForm onBack={() => setIsCheckingOut(false)} />
          ) : (
            <>
              {/* Header */}
              <div className='flex items-center justify-between p-4 border-b'>
                <h2 className='text-lg font-bold'>Корзина</h2>
                <button
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
                </button>
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
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className='object-contain p-1'
                        />
                      </div>
                      <div className='flex-1'>
                        <div className='flex justify-between items-start'>
                          <h3 className='text-sm font-medium line-clamp-2'>{item.product.title}</h3>
                          <button
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
                          </button>
                        </div>
                        <p className='text-sm text-neutral-500 mt-1'>{item.product.price} ₽ / шт</p>

                        <div className='flex items-center justify-between mt-3'>
                          <div className='flex items-center border rounded-md'>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className='px-2 py-1 hover:bg-neutral-100 transition'
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className='px-2 py-1 min-w-[32px] text-center text-sm'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className='px-2 py-1 hover:bg-neutral-100 transition'
                            >
                              +
                            </button>
                          </div>
                          <p className='font-semibold'>{item.product.price * item.quantity} ₽</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className='p-4 border-t bg-neutral-50'>
                  <div className='flex justify-between items-center mb-4'>
                    <span className='text-lg font-medium'>Итого:</span>
                    <span className='text-xl font-bold'>{getTotalPrice()} ₽</span>
                  </div>
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition active:scale-95'
                  >
                    Оформить заказ
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
