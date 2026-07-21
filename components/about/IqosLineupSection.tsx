import { Button } from '../Button';
import { ButtonVariant } from '../ButtonTypes';
import { IqosLineupItem } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { formatDeviceTitle, fixCasing } from '@/lib/utils';

type Props = {
  devices: IqosLineupItem[];
};

const getImageSrc = (image: string) =>
  image.startsWith('http') ? `/api/proxy?url=${encodeURIComponent(image)}` : image;

const getCardStyle = (line: string) => {
  switch (line) {
    case 'i prime':
      return {
        // Aspen Green (Sage)
        card: 'bg-[#CCE3E0] border-[#B8D4CE]',
        text: 'text-[#34303D]',
        desc: 'text-[#34303D]/85',
      };
    case 'i':
      return {
        // Breeze Blue (Steel Blue)
        card: 'bg-[#D1DFE5] border-[#BDD2DC]',
        text: 'text-[#34303D]',
        desc: 'text-[#34303D]/85',
      };
    case 'i-one':
      return {
        // Digital Violet
        card: 'bg-[#E7E7F1] border-[#D6D6E7]',
        text: 'text-[#34303D]',
        desc: 'text-[#34303D]/85',
      };
    default:
      return {
        card: 'bg-neutral-50 border-neutral-200',
        text: 'text-[#34303D]',
        desc: 'text-[#34303D]/85',
      };
  }
};

export const IqosLineupSection = ({ devices }: Props) => {
  return (
    <section className='py-12 md:py-20 bg-[#fffdfb] text-[#34303d] border-y border-neutral-100'>
      <div className='container-custom'>
        <div className='text-center mb-8 md:mb-16'>
          <h2 className='text-2xl md:text-4xl font-black tracking-tight mb-4 text-[#34303d] text-balance'>
            {formatDeviceTitle(fixCasing('Изучить линейку IQOS ILUMA i', true))}
          </h2>
          <p className='text-[#34303d]/80 max-w-2xl mx-auto leading-relaxed text-pretty'>
            Откройте для себя устройства IQOS ILUMA i — инновационные, умные и интуитивные решения
            для каждого дня.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 mb-12'>
          {devices.map((device) => {
            const styles = getCardStyle(device.line);
            return (
              <div
                key={device.line}
                className={`relative overflow-hidden rounded-3xl border flex flex-col transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-neutral-200/40 ${styles.card}`}
              >
                <div className='p-6 md:p-8 text-center flex flex-col flex-1 justify-between gap-y-6'>
                  <div className='space-y-2'>
                    <h3 className={`text-xl md:text-2xl font-black tracking-tight text-center ${styles.text}`}>
                      {formatDeviceTitle(fixCasing(device.name, true), '#3c3c3cff', '#000000ff')}
                    </h3>
                  </div>

                  <div className='relative aspect-square w-full max-w-[220px] mx-auto overflow-hidden flex items-center justify-center p-2'>
                    <img
                      src={getImageSrc(device.image)}
                      alt={device.name}
                      className='w-full h-full object-contain relative z-10 transition-transform duration-700 hover:scale-105'
                      loading='lazy'
                    />
                  </div>

                  <div className='space-y-5'>
                    <p className={`text-sm leading-relaxed ${styles.desc} text-pretty`}>
                      {device.description}
                    </p>
                    <Button
                      href={`${ROUTES.catalog.iqos}/${device.slug}`}
                      variant={ButtonVariant.PRIMARY}
                      className='self-center'
                    >
                      {device.ctaLabel}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='text-center'>
          <Button
            href={ROUTES.catalog.iqos}
            variant={ButtonVariant.PRIMARY}
          >
            Смотреть все устройства
          </Button>
        </div>
      </div>
    </section>
  );
};
