'use server';

import React from 'react';
import { z } from 'zod';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { CONTACTS } from '@/lib/constants';
import type { OrderItemSnapshot } from '@/lib/orders';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const INTERNAL_EMAIL = process.env.INTERNAL_EMAIL;

const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

const tradeInSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().regex(phoneRegex, 'Введите корректный номер телефона РФ'),
  email: z.string().email('Введите корректный email').optional(),
  oldDevice: z.string().min(1, 'Выберите ваше старое устройство'),
  oldDeviceId: z.string().optional(),
  targetDevice: z.string().min(1, 'Выберите новое устройство IQOS ILUMA'),
  targetSlug: z.string().optional(),
  targetFullPrice: z.number(),
  estimatedDiscount: z.number(),
  finalPrice: z.number(),
  address: z.string().optional(), // Street address within Moscow
  comment: z.string().optional(),
});

export type TradeInData = z.infer<typeof tradeInSchema>;

export async function submitTradeIn(data: TradeInData) {
  try {
    // 1. Validation
    const d = tradeInSchema.parse(data);

    // 2. Build self-contained order snapshot
    const items: OrderItemSnapshot[] = [
      {
        title: d.targetDevice,
        quantity: 1,
        unit_price: d.targetFullPrice,
        line_total: d.targetFullPrice,
        product_id: null, // trade-in target isn't tied to a catalog row here
        slug: d.targetSlug ?? null,
      },
    ];

    const metadata = {
      trade_in: {
        old_device: d.oldDevice,
        old_device_id: d.oldDeviceId ?? null,
        target_device: d.targetDevice,
        target_slug: d.targetSlug ?? null,
        original_price: d.targetFullPrice,
        estimated_discount: d.estimatedDiscount,
        final_price: d.finalPrice,
        delivery_city: 'Москва',
        delivery_address: d.address ?? null,
      },
    };

    // 3. Persist to Supabase `orders`
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_name: d.name,
        user_email: d.email || 'tradein@24iqos.ru',
        user_phone: d.phone,
        user_message: d.comment || null,
        total_amount: d.finalPrice,
        discount: d.estimatedDiscount,
        status: 'pending',
        order_type: 'trade_in',
        items,
        metadata,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Supabase Trade-In Order Error:', orderError);
      return { success: false, error: 'Ошибка при отправке заявки. Попробуйте еще раз.' };
    }

    // 4. Send emails (internal notification + client confirmation)
    if (process.env.RESEND_API_KEY && INTERNAL_EMAIL) {
      const { renderToStaticMarkup } = await import('react-dom/server');

      // Internal notification
      try {
        const { TradeInNotification } = await import('@/components/emails/TradeInNotification');
        const adminHtml = renderToStaticMarkup(
          React.createElement(TradeInNotification, {
            name: d.name,
            phone: d.phone,
            email: d.email,
            oldDevice: d.oldDevice,
            targetDevice: d.targetDevice,
            estimatedDiscount: d.estimatedDiscount,
            finalPrice: d.finalPrice,
            address: d.address,
            comment: d.comment,
          }),
        );

        await resend.emails.send({
          from: `${CONTACTS.sender.name} Trade-In <${CONTACTS.sender.email}>`,
          to: INTERNAL_EMAIL,
          subject: `Новая заявка на Трейд-ин #${order.id} от ${d.name}`,
          html: adminHtml,
        });
      } catch (adminError) {
        console.error('Failed to send Trade-In Admin Email:', adminError);
      }

      // Client confirmation (only when the customer provided an email)
      if (d.email) {
        try {
          const { TradeInConfirmation } = await import('@/components/emails/TradeInConfirmation');
          const userHtml = renderToStaticMarkup(
            React.createElement(TradeInConfirmation, {
              orderId: order.id.toString(),
              customerName: d.name,
              oldDevice: d.oldDevice,
              targetDevice: d.targetDevice,
              estimatedDiscount: d.estimatedDiscount,
              finalPrice: d.finalPrice,
            }),
          );

          await resend.emails.send({
            from: `${CONTACTS.sender.name} <${CONTACTS.sender.email}>`,
            to: d.email,
            subject: `Ваша заявка на Трейд-ин #${order.id} принята!`,
            html: userHtml,
          });
        } catch (userError) {
          console.error('Failed to send Trade-In Client Email:', userError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || 'Неверные данные формы';
      return { success: false, error: firstError };
    }
    console.error('Trade-In Submission Error:', error);
    return { success: false, error: 'Произошла ошибка при отправке заявки. Попробуйте еще раз.' };
  }
}
