import Image from 'next/image';
import { IqosAboutSection } from '@/lib/content/iqos-about';

type Props = {
  section: IqosAboutSection;
};

export const AboutHistorySection = ({ section }: Props) => {
  return (
    <section className='relative bg-[#34303d] text-white overflow-hidden'>
      {/* Mobile view: First paragraph on top of image, second paragraph below image */}
      <div className='block md:hidden w-full'>
        {/* Top Image Banner with First Paragraph, using full aspect-[1/2] ratio matching 1024x2048 */}
        <div className='relative w-full aspect-[1/2] bg-[#34303d] overflow-hidden'>
          <Image
            src={section.backgroundImageMobile ?? section.backgroundImage ?? section.image ?? ''}
            alt={section.imageAlt ?? section.title}
            fill
            sizes='100vw'
            priority
            className='object-cover object-center'
          />
          {/* Subtle gradient overlay at the top for title readability */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent h-2/3' />
          
          {/* Beautiful glassmorphism container for first paragraph positioned at the top */}
          <div className='absolute top-0 inset-x-0 p-4 pt-6 text-left z-10'>
            <div className='bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl'>
              <h2 className='text-xl font-black uppercase tracking-tight mb-3 text-white text-balance'>
                {section.title}
              </h2>
              <p className='text-sm text-white/95 leading-relaxed text-pretty whitespace-pre-line'>
                {section.paragraphs[0]}
              </p>
            </div>
          </div>
        </div>
        
        {/* Remaining paragraphs and footnotes below image */}
        <div className='p-6 py-8 text-left bg-[#34303d] border-t border-white/5'>
          <div className='space-y-4 text-white/90 leading-relaxed text-pretty text-sm'>
            {section.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className='whitespace-pre-line'>{paragraph}</p>
            ))}
          </div>
          {section.footnotes && (
            <div className='mt-6 space-y-2 text-white/60 text-pretty'>
              {section.footnotes.map((note) => (
                <p key={note} className='text-[10px] leading-relaxed'>
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
        <div className='absolute inset-0 bg-gradient-to-r from-black/10 via-black/30 to-black/50' />

        <div className='relative z-10 w-full container-custom py-12 md:py-16'>
          <div className='grid lg:grid-cols-12 gap-8 items-center'>
            <div className='hidden lg:block lg:col-span-5' />

            <div className='lg:col-span-7 xl:col-span-6 xl:col-start-7 bg-[#27242e]/70 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-xl border border-white/10 text-white'>
              <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 text-white text-balance'>
                {section.title}
              </h2>

              <div className='space-y-4 text-white/90 leading-relaxed text-left text-pretty'>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className='whitespace-pre-line'>{paragraph}</p>
                ))}
              </div>

              {section.footnotes && (
                <div className='mt-6 space-y-2 text-left text-pretty'>
                  {section.footnotes.map((note) => (
                    <p key={note} className='text-xs text-white/60 leading-relaxed'>
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
    <section className={`py-12 md:py-20 ${section.reverse ? 'bg-neutral-50' : 'bg-white'}`}>
      <div className='container-custom'>
        <div
          className={`grid gap-10 lg:gap-16 items-center ${
            section.image ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'
          }`}
        >
          {/* Text is order-2 (appears second on mobile after the image) */}
          <div className={`order-2 ${section.image ? '' : 'space-y-4'} ${section.reverse ? 'lg:order-2' : 'lg:order-1'} text-left`}>
            <h2
              className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 text-[#34303d] text-balance ${
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
              <div className='mt-6 space-y-2 text-[#34303d]/70 text-pretty'>
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
    <section className='py-12 md:py-20 bg-white'>
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
