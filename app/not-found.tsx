import { Button } from '@/components/Button';
import { ButtonVariant } from '@/components/ButtonTypes';

export default function NotFound() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-[#fffdfb] text-[#34303d]'>
      <p className='text-6xl md:text-8xl font-black tracking-tighter text-[#34303d]'>404</p>
      <h1 className='mt-4 text-2xl md:text-3xl font-black uppercase tracking-tight'>
        Страница не найдена
      </h1>
      <p className='mt-3 max-w-md text-sm md:text-base text-neutral-500 leading-relaxed'>
        Возможно, страница была удалена или вы перешли по неверной ссылке. Давайте вернём вас на
        правильный путь.
      </p>
      <div className='mt-8 flex flex-col sm:flex-row items-center gap-3'>
        <Button href='/' variant={ButtonVariant.PRIMARY}>
          На главную
        </Button>
        <Button href='/products/iqos' variant={ButtonVariant.SECONDARY}>
          В каталог
        </Button>
      </div>
    </div>
  );
}
