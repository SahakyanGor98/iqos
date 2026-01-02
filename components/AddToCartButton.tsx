'use client';

import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';

type Props = {
  product: Product;
  disabled?: boolean;
  className?: string;
};

export const AddToCartButton = ({ product, disabled, className }: Props) => {
  const { items, addToCart, removeFromCart, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  if (!mounted) {
    return (
      <button
        disabled={true}
        className={`w-full py-4 px-8 rounded-xl font-bold text-sm uppercase tracking-wide bg-neutral-100 text-neutral-400 ${className}`}
      >
        Загрузка...
      </button>
    );
  }

  if (quantity > 0) {
    return (
      <div
        className={`flex items-center justify-between w-full py-2 px-2 rounded-xl bg-black text-white ${className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button
          onClick={handleDecrement}
          className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition active:scale-90 text-xl font-medium'
        >
          −
        </button>
        <span className='font-bold text-lg w-8 text-center'>{quantity}</span>
        <button
          onClick={handleIncrement}
          className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition active:scale-90 text-xl font-medium'
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={`w-full py-4 px-8 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 transform active:scale-95
        ${disabled
          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          : 'bg-black text-white hover:bg-neutral-800'
        } ${className}
      `}
    >
      {disabled ? 'Нет в наличии' : 'В корзину'}
    </button>
  );
};
