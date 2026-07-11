import Image from 'next/image';
import Link from 'next/link';
import { IQOS_HOME_TEASER, IQOS_ABOUT_IMAGES } from '@/lib/content/iqos-about';

export const IqosWhatIsSection = () => {
  return (
    <section className='py-12 md:py-20 bg-white border-b border-neutral-100'>
      <div className='container-custom'>
        <div className='grid md:grid-cols-2 gap-10 lg:gap-16 items-center'>
          
          {/* Text is order-2 (appears second on mobile) */}
          <div className='order-2 space-y-5 text-left'>
            <div>
              <h2 className='text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 text-[#34303d] text-balance'>
                {IQOS_HOME_TEASER.title}
              </h2>

              <p className='text-lg font-bold text-[#34303d]/90 leading-snug text-balance'>
                {IQOS_HOME_TEASER.subtitle}
              </p>
            </div>

            <div className='space-y-4 text-[#34303d]/80 leading-relaxed text-pretty'>
              {IQOS_HOME_TEASER.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <p className='text-xs text-neutral-500 leading-relaxed text-pretty'>
              {IQOS_HOME_TEASER.footnote}
            </p>

            <Link
              href={IQOS_HOME_TEASER.ctaHref}
              className='inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-full bg-[#34303D] text-white hover:bg-black transition-all duration-300 active:scale-95'
            >
              {IQOS_HOME_TEASER.ctaLabel}
            </Link>
          </div>

          {/* Image is order-1 (appears first on mobile) */}
          <div className='order-1 relative aspect-[4/3] md:aspect-square overflow-hidden -mx-4 md:mx-0 rounded-none md:rounded-2xl bg-neutral-100'>
            <Image
              src={IQOS_ABOUT_IMAGES.teaser}
              alt='IQOS ILUMA — бездымная альтернатива курению'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover'
            />
          </div>

        </div>
      </div>
    </section>
  );
};
