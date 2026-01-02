import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden'>
      {/* IQOS Section */}
      <section className='relative flex-1 group overflow-hidden border-b md:border-b-0 md:border-r border-white/10'>
        <div className='absolute inset-0 bg-neutral-900 z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-40'></div>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/iqos.webp'
            alt='IQOS Device Background'
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-105'
            priority
          />
        </div>

        <div className='relative z-20 h-full flex flex-col justify-center items-center text-center p-8 text-white'>
          <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
            IQOS ILUMA
          </h2>
          <p className='text-lg md:text-xl text-neutral-200 mb-8 max-w-md translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100'>
            Революционная технология индукционного нагревания табака без лезвия.
          </p>
          <Link
            href='/products/iqos'
            className='btn-primary bg-white text-black hover:bg-neutral-200 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200'
          >
            Выбрать устройство
          </Link>
        </div>
      </section>

      {/* Terea Section */}
      <section className='relative flex-1 group overflow-hidden'>
        <div className='absolute inset-0 bg-neutral-800 z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-40'></div>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/terea.webp'
            alt='Terea Sticks Background'
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-105'
            priority
          />
        </div>

        <div className='relative z-20 h-full flex flex-col justify-center items-center text-center p-8 text-white'>
          <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
            Стики Terea
          </h2>
          <p className='text-lg md:text-xl text-neutral-200 mb-8 max-w-md translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100'>
            Широкая палитра вкусов для вашего устройства IQOS Iluma.
          </p>
          <Link
            href='/products/terea'
            className='btn-primary bg-white text-black hover:bg-neutral-200 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200'
          >
            Каталог вкусов
          </Link>
        </div>
      </section>
    </div>
  );
}
