import Link from 'next/link';
import { IqosLineupItem } from '@/lib/api';
import { ROUTES } from '@/lib/constants';

type Props = {
  devices: IqosLineupItem[];
};

const getImageSrc = (image: string) =>
  image.startsWith('http') ? `/api/proxy?url=${encodeURIComponent(image)}` : image;

export const IqosLineupSection = ({ devices }: Props) => {
  return (
    <section className='py-12 md:py-20 bg-[#34303d] text-white'>
      <div className='container-custom'>
        <div className='text-center mb-10 md:mb-14'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight mb-4'>
            Изучить линейку IQOS ILUMA i
          </h2>
          <p className='text-neutral-300 max-w-2xl mx-auto leading-relaxed'>
            Откройте для себя устройства IQOS ILUMA i — инновационные, умные и интуитивные решения
            для каждого дня.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-6 mb-10'>
          {devices.map((device) => (
            <div
              key={device.line}
              className='rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col'
            >
              <div className='relative aspect-square bg-white/10'>
                <img
                  src={getImageSrc(device.image)}
                  alt={device.name}
                  className='w-full h-full object-contain p-6'
                  loading='lazy'
                />
              </div>

              <div className='p-6 md:p-8 text-center flex flex-col flex-1'>
                <h3 className='text-lg md:text-xl font-black tracking-tight mb-3'>{device.name}</h3>
                <p className='text-neutral-300 text-sm leading-relaxed mb-6 flex-1'>
                  {device.description}
                </p>
                <Link
                  href={`${ROUTES.catalog.iqos}/${device.slug}`}
                  className='btn-primary px-6 py-3 text-xs tracking-wider border border-white/30 hover:bg-white hover:text-black transition-colors'
                >
                  {device.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center'>
          <Link
            href={ROUTES.catalog.iqos}
            className='btn-primary bg-white text-black hover:bg-neutral-200'
          >
            Смотреть все устройства
          </Link>
        </div>
      </div>
    </section>
  );
};
