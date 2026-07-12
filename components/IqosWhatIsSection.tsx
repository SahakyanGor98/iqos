import Image from 'next/image';
import Link from 'next/link';
import { IQOS_HOME_TEASER, IQOS_ABOUT_IMAGES } from '@/lib/content/iqos-about';

export const IqosWhatIsSection = () => {
  return (
    <section className='w-full bg-white'>
      <div className='w-full max-w-none md:max-w-7xl md:mx-auto px-0 md:px-8'>
        <div className='relative h-[480px] md:h-[600px] overflow-hidden group w-full'>
          
          {/* Background Image */}
          <div className='absolute inset-0 z-0'>
            <Image
              src={IQOS_ABOUT_IMAGES.entry}
              alt='IQOS ILUMA — бездымная альтернатива курению'
              fill
              sizes='100vw'
              className='object-cover object-center transition-transform duration-700 group-hover:scale-105'
              priority
            />
          </div>

          {/* Background Overlay: Matches IQOS & Terea sections on mobile (z-10, bg-neutral-700 opacity-30) */}
          <div className='absolute inset-0 bg-neutral-700 z-10 opacity-30 md:opacity-50 transition-opacity duration-500 group-hover:opacity-40' />

          {/* Content Overlay */}
          <div className='relative z-20 h-full w-full flex flex-col justify-center items-center md:items-start text-center md:text-left text-white drop-shadow-lg p-8 md:p-16 pb-24 md:pb-16'>
            <div className='max-w-2xl space-y-4 md:space-y-6'>
              <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight'>
                {IQOS_HOME_TEASER.title}
              </h2>
              <p className='text-base md:text-lg font-bold text-white max-w-md mx-auto md:mx-0 leading-relaxed'>
                {IQOS_HOME_TEASER.subtitle}
              </p>
              
              {/* Desktop Button: Left-aligned and inline in the flex flow */}
              <Link
                href={IQOS_HOME_TEASER.ctaHref}
                className='hidden md:inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-full bg-white text-black hover:bg-neutral-200 shadow-none active:scale-[0.94] active:brightness-90 active:shadow-inner transition-all duration-100'
              >
                {IQOS_HOME_TEASER.ctaLabel}
              </Link>
            </div>

            {/* Mobile Button: Absolute positioned at the bottom, centered */}
            <Link
              href={IQOS_HOME_TEASER.ctaHref}
              className='md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 btn-primary bg-white text-black hover:bg-neutral-200 shadow-none active:scale-[0.94] active:brightness-90 active:shadow-inner transition-all duration-100'
            >
              {IQOS_HOME_TEASER.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};








