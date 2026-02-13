'use server';

import React from 'react';

import { z } from 'zod';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { CartItem } from '@/store/cartStore';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY) || null;
const INTERNAL_EMAIL = process.env.INTERNAL_EMAIL || null;

// Schema (matching client-side)
const formSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  message: z.string().optional(),
});

type CheckoutData = z.infer<typeof formSchema>;

export async function placeOrder(data: CheckoutData, items: CartItem[]) {
  try {
    // 1. Validation
    const validatedData = formSchema.parse(data);

    if (items.length === 0) {
      return { success: false, error: 'Корзина пуста' };
    }

    const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // 2. Persist to Supabase
    // Insert Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_name: validatedData.fullName,
        user_email: validatedData.email,
        user_phone: validatedData.phone,
        user_message: validatedData.message,
        total_amount: totalAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Supabase Order Error:', orderError);
      return { success: false, error: 'Ошибка при создании заказа' };
    }

    // Insert Order Items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_time: item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error('Supabase Items Error:', itemsError);
      // Ideally we would rollback the order here, but for now we'll just return error
      return { success: false, error: 'Ошибка при сохранении товаров заказа' };
    }

    // 3. Send Emails (if API key exists)
    if (process.env.RESEND_API_KEY && INTERNAL_EMAIL) {
      // Internal Notification
      try {
        const { renderToStaticMarkup } = await import('react-dom/server');
        const { AdminNotification } = await import('@/components/emails/AdminNotification');
        const adminHtml = renderToStaticMarkup(
          React.createElement(AdminNotification, {
            orderId: order.id.toString(),
            customer: validatedData,
            items: items,
            totalAmount: totalAmount,
          })
        );

        const adminResult = await resend.emails.send({
          from: 'IQOS Orders <support@24iqos.ru>',
          to: INTERNAL_EMAIL,
          subject: `Новый заказ #${order.id} - ${totalAmount} ₽`,
          html: adminHtml,
        });
      } catch (adminError) {
        console.error('Failed to send Admin Email:', adminError);
      }

      // User Confirmation
      try {
        const { renderToStaticMarkup } = await import('react-dom/server');
        const { OrderConfirmation } = await import('@/components/emails/OrderConfirmation');
        const userHtml = renderToStaticMarkup(
          React.createElement(OrderConfirmation, {
            orderId: order.id.toString(),
            customerName: validatedData.fullName,
            items: items,
            totalAmount: totalAmount,
          })
        );

        const userResult = await resend.emails.send({
          from: 'IQOS <support@24iqos.ru>',
          to: validatedData.email,
          subject: `Ваш заказ #${order.id} принят!`,
          html: userHtml,
        });
      } catch (userError) {
        console.error('Failed to send User Email:', userError);
      }
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Неверные данные формы' };
    }
    console.error('Checkout Error:', error);
    return { success: false, error: 'Произошла непредвиденная ошибка' };
  }
}
