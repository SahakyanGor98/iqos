import { Metadata } from 'next';
import {
  TradeInHero,
  TradeInCalculator,
  TradeInSteps,
  TradeInBenefits,
  FaqAccordion,
  TextSeparator,
  Button,
} from '@/components';
import { ButtonVariant } from '@/components/ButtonTypes';
import { TRADE_IN_FAQ } from '@/lib/content/trade-in';

export const metadata: Metadata = {
  title: 'Трейд-ин IQOS | Обмен старых устройств на IQOS ILUMA со скидкой',
  description:
    'Программа Трейд-ин IQOS: обменяйте старое устройство IQOS, lil SOLID или аналоги на новый IQOS ILUMA со скидкой до 3 000 ₽. Принимаем в любом состоянии.',
};

export default function TradeInPage() {
  return (
    <div className='flex flex-col min-h-screen bg-neutral-50'>
      <TradeInHero />

      <TextSeparator />

      <TradeInCalculator />

      <TextSeparator />

      <TradeInSteps />

      <TextSeparator />

      <TradeInBenefits />

      <TextSeparator />

      <FaqAccordion
        items={TRADE_IN_FAQ}
        initialVisibleCount={5}
        enableExpandButton={false}
        title='Вопросы и ответы по Трейд-ин'
      />

      <TextSeparator />

      {/* Bottom CTA Section */}
      <section className='bg-neutral-50 text-[#34303d] py-12 md:py-20 px-6 text-center'>
        <div className='container-custom max-w-4xl mx-auto'>
          <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tight text-[#34303d] mb-4'>
            Готовы обновить свой IQOS?
          </h2>
          <p className='text-base md:text-lg text-[#34303d]/85 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed'>
            Рассчитайте точно стоимость вашего старого устройства за 1 минуту и получите новый IQOS ILUMA с курьерской доставкой.
          </p>
          <Button
            href='#calculator'
            variant={ButtonVariant.PRIMARY}
          >
            Перейти к калькулятору
          </Button>
        </div>
      </section>
    </div>
  );
}
