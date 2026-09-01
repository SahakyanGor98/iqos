import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Contact-form inbox reads. `contact_messages` is RLS-locked (anon INSERT only,
 * no SELECT policy), so reads run through the service-role client — safe here
 * because callers are server components behind the /admin auth gate.
 */

export const MESSAGE_STATUSES = ['new', 'read'] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export type ContactMessage = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
};

/** All messages, newest first. Volume is small (one shop's contact form); add
 *  pagination if it ever grows large. */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .select('id, created_at, name, email, phone, message, status')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[messages] read failed:', error.message);
    return [];
  }

  return (data ?? []) as ContactMessage[];
}
