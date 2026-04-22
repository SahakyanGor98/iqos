'use client';

import React from 'react';
import { triggerHaptic } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hapticPattern?: number | number[];
}

export const HapticButton = ({
  children,
  hapticPattern = 10,
  onClick,
  className,
  ...props
}: HapticButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback
    triggerHaptic(hapticPattern);

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        'active:scale-[0.96] active:brightness-95 active:shadow-inner transition-all duration-100',
        className,
      )}
    >
      {children}
    </button>
  );
};
