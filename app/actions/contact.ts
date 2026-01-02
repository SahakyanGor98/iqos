'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const INTERNAL_EMAIL = process.env.INTERNAL_EMAIL;

const contactSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email'),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
});

type ContactData = z.infer<typeof contactSchema>;

export async function submitContact(data: ContactData) {
  try {
    // 1. Validation
    const validatedData = contactSchema.parse(data);

    // 2. Persist to Supabase
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message,
      status: 'new',
    });

    if (dbError) {
      console.error('Supabase Contact Error:', dbError);
      return { success: false, error: 'Ошибка при отправке сообщения' };
    }

    // 3. Send Email (Internal Notification Only)
    if (process.env.RESEND_API_KEY && INTERNAL_EMAIL) {
      try {
        await resend.emails.send({
          from: 'IQOS Contact <onboarding@resend.dev>',
          to: INTERNAL_EMAIL,
          subject: `Новое сообщение от ${validatedData.name}`,
          html: `
            <h1>Новое сообщение с формы контактов</h1>
            <p><strong>Имя:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Телефон:</strong> ${validatedData.phone}</p>
            <h2>Сообщение:</h2>
            <p>${validatedData.message}</p>
          `,
        });
      } catch (emailError) {
        console.error('Resend Error:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('Resend API key or Internal Email not found, skipping email sending.');
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Неверные данные формы' };
    }
    console.error('Contact Error:', error);
    return { success: false, error: 'Произошла непредвиденная ошибка' };
  }
}
