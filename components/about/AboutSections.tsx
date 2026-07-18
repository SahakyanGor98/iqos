import Image from 'next/image';
import { IqosAboutSection } from '@/lib/content/iqos-about';

type Props = {
  section: IqosAboutSection;
};

export const AboutHistorySection = ({ section }: Props) => {
  return (
    <section id={section.id} className='relative bg-neutral-50 text-[#34303d] overflow-hidden border-y border-neutral-100'>
      {/* Mobile view: First paragraph on top of image, second paragraph below image */}
      <div className='block md:hidden w-full'>
        {/* Top Image Banner with First Paragraph, using full aspect-[1/2] ratio matching 1024x2048 */}
        <div className='relative w-full aspect-[1/2] bg-neutral-100 overflow-hidden'>
          <Image
            src={section.backgroundImageMobile ?? section.backgroundImage ?? section.image ?? ''}
            alt={section.imageAlt ?? section.title}
            fill
            sizes='100vw'
            priority
            className='object-cover object-center'
          />
          {/* Subtle gradient overlay at the top for title readability */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent h-2/3' />
          
          {/* Beautiful glassmorphism container for first paragraph positioned at the top */}
          <div className='absolute top-0 inset-x-0 p-4 pt-6 text-left z-10'>
            <div className='bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-lg text-[#34303d]'>
              <h2 className='text-2xl font-black uppercase tracking-tight mb-3 text-[#34303d] text-balance'>
                {section.title}
              </h2>
              <p className='text-base text-[#34303d]/90 leading-relaxed text-pretty whitespace-pre-line'>
                {section.paragraphs[0]}
              </p>
            </div>
          </div>
        </div>
        
        {/* Remaining paragraphs and footnotes below image */}
        <div className='px-6 py-12 text-left bg-neutral-50 border-t border-neutral-200/50'>
          <div className='space-y-4 text-[#34303d]/90 leading-relaxed text-pretty text-base'>
            {section.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className='whitespace-pre-line'>{paragraph}</p>
            ))}
          </div>
          {section.footnotes && (
            <div className='mt-4 space-y-2 text-neutral-500 text-pretty'>
              {section.footnotes.map((note) => (
                <p key={note} className='text-xs leading-relaxed'>
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop view: side-by-side or background layout */}
      <div className='hidden md:flex min-h-[550px] md:min-h-[620px] items-center relative w-full'>
        <Image
          src={section.backgroundImage ?? section.image ?? ''}
          alt={section.imageAlt ?? section.title}
          fill
          sizes='100vw'
          className='object-cover object-left'
        />
        {/* Soft light overlay gradient spanning across the banner */}
        <div className='absolute inset-0 bg-gradient-to-r from-white/10 via-white/40 to-white/70' />

        <div className='relative z-10 w-full container-custom pb-12 md:py-16'>
          <div className='grid lg:grid-cols-12 gap-8 items-center'>
            <div className='hidden lg:block lg:col-span-5' />

            <div className='lg:col-span-7 xl:col-span-6 xl:col-start-7 bg-white/90 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-neutral-200/50 text-[#34303d]'>
              <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 text-[#34303d] text-balance'>
                {section.title}
              </h2>

              <div className='space-y-4 text-[#34303d]/90 leading-relaxed text-left text-pretty'>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className='whitespace-pre-line'>{paragraph}</p>
                ))}
              </div>

              {section.footnotes && (
                <div className='mt-4 space-y-2 text-left text-pretty border-t border-neutral-200/50 pt-4'>
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
      </div>
    </section>
  );
};

export const AboutDefaultSection = ({ section }: Props) => {
  return (
    <section id={section.id} className='pb-12 md:py-20 bg-neutral-50'>
      <div className='container-custom'>
        <div
          className={`grid gap-10 lg:gap-16 items-center ${
            section.image ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'
          }`}
        >
          {/* Text is order-2 (appears second on mobile after the image) */}
          <div className={`order-2 ${section.image ? '' : 'space-y-4'} ${section.reverse ? 'lg:order-2' : 'lg:order-1'} text-left`}>
            <h2
              className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-[#34303d] text-balance ${
                section.image ? '' : 'mx-auto max-w-2xl'
              }`}
            >
              {section.title}
            </h2>

            <div className='space-y-4 text-[#34303d]/90 leading-relaxed text-pretty'>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className='whitespace-pre-line'>{paragraph}</p>
              ))}
            </div>

            {section.footnotes && (
              <div className='mt-4 space-y-2 text-[#34303d]/70 text-pretty'>
                {section.footnotes.map((note) => (
                  <p key={note} className='text-xs leading-relaxed'>
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Image is order-1 (appears first on mobile) */}
          {section.image && (
            <div
              className={`order-1 relative aspect-[4/3] overflow-hidden -mx-4 md:mx-0 rounded-none md:rounded-2xl bg-neutral-100 ${
                section.reverse ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              <Image
                src={section.image}
                alt={section.imageAlt ?? section.title}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className={`object-cover ${section.imageClassName ?? 'object-center'}`}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const AboutTextOnlySection = ({ section }: Props) => {
  return (
    <section id={section.id} className='pb-12 md:py-20 bg-neutral-50'>
      <div className='container-custom max-w-3xl mx-auto text-left space-y-4'>
        <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 text-[#34303d] text-balance'>
          {section.title}
        </h2>

        <div className='space-y-4 text-[#34303d]/90 leading-relaxed text-pretty'>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className='whitespace-pre-line'>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};
