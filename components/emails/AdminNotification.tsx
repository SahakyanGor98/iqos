import React from 'react';
import { emailStyles } from './styles';

type OrderItem = {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
};

type CustomerInfo = {
  fullName: string;
  phone: string;
  email: string;
  message?: string;
};

type Props = {
  orderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  promoCode?: string;
  discount?: number;
};

export const AdminNotification = ({
  orderId,
  customer,
  items,
  totalAmount,
  promoCode,
  discount,
}: Props) => {
  return (
    <div style={emailStyles.body}>
      <div style={emailStyles.container}>
        {/* Header */}
        <div style={{ ...emailStyles.header, borderBottom: '2px solid #000' }}>
          <div style={emailStyles.logo}>НОВЫЙ ЗАКАЗ #{orderId}</div>
        </div>

        {/* Customer Details */}
        <div style={emailStyles.section}>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Данные клиента
          </h2>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', color: '#666', width: '120px' }}>Имя:</td>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>{customer.fullName}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#666' }}>Телефон:</td>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>
                  <a href={`tel:${customer.phone}`} style={{ color: '#333' }}>
                    {customer.phone}
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#666' }}>Email:</td>
                <td style={{ padding: '8px 0' }}>
                  <a href={`mailto:${customer.email}`} style={{ color: '#333' }}>
                    {customer.email}
                  </a>
                </td>
              </tr>
              {customer.message && (
                <tr>
                  <td style={{ padding: '8px 0', color: '#666', verticalAlign: 'top' }}>
                    Комментарий:
                  </td>
                  <td style={{ padding: '8px 0', fontStyle: 'italic', color: '#555' }}>
                    {customer.message}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details */}
        <div style={emailStyles.section}>
          <h2 style={{ fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Состав заказа
          </h2>
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
            {discount && discount > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ ...emailStyles.td, paddingTop: '15px' }}>
                    Промокод ({promoCode}):
                  </td>
                  <td
                    style={{
                      ...emailStyles.td,
                      textAlign: 'right',
                      paddingTop: '15px',
                      color: '#059669',
                    }}
                  >
                    -{discount} ₽
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          <div style={{ ...emailStyles.total, fontSize: '24px' }}>{totalAmount} ₽</div>
        </div>
      </div>
    </div>
  );
};
