'use client';

import React from 'react';
import Image from 'next/image';
import { useLoading } from '@/context/LoadingContext';

export const GlobalLoader = () => {
  const { isLoading } = useLoading();

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300 pointer-events-none 
        ${isLoading ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className='relative w-32 h-32 md:w-48 md:h-48 animate-spin-linear'>
        <div className='w-full h-full animate-pulse-smooth flex items-center justify-center'>
          <Image src='/icon1.webp' alt='Loading...' fill priority className='object-contain' />
        </div>
      </div>
    </div>
  );
};
