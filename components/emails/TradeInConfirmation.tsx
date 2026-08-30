import { emailStyles } from './styles';
import { CONTACTS } from '@/lib/constants';

type Props = {
  orderId: string;
  customerName: string;
  oldDevice: string;
  targetDevice: string;
  estimatedDiscount: number;
  finalPrice: number;
};

const formatRub = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;

export const TradeInConfirmation = ({
  orderId,
  customerName,
  oldDevice,
  targetDevice,
  estimatedDiscount,
  finalPrice,
}: Props) => {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        {/* Header */}
        <div style={emailStyles.header}>
          <a href={CONTACTS.website.url} style={emailStyles.logo}>
            IQOS STORE
          </a>
        </div>

        {/* Hero */}
        <h1 style={emailStyles.heading}>Заявка на Трейд-ин принята!</h1>

        <p style={emailStyles.text}>
          Здравствуйте, <strong>{customerName}</strong>!
          <br />
          Ваша заявка <strong>#{orderId}</strong> на обмен устройства принята в обработку. Мы
          свяжемся с вами в ближайшее время для подтверждения деталей обмена и доставки по Москве.
        </p>

        {/* Exchange summary */}
        <div style={emailStyles.section}>
          <table style={emailStyles.table}>
            <tbody>
              <tr>
                <td style={emailStyles.td}>Сдаёте</td>
                <td style={{ ...emailStyles.td, textAlign: 'right', fontWeight: 'bold' }}>
                  {oldDevice}
                </td>
              </tr>
              <tr>
                <td style={emailStyles.td}>Получаете</td>
                <td style={{ ...emailStyles.td, textAlign: 'right', fontWeight: 'bold' }}>
                  {targetDevice}
                </td>
              </tr>
              <tr>
                <td style={emailStyles.td}>Скидка по Трейд-ин</td>
                <td style={{ ...emailStyles.td, textAlign: 'right', color: '#059669' }}>
                  −{formatRub(estimatedDiscount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={emailStyles.total}>К оплате курьеру: {formatRub(finalPrice)}</div>
        </div>

        {/* Contact Info */}
        <div
          style={{
            ...emailStyles.section,
            backgroundColor: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>Наши контакты</h3>
          <div style={emailStyles.text}>
            <div style={emailStyles.contactItem}>
              <strong>Telegram:</strong>{' '}
              <a href={CONTACTS.telegram.link} style={{ color: '#333' }}>
                {CONTACTS.telegram.handle}
              </a>
            </div>
            <div style={emailStyles.contactItem}>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${CONTACTS.email}`} style={{ color: '#333' }}>
                {CONTACTS.email}
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={emailStyles.footer}>
          <p>© {new Date().getFullYear()} IQOS STORE. Все права защищены.</p>
          <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </div>
  );
};
