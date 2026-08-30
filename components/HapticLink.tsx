'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { triggerHaptic } from '@/lib/utils';

interface HapticLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  children: React.ReactNode;
  className?: string;
  hapticPattern?: number | number[];
}

export const HapticLink = ({
  children,
  hapticPattern = 10,
  onClick,
  ...props
}: HapticLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Trigger haptic feedback
    triggerHaptic(hapticPattern);

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
};
