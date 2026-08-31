'use client';

import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { HapticButton } from './HapticButton';

type Props = {
  product: Product;
  disabled?: boolean;
  className?: string;
};

export const AddToCartButton = ({ product, disabled, className }: Props) => {
  const items = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
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
      <HapticButton
        disabled={true}
        className={`w-full h-12 px-8 flex items-center justify-center rounded-xl font-bold text-sm uppercase tracking-wide bg-neutral-100 text-neutral-400 ${className}`}
      >
        Загрузка...
      </HapticButton>
    );
  }

  if (quantity > 0) {
    return (
      <div
        className={`flex items-center justify-between w-full h-12 px-2 rounded-xl bg-black text-white ${className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <HapticButton
          onClick={handleDecrement}
          className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition active:scale-90 active:brightness-90 active:bg-neutral-700 text-xl font-medium focus-visible:outline-white'
        >
          <Minus className='w-5 h-5' />
        </HapticButton>
        <span className='font-bold text-lg w-8 text-center'>{quantity}</span>
        <HapticButton
          onClick={handleIncrement}
          className='w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition active:scale-90 active:brightness-90 active:bg-neutral-700 text-xl font-medium focus-visible:outline-white'
        >
          <Plus className='w-5 h-5' />
        </HapticButton>
      </div>
    );
  }

  return (
    <HapticButton
      onClick={handleAdd}
      disabled={disabled}
      className={`w-full h-12 px-8 flex items-center justify-center rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 transform active:scale-95 active:brightness-90
        ${
          disabled
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-black text-white hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2'
        } ${className}
      `}
    >
      {disabled ? 'Нет в наличии' : 'В корзину'}
    </HapticButton>
  );
};
