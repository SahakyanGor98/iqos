import React from 'react';
import { emailStyles } from './styles';
import { CONTACTS } from '@/lib/constants';

type Props = {
  name: string;
  phone: string;
  email?: string;
  oldDevice: string;
  targetDevice: string;
  estimatedDiscount: number;
  finalPrice: number;
  address?: string;
  comment?: string;
};

const formatRub = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;

export const TradeInNotification = ({
  name,
  phone,
  email,
  oldDevice,
  targetDevice,
  estimatedDiscount,
  finalPrice,
  address,
  comment,
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
        <h1 style={emailStyles.heading}>Новая заявка на Трейд-ин</h1>

        <p style={emailStyles.text}>
          Получена новая заявка на обмен устройства через калькулятор Трейд-ин.
        </p>

        {/* Contact details */}
        <div
          style={{
            ...emailStyles.section,
            backgroundColor: '#f9fafb',
            padding: '24px',
            borderRadius: '12px',
          }}
        >
          <div style={emailStyles.text}>
            <div style={emailStyles.contactItem}>
              <strong>Имя:</strong> {name}
            </div>
            <div style={emailStyles.contactItem}>
              <strong>Телефон:</strong>{' '}
              <a href={`tel:${phone}`} style={{ color: '#333' }}>
                {phone}
              </a>
            </div>
            <div style={emailStyles.contactItem}>
              <strong>Email:</strong>{' '}
              {email ? (
                <a href={`mailto:${email}`} style={{ color: '#333' }}>
                  {email}
                </a>
              ) : (
                'Не указан'
              )}
            </div>
            <div style={emailStyles.contactItem}>
              <strong>Город:</strong> Москва
            </div>
            <div style={emailStyles.contactItem}>
              <strong>Адрес доставки:</strong> {address || 'Не указан'}
            </div>
          </div>
        </div>

        {/* Exchange details */}
        <div style={emailStyles.section}>
          <table style={emailStyles.table}>
            <tbody>
              <tr>
                <td style={emailStyles.td}>Сдаваемое устройство</td>
                <td style={{ ...emailStyles.td, textAlign: 'right' as const, fontWeight: 'bold' }}>
                  {oldDevice}
                </td>
              </tr>
              <tr>
                <td style={emailStyles.td}>Новое устройство</td>
                <td style={{ ...emailStyles.td, textAlign: 'right' as const, fontWeight: 'bold' }}>
                  {targetDevice}
                </td>
              </tr>
              <tr>
                <td style={emailStyles.td}>Скидка по Трейд-ин</td>
                <td
                  style={{
                    ...emailStyles.td,
                    textAlign: 'right' as const,
                    color: '#047857',
                    fontWeight: 'bold',
                  }}
                >
                  −{formatRub(estimatedDiscount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={emailStyles.total}>Итого к оплате: {formatRub(finalPrice)}</div>
        </div>

        {/* Comment */}
        {comment ? (
          <div style={emailStyles.section}>
            <h2
              style={{
                fontSize: '18px',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px',
                marginBottom: '15px',
              }}
            >
              Комментарий:
            </h2>
            <div
              style={{
                padding: '20px',
                backgroundColor: '#fff',
                border: '1px solid #eee',
                borderRadius: '8px',
                fontStyle: 'italic',
                color: '#555',
                lineHeight: '1.6',
              }}
            >
              «{comment}»
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div style={emailStyles.footer}>
          <p>© {new Date().getFullYear()} IQOS STORE. Служебное уведомление.</p>
        </div>
      </div>
    </div>
  );
};
