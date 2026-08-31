'use client';

import React from 'react';
import Link from 'next/link';
import { triggerHaptic } from '@/lib/utils';
import { cn } from '@/lib/utils';

import { ButtonShadow, ButtonSize, ButtonVariant } from './ButtonTypes';

const variantStyles = {
  [ButtonVariant.PRIMARY]:
    'bg-[#34303D] text-white hover:bg-black hover:scale-[1.02] focus-visible:ring-[#34303D]',
  [ButtonVariant.SECONDARY]:
    'text-[#34303D] border border-[#34303D] bg-transparent hover:bg-[#34303D] hover:text-white hover:scale-[1.02] focus-visible:ring-[#34303D]',
  [ButtonVariant.SECONDARY_WHITE]:
    'text-[#34303D] border border-[#34303D] bg-white hover:bg-[#34303D] hover:text-white hover:scale-[1.02] focus-visible:ring-[#34303D]',
  [ButtonVariant.LIGHT]:
    'text-[#34303D] bg-white hover:bg-neutral-100 hover:scale-[1.02] focus-visible:ring-white',
};

const sizeStyles = {
  [ButtonSize.SMALL]: 'px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em]',
  [ButtonSize.MEDIUM]: 'px-6 py-3 text-sm font-bold uppercase tracking-[0.1em]',
  [ButtonSize.LARGE]: 'px-8 py-4 text-base font-bold uppercase tracking-[0.1em]',
};

const shadowStyles = {
  [ButtonShadow.NONE]: '',
  [ButtonShadow.SMALL]: 'shadow-md hover:shadow-lg',
  [ButtonShadow.LARGE]: 'shadow-xl hover:shadow-2xl',
};

const baseClass =
  'inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-offset-2';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shadow?: ButtonShadow;
  haptic?: boolean;
  hapticPattern?: number | number[];
  href?: never;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shadow?: ButtonShadow;
  haptic?: boolean;
  hapticPattern?: number | number[];
  href: string;
  className?: string;
}

export type Props = ButtonProps | LinkButtonProps;

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  (props, ref) => {
    const {
      children,
      className,
      variant = ButtonVariant.PRIMARY,
      size = ButtonSize.SMALL,
      shadow = ButtonShadow.NONE,
      haptic = true,
      hapticPattern = 10,
      onClick,
      href,
      ...rest
    } = props;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (haptic) {
        triggerHaptic(hapticPattern);
      }
      if (onClick) {
        // `onClick` is typed per the anchor/button union; the handler accepts either.
        (onClick as (event: typeof e) => void)(e);
      }
    };

    const classes = cn(
      baseClass,
      variantStyles[variant],
      sizeStyles[size],
      shadowStyles[shadow],
      className,
    );

    if (href !== undefined) {
      // Strip `type` (a button-only prop) before spreading the rest onto <Link>.
      const { type, ...linkRest } =
        rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement> & {
          type?: string;
        };
      return (
        <Link
          href={href}
          onClick={handleClick}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...linkRest}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        type={(rest as React.ButtonHTMLAttributes<HTMLButtonElement>).type || 'button'}
        onClick={handleClick}
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(rest as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
