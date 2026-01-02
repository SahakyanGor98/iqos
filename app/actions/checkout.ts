'use server';

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
      try {
        // Internal Notification
        await resend.emails.send({
          from: 'IQOS Orders <onboarding@resend.dev>',
          to: INTERNAL_EMAIL,
          subject: `Новый заказ #${order.id} от ${validatedData.fullName}`,
          html: `
            <h1>Новый заказ!</h1>
            <p><strong>Клиент:</strong> ${validatedData.fullName}</p>
            <p><strong>Телефон:</strong> ${validatedData.phone}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Комментарий:</strong> ${validatedData.message || 'Нет'}</p>
            
            <h2>Товары:</h2>
            <ul>
              ${items
                .map(
                  (item) =>
                    `<li>${item.product.title} x ${item.quantity} - ${
                      item.product.price * item.quantity
                    } ₽</li>`,
                )
                .join('')}
            </ul>
            
            <p><strong>Итого:</strong> ${totalAmount} ₽</p>
          `,
        });

        // User Confirmation
        await resend.emails.send({
          from: 'IQOS <onboarding@resend.dev>',
          to: validatedData.email,
          subject: `Подтверждение заказа #${order.id}`,
          html: `
            <h1>Спасибо за ваш заказ, ${validatedData.fullName}!</h1>
            <p>Мы получили ваш заказ и скоро свяжемся с вами для подтверждения.</p>
            
            <h2>Детали заказа:</h2>
            <ul>
              ${items
                .map(
                  (item) =>
                    `<li>${item.product.title} x ${item.quantity} - ${
                      item.product.price * item.quantity
                    } ₽</li>`,
                )
                .join('')}
            </ul>
            
            <p><strong>Сумма:</strong> ${totalAmount} ₽</p>
          `,
        });
      } catch (emailError) {
        console.error('Resend Error:', emailError);
        // We don't fail the order if email fails, but we log it
      }
    } else {
      console.log('Resend API key or Internal Email not found, skipping email sending.');
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
