export const PromoBlock = () => {
  return (
    <div className='w-full bg-neutral-100 border-y border-neutral-200'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center gap-2 text-sm text-neutral-800'>
          <span>🎁</span>
          <span>Скидка -10% на первый заказ</span>
          <span className='font-semibold'>FIRST10</span>
        </div>
        <a href='/products' className='text-sm font-semibold underline'>
          Получить
        </a>
      </div>
    </div>
  );
};
