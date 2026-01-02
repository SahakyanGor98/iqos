import { ContactForm } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты | IQOS & TEREA',
  description: 'Свяжитесь с нами для консультации или поддержки. Telegram, Email, Телефон.',
};

export default function ContactPage() {
  return (
    <div className='container-custom py-12 md:py-20'>
      <div className='grid md:grid-cols-2 gap-12 lg:gap-20 items-start'>
        {/* Info Column */}
        <div className='space-y-8 animate-in slide-in-from-left duration-500'>
          <div>
            <span className='text-sm font-bold tracking-widest text-neutral-500 uppercase mb-2 block'>
              Поддержка
            </span>
            <h1 className='text-4xl md:text-5xl font-black mb-6'>
              Мы всегда на <br /> связи
            </h1>
            <p className='text-lg text-neutral-600 leading-relaxed'>
              У вас возникли вопросы по устройствам IQOS или стикам TEREA? Наша команда готова
              помочь вам с выбором или решением любых проблем.
            </p>
          </div>

          <div className='flex flex-col gap-6'>
            <div className='p-6 bg-neutral-50 rounded-2xl border border-neutral-100'>
              <h3 className='font-bold text-lg mb-2'>Telegram</h3>
              <p className='text-neutral-600 mb-4'>
                Самый быстрый способ получить ответ. Пишите нам в любое время.
              </p>
              <a
                href='https://t.me/placeholder' // TODO: Update Telegram link
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center px-6 py-3 bg-[#229ED9] text-white rounded-full font-bold hover:bg-[#1E8BBF] transition active:scale-95'
              >
                <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z' />
                </svg>
                Написать в Telegram
              </a>
            </div>

            <div className='p-6 bg-neutral-50 rounded-2xl border border-neutral-100'>
              <h3 className='font-bold text-lg mb-2'>Email</h3>
              <p className='text-neutral-600'>Example@domain.com</p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className='animate-in slide-in-from-right duration-500 delay-100'>
          <div className='bg-white rounded-3xl p-1 md:p-2 border border-neutral-100 shadow-xl shadow-neutral-100/50'>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
