import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full bg-[#34303D] text-white pb-8 mt-auto'>
      <div className='container-custom'>

        {/* Bottom */}
        <div className='pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-neutral-500 text-xs'>
            &copy; {currentYear} IQOS Store. Все права защищены.
          </p>
          <div className='flex items-center gap-6'>
            <span className='text-neutral-500 text-xs uppercase tracking-wider'>
              МИНЗДРАВ ПРЕДУПРЕЖДАЕТ: КУРЕНИЕ ВРЕДИТ ВАШЕМУ ЗДОРОВЬЮ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
