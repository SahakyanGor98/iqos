import React from 'react';
import { emailStyles } from './styles';

type OrderItem = {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
};

type Props = {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
};

export const OrderConfirmation = ({ orderId, customerName, items, totalAmount }: Props) => {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        {/* Header */}
        <div style={emailStyles.header}>
          <a href="https://24iqos.ru" style={emailStyles.logo}>
            IQOS STORE
          </a>
        </div>

        {/* Hero */}
        <h1 style={emailStyles.heading}>Спасибо за ваш заказ!</h1>

        <p style={emailStyles.text}>
          Здравствуйте, <strong>{customerName}</strong>!
          <br />
          Ваш заказ <strong>#{orderId}</strong> принят в обработку. Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.
        </p>

        {/* Order Details */}
        <div style={emailStyles.section}>
          <table style={emailStyles.table}>
            <thead>
              <tr>
                <th style={emailStyles.th}>Товар</th>
                <th style={emailStyles.th}>Кол-во</th>
                <th style={{ ...emailStyles.th, textAlign: 'right' }}>Цена</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={emailStyles.td}>{item.product.title}</td>
                  <td style={emailStyles.td}>x{item.quantity}</td>
                  <td style={{ ...emailStyles.td, textAlign: 'right' }}>
                    {item.product.price * item.quantity} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={emailStyles.total}>
            Итого: {totalAmount} ₽
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ ...emailStyles.section, backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>Наши контакты</h3>
          <div style={emailStyles.text}>
            <div style={emailStyles.contactItem}>
              <strong>Telegram:</strong> <a href="https://t.me/iqos_msk" style={{ color: '#333' }}>@iqos_msk</a>
            </div>
            <div style={emailStyles.contactItem}>
              <strong>Email:</strong> <a href="mailto:24iqos.info@gmail.com" style={{ color: '#333' }}>24iqos.info@gmail.com</a>
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
