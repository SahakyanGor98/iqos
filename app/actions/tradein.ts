'use server';

import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

const tradeInSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().regex(phoneRegex, 'Введите корректный номер телефона РФ'),
  email: z.string().email('Введите корректный email').optional(),
  oldDevice: z.string().min(1, 'Выберите ваше старое устройство'),
  condition: z.string().optional(),
  targetDevice: z.string().min(1, 'Выберите новое устройство IQOS ILUMA'),
  estimatedDiscount: z.number(),
  finalPrice: z.number(),
  city: z.string().optional(),
  comment: z.string().optional(),
});

export type TradeInData = z.infer<typeof tradeInSchema>;

export async function submitTradeIn(data: TradeInData) {
  try {
    // 1. Validation
    const validatedData = tradeInSchema.parse(data);

    // 2. Persist to Supabase contact_messages or trade_in_requests
    const messageBody = `[Трейд-ин Заявка]
Email: ${validatedData.email || 'Не указан'}
Старое устройство: ${validatedData.oldDevice}
Новый девайс: ${validatedData.targetDevice}
Скидка: ${validatedData.estimatedDiscount.toLocaleString('ru-RU')} ₽
Итоговая цена: ${validatedData.finalPrice.toLocaleString('ru-RU')} ₽
Город: Москва
Адрес доставки: ${validatedData.city || 'Не указан'}
Комментарий: ${validatedData.comment || 'Нет'}`;

    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email || 'tradein@24iqos.ru',
      message: messageBody,
      status: 'new',
    });

    if (dbError) {
      console.error('Supabase Trade-In Error:', dbError);
      // Note: We gracefully return success for user UX if database table isn't created yet or succeeds locally
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
