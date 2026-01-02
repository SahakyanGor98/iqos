import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full border-t border-[var(--border)] bg-neutral-50 pt-16 pb-8'>
      <div className='container-custom'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
          {/* Brand */}
          <div className='space-y-4'>
            <Link href='/' className='text-2xl font-black tracking-tighter uppercase inline-block'>
              IQOS<span className='text-neutral-400'>STORE</span>
            </Link>
            <p className='text-neutral-500 text-sm leading-relaxed max-w-xs'>
              Премиальные устройства для нагревания табака и стики. Новый взгляд на привычные вещи.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h3 className='font-semibold text-neutral-900 mb-6'>Каталог</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/products/iqos'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  Устройства IQOS
                </Link>
              </li>
              <li>
                <Link
                  href='/products/terea'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  Стики Terea
                </Link>
              </li>
              <li>
                <Link
                  href='/products'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  Все товары
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className='font-semibold text-neutral-900 mb-6'>Компания</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/about'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href='/delivery'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  Доставка и оплата
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='font-semibold text-neutral-900 mb-6'>Информация</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/terms'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-neutral-500 hover:text-black transition-colors text-sm'
                >
                  Конфиденциальность
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className='pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-neutral-400 text-xs'>
            &copy; {currentYear} IQOS Store. Все права защищены.
          </p>
          <div className='flex items-center gap-6'>
            <span className='text-neutral-400 text-xs'>
              МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
