'use client';

const TRADE_IN_STEPS = [
  {
    step: '01',
    title: 'Выберите устройства',
    description:
      'Укажите модель вашего старого устройства в онлайн-калькуляторе и выберите новый IQOS ILUMA.',
  },
  {
    step: '02',
    title: 'Оформите заявку за 1 минуту',
    description:
      'Заполните имя и номер телефона. Наш специалист свяжется с вами для подтверждения обмена.',
  },
  {
    step: '03',
    title: 'Простой обмен при получении',
    description:
      'Передайте старое устройство в точке выдачи и заберите новый IQOS ILUMA со скидкой.',
  },
];

export const TradeInSteps = () => {
  return (
    <section className='py-14 md:py-24 px-4 md:px-6 bg-neutral-50 text-[#34303d]'>
      <div className='container-custom max-w-5xl mx-auto'>
        <div className='text-left md:text-center mb-10 md:mb-14'>
          <h2 className='text-3xl md:text-5xl font-black uppercase tracking-tight text-[#34303d] mb-3'>
            Как происходит обмен старого девайса
          </h2>
          <p className='text-[#34303d]/80 text-sm md:text-base max-w-2xl mx-auto'>
            3 простых шага для перехода на новый IQOS ILUMA со скидкой
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {TRADE_IN_STEPS.map((item, idx) => (
            <div
              key={idx}
              className='bg-white p-5 rounded-2xl border border-neutral-200/80 flex flex-col justify-between hover:border-[#34303D] transition-colors duration-200 shadow-xs'
            >
              <div>
                <div className='flex items-start gap-2.5 mb-3'>
                  <span className='px-2.5 py-1 rounded-lg bg-[#34303D] text-white text-xs font-black tracking-wider shrink-0 mt-0.5'>
                    {item.step}
                  </span>
                  <h3 className='text-base font-bold uppercase tracking-tight text-[#34303d] leading-snug'>
                    {item.title}
                  </h3>
                </div>
                <p className='text-[#34303d]/80 text-xs sm:text-sm leading-relaxed font-normal'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
