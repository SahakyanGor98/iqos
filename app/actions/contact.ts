'use server';

import React from 'react';
import { z } from 'zod';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { CONTACTS } from '@/lib/constants';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const INTERNAL_EMAIL = process.env.INTERNAL_EMAIL;

const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

const contactSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().regex(phoneRegex),
  email: z.string().email('Введите корректный email'),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
});

type ContactData = z.infer<typeof contactSchema>;

export async function submitContact(data: ContactData) {
  try {
    // 1. Validation
    const validatedData = contactSchema.parse(data);

    // 2. Persist to Supabase
    const { error: dbError } = await supabaseAdmin.from('contact_messages').insert({
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
        const { renderToStaticMarkup } = await import('react-dom/server');
        const { ContactNotification } = await import('@/components/emails/ContactNotification');

        const emailHtml = renderToStaticMarkup(
          React.createElement(ContactNotification, {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            message: validatedData.message,
          }),
        );

        await resend.emails.send({
          from: `${CONTACTS.sender.name} Contact <${CONTACTS.sender.email}>`,
          to: INTERNAL_EMAIL,
          subject: `Новое сообщение от ${validatedData.name}`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error('Resend Error:', emailError);
        // Don't fail the request if email fails
      }
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
