'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const YEARS = Array.from(
  { length: new Date().getFullYear() - 1899 },
  (_, i) => new Date().getFullYear() - i,
);

export const AgeVerification = () => {
  const [isVisible, setIsVisible] = useState(true); // Default to true to prevent flash
  const [isInitialized, setIsInitialized] = useState(false);

  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check local storage on mount
    const isVerified = localStorage.getItem('age-verified');
    if (isVerified === 'true') {
      setIsVisible(false);
    } else {
      document.body.style.overflow = 'hidden';
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVerify = () => {
    if (birthMonth === null || birthYear === null) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12

    let age = currentYear - birthYear;
    if (currentMonth < birthMonth) {
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

  // Don't render content until we know if it should be visible
  // But show a solid background immediately
  if (!isInitialized) return <div className='fixed inset-0 z-[100] bg-white' />;
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-[100] bg-white text-neutral-900 flex flex-col items-center justify-center p-4'>
      <div className='max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500'>
        <div className='space-y-3'>
          <h1 className='text-3xl md:text-4xl font-black uppercase tracking-tighter font-[family-name:var(--font-christ)]'>
            IQOS STORE
          </h1>
          <p className='text-neutral-400 text-xs md:text-md uppercase tracking-[0.3em] font-medium'>
            Официальная продукция
          </p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-2xl border border-neutral-50 relative overflow-visible'>
          <h2 className='text-xl font-bold mb-6 tracking-tight'>Подтвердите ваш возраст</h2>

          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              {/* Custom Month Dropdown */}
              <div className='relative' ref={monthRef}>
                <button
                  onClick={() => {
                    setIsMonthOpen(!isMonthOpen);
                    setIsYearOpen(false);
                  }}
                  className={`w-full flex items-center justify-between bg-neutral-50 border rounded-lg p-3 transition-all duration-200 ${isMonthOpen ? 'border-black ring-1 ring-black bg-white' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <span
                    className={`text-sm font-medium ${birthMonth === null ? 'text-neutral-400' : 'text-black'}`}
                  >
                    {birthMonth !== null ? MONTHS[birthMonth - 1] : 'Месяц'}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-400 transition-transform duration-300 ${isMonthOpen ? 'rotate-180 text-black' : ''}`}
                  />
                </button>

                {isMonthOpen && (
                  <div className='absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-2xl border border-neutral-100 py-2 z-[110] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200'>
                    {MONTHS.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => {
                          setBirthMonth(index + 1);
                          setIsMonthOpen(false);
                          setError('');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-neutral-200 ${birthMonth === index + 1 ? 'text-black font-bold' : 'text-neutral-600'}`}
                      >
                        <span className='text-[14px] py-1'>{month}</span>
                        {birthMonth === index + 1 && <Check size={14} className='text-black' />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Year Dropdown */}
              <div className='relative' ref={yearRef}>
                <button
                  onClick={() => {
                    setIsYearOpen(!isYearOpen);
                    setIsMonthOpen(false);
                  }}
                  className={`w-full flex items-center justify-between bg-neutral-50 border rounded-lg p-3 transition-all duration-200 ${isYearOpen ? 'border-black ring-1 ring-black bg-white' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <span
                    className={`text-sm font-medium ${birthYear === null ? 'text-neutral-400' : 'text-black'}`}
                  >
                    {birthYear !== null ? birthYear : 'Год'}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-400 transition-transform duration-300 ${isYearOpen ? 'rotate-180 text-black' : ''}`}
                  />
                </button>

                {isYearOpen && (
                  <div className='absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-2xl border border-neutral-100 py-2 z-[110] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200'>
                    {YEARS.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setBirthYear(year);
                          setIsYearOpen(false);
                          setError('');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-neutral-200 ${birthYear === year ? 'text-black font-bold' : 'text-neutral-600'}`}
                      >
                        <span className='text-[14px] py-1'>{year}</span>
                        {birthYear === year && <Check size={14} className='text-black' />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className='text-red-500 text-[11px] font-semibold bg-red-50 py-2 px-3 rounded-lg'>
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              className='w-full bg-black text-white font-black uppercase tracking-[0.2em] py-3 rounded-lg hover:bg-neutral-800 transition-all duration-300 shadow-lg shadow-black/10 text-xs'
            >
              Войти на сайт
            </button>
          </div>
        </div>

        <div className='space-y-4'>
          <p className='text-[9px] text-neutral-400 max-w-[240px] mx-auto leading-relaxed font-bold uppercase tracking-widest text-balance'>
            МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ
          </p>
        </div>
      </div>
    </div>
  );
};
