import React from 'react';
import { emailStyles } from './styles';
import { CONTACTS } from '@/lib/constants';

type Props = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export const ContactNotification = ({ name, email, phone, message }: Props) => {
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
        <h1 style={emailStyles.heading}>Новое сообщение</h1>

        <p style={emailStyles.text}>
          Получено новое сообщение через форму обратной связи на сайте.
        </p>

        {/* Details */}
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
              <strong>Email:</strong>{' '}
              <a href={`mailto:${email}`} style={{ color: '#333' }}>
                {email}
              </a>
            </div>
            <div style={emailStyles.contactItem}>
              <strong>Телефон:</strong>{' '}
              <a href={`tel:${phone}`} style={{ color: '#333' }}>
                {phone}
              </a>
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={emailStyles.section}>
          <h2
            style={{
              fontSize: '18px',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '15px',
            }}
          >
            Текст сообщения:
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
            &laquo;{message}&raquo;
          </div>
        </div>

        {/* Footer */}
        <div style={emailStyles.footer}>
          <p>© {new Date().getFullYear()} IQOS STORE. Служебное уведомление.</p>
        </div>
      </div>
    </div>
  );
};
