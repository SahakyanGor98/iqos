import Link from 'next/link';
import Image from 'next/image';
import { CONTACTS, ROUTES } from '@/lib/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className='w-full bg-[#34303c] text-white pt-12 pb-24 mt-auto'>
        <div className='container-custom'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
            {/* Column 1: Brand */}
            <div>
              <div className='flex items-center gap-3 text-xl md:text-2xl tracking-tighter uppercase mb-4 font-[family-name:var(--font-christ)]'>
                <Image src='/icon1.webp' alt='IQOS Logo' width={32} height={32} />
                IQOS STORE
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h3 className='font-bold text-lg mb-4'>Навигация</h3>
              <ul className='space-y-2 text-sm text-gray-400'>
                <li>
                  <Link href={ROUTES.catalog.iqos} className='hover:text-white transition-colors'>
                    Устройства IQOS
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.catalog.terea} className='hover:text-white transition-colors'>
                    Стики TEREA
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.contact} className='hover:text-white transition-colors'>
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contacts */}
            <div>
              <h3 className='font-bold text-lg mb-4'>Связаться с нами</h3>
              <ul className='space-y-3 text-sm text-gray-400'>
                <li className='flex items-center gap-2'>
                  <span className='text-white font-medium'>Telegram:</span>
                  <a
                    href={CONTACTS.telegram.link}
                    target='_blank'
                    rel='noreferrer'
                    className='hover:text-white transition-colors'
                  >
                    {CONTACTS.telegram.handle}
                  </a>
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-white font-medium'>Email:</span>
                  <a
                    href={`mailto:${CONTACTS.email}`}
                    className='hover:text-white transition-colors'
                  >
                    {CONTACTS.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className='pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-neutral-500 text-xs'>
              &copy; {currentYear} IQOS Store. Все права защищены.
            </p>
          </div>
        </div>
      </footer>

      {/* Fixed Bottom Disclaimer */}
      <div className='fixed bottom-0 left-0 w-full bg-[#272a32] text-white py-3 z-50 text-center px-4'>
        <p className='text-[10px] md:text-sm font-bold uppercase tracking-widest text-neutral-400'>
          МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ
        </p>
      </div>
    </>
  );
};
