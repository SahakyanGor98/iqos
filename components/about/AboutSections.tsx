import Image from 'next/image';
import { IqosAboutSection } from '@/lib/content/iqos-about';

type Props = {
  section: IqosAboutSection;
};

export const AboutHistorySection = ({ section }: Props) => {
  return (
    <section className='relative min-h-[520px] md:min-h-[620px] flex items-center overflow-hidden bg-[#34303d]'>
      <Image
        src={section.backgroundImage ?? section.image ?? ''}
        alt={section.imageAlt ?? section.title}
        fill
        sizes='100vw'
        className='object-cover object-left hidden md:block'
      />
      <Image
        src={section.backgroundImageMobile ?? section.backgroundImage ?? section.image ?? ''}
        alt={section.imageAlt ?? section.title}
        fill
        sizes='100vw'
        className='object-cover object-center md:hidden'
      />

      <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-black/30 to-black/55 md:to-black/70' />

      <div className='relative z-10 w-full container-custom py-12 md:py-16'>
        <div className='grid lg:grid-cols-12 gap-8 items-center'>
          <div className='hidden lg:block lg:col-span-5' />

          <div className='lg:col-span-7 xl:col-span-6 xl:col-start-7 bg-white/40 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-xl'>
            <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 text-[#34303d]'>
              {section.title}
            </h2>

            <div className='space-y-4 text-neutral-700 leading-relaxed'>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {section.footnotes && (
              <div className='mt-6 space-y-2'>
                {section.footnotes.map((note) => (
                  <p key={note} className='text-xs text-neutral-500 leading-relaxed'>
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutDefaultSection = ({ section }: Props) => {
  return (
    <section className={`py-12 md:py-20 ${section.reverse ? 'bg-neutral-50' : 'bg-white'}`}>
      <div className='container-custom'>
        <div
          className={`grid gap-10 lg:gap-16 items-center ${
            section.image ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto text-center'
          }`}
        >
          {section.image && (
            <div
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 ${
                section.reverse ? 'lg:order-2' : ''
              }`}
            >
              <Image
                src={section.image}
                alt={section.imageAlt ?? section.title}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover'
              />
            </div>
          )}

          <div className={section.image ? '' : 'space-y-4'}>
            <h2
              className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 ${
                section.image ? '' : 'mx-auto max-w-2xl'
              }`}
            >
              {section.title}
            </h2>

            <div className='space-y-4 text-neutral-700 leading-relaxed'>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {section.footnotes && (
              <div className='mt-6 space-y-2'>
                {section.footnotes.map((note) => (
                  <p key={note} className='text-xs text-neutral-500 leading-relaxed'>
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutTextOnlySection = ({ section }: Props) => {
  return (
    <section className='py-12 md:py-20 bg-white'>
      <div className='container-custom max-w-3xl mx-auto text-center space-y-4'>
        <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight mb-5'>
          {section.title}
        </h2>

        <div className='space-y-4 text-neutral-700 leading-relaxed'>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};
