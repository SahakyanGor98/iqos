'use client';

import { useState, useEffect } from 'react';

export const AgeVerification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check local storage on mount
    const isVerified = localStorage.getItem('age-verified');
    if (!isVerified) {
      setIsVisible(true);
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleVerify = () => {
    if (!birthMonth || !birthYear) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);

    if (isNaN(year) || isNaN(month)) {
      setError('Некорректные данные');
      return;
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12

    let age = currentYear - year;
    // Adjust age if birthday hasn't happened yet this year
    if (currentMonth < month) {
      age--;
    }

    if (age >= 18) {
      localStorage.setItem('age-verified', 'true');
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    } else {
      setError('Доступ к сайту разрешен только лицам старше 18 лет');
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-[100] bg-neutral-900 text-white flex flex-col items-center justify-center p-4'>
      <div className='max-w-md w-full text-center space-y-8 animate-in fade-in duration-500'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-black uppercase tracking-tighter'>IQOS STORE</h1>
          <p className='text-neutral-400 text-sm uppercase tracking-widest'>
            Официальная продукция
          </p>
        </div>

        <div className='bg-[#34303D] p-8 rounded-2xl shadow-2xl border border-white/5'>
          <h2 className='text-xl font-bold mb-6'>Подтвердите ваш возраст</h2>

          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-left'>
                <label className='block text-xs uppercase text-neutral-500 mb-1 ml-1'>Месяц</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className='w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors'
                >
                  <option value='' disabled>
                    Выбрать
                  </option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString('ru', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className='text-left'>
                <label className='block text-xs uppercase text-neutral-500 mb-1 ml-1'>Год</label>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className='w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors'
                >
                  <option value='' disabled>
                    Выбрать
                  </option>
                  {Array.from(
                    { length: new Date().getFullYear() - 1900 },
                    (_, i) => new Date().getFullYear() - i,
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className='text-red-500 text-sm font-medium bg-red-500/10 p-2 rounded'>
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              className='w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-full hover:bg-neutral-200 transition-colors mt-4'
            >
              Войти на сайт
            </button>
          </div>
        </div>

        <p className='text-xs text-neutral-600 max-w-xs mx-auto'>
          МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ
        </p>
      </div>
    </div>
  );
};
