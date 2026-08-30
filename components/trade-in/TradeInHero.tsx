import { Button } from '@/components/Button';
import { ButtonVariant } from '@/components/ButtonTypes';

const HERO_HIGHLIGHTS = [
  {
    badge: '2 500₽',
    label: 'Макс. скидка',
    value: 'До 2 500 ₽ экономии',
  },
  {
    badge: '100%',
    label: 'Прием девайсов',
    value: 'В любом состоянии',
  },
  {
    badge: '1 мин',
    label: 'Быстрый обмен',
    value: 'Прямо при доставке',
  },
];

export const TradeInHero = () => {
  return (
    <section className='relative overflow-hidden bg-neutral-50 text-[#34303d] py-12 md:py-20 px-4 md:px-6'>
      <div className='container-custom relative z-10 max-w-5xl mx-auto text-left sm:text-center'>
        {/* Eyebrow Tag */}
        <p className='text-xs uppercase font-bold tracking-widest text-neutral-500 mb-3'>
          Трейд-ин в Москве
        </p>

        {/* Title: Matching app standard (text-2xl md:text-4xl font-black uppercase tracking-tight) */}
        <h1 className='text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-4 text-[#34303d] text-balance'>
          Сдайте старый IQOS —<br className='hidden sm:inline' />
          <span>получите новый ILUMA со скидкой</span>
        </h1>

        {/* Subtitle */}
        <p className='text-sm md:text-base text-[#34303d]/85 max-w-2xl sm:mx-auto leading-relaxed mb-8 font-normal text-pretty'>
          Простой и удобный обмен устройств в Москве. Принимаем модели IQOS, lil SOLID и другие
          бренды в любом состоянии с выгодой до{' '}
          <strong className='text-[#34303d] font-bold'>2 500 ₽</strong>.
        </p>

        {/* Action Button */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 mb-10'>
          <Button href='#calculator' variant={ButtonVariant.PRIMARY}>
            Рассчитать скидку в калькуляторе
          </Button>
        </div>

        {/* Feature Badges Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-neutral-200/80 pt-8 max-w-3xl sm:mx-auto text-left'>
          {HERO_HIGHLIGHTS.map((item, idx) => (
            <div
              key={idx}
              className='flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs'
            >
              {item.badge && (
                <span className='px-3 h-9 rounded-xl bg-neutral-100 text-[#34303d] font-black text-xs flex items-center justify-center shrink-0 whitespace-nowrap border border-neutral-200'>
                  {item.badge}
                </span>
              )}
              <div>
                <p className='text-[10px] text-[#34303d]/70 uppercase tracking-wider font-semibold'>
                  {item.label}
                </p>
                <p className='text-xs sm:text-sm font-bold text-[#34303d]'>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
