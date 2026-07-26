import React from 'react';
import { cn } from '@/lib/utils';

export interface TextSeparatorProps {
  className?: string;
}

export const TextSeparator: React.FC<TextSeparatorProps> = ({ className }) => {
  return <div className={cn('w-full bg-white h-2 md:h-3', className)} />;
};
