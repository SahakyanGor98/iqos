import Image from 'next/image';
import Link from 'next/link';
import { IQOS_HOME_TEASER, IQOS_ABOUT_IMAGES } from '@/lib/content/iqos-about';

export const IqosWhatIsSection = () => {
  return (
    <section className='bg-neutral-50'>
        <div className='grid md:grid-cols-2 gap-0 md:gap-10 lg:gap-16 items-center'>
          {/* Image */}
          <div className='relative h-[420px] md:aspect-square md:h-auto overflow-hidden md:rounded-2xl bg-neutral-100 py-12 md:py-16'>
            <Image
              src={IQOS_ABOUT_IMAGES.teaser}
              alt='IQOS ILUMA — бездымная альтернатива курению'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover'
            />

            {/* Mobile Overlay */}
            <div className='absolute inset-0 bg-black/45 md:hidden' />

            {/* Mobile Content */}
            <div className='absolute inset-0 md:hidden flex flex-col justify-end p-6 text-white'>
              <h2 className='text-3xl font-black uppercase tracking-tight mb-3'>
                {IQOS_HOME_TEASER.title}
              </h2>

              <p className='text-sm leading-relaxed mb-5'>
                {IQOS_HOME_TEASER.subtitle}
              </p>

              <Link
                href={IQOS_HOME_TEASER.ctaHref}
                className='inline-flex w-fit items-center justify-center px-6 py-3 rounded-full bg-white text-black text-sm font-bold uppercase tracking-wider active:scale-95 transition-transform'
              >
                {IQOS_HOME_TEASER.ctaLabel}
              </Link>
            </div>
          </div>

          {/* Desktop Content */}
          <div className='hidden md:block container-custom md:px-0'>
            <div className='space-y-5'>
              <div>
                <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-3'>
                  {IQOS_HOME_TEASER.title}
                </h2>

                <p className='text-lg md:text-xl font-bold text-neutral-800 leading-snug'>
                  {IQOS_HOME_TEASER.subtitle}
                </p>
              </div>

              <div className='space-y-4 text-neutral-700 leading-relaxed'>
                {IQOS_HOME_TEASER.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <p className='text-xs text-neutral-500 leading-relaxed'>
                {IQOS_HOME_TEASER.footnote}
              </p>

              <Link
                href={IQOS_HOME_TEASER.ctaHref}
                className='inline-flex items-center justify-center px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-full bg-black text-white hover:bg-neutral-800 transition-transform active:scale-95 active:brightness-90'
              >
                {IQOS_HOME_TEASER.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
    </section>
  );
};