import { supabase } from '../supabase';
import type { ContactMessage, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  status?: string;
}

export async function listMessages(options: ListOptions = {}): Promise<PaginatedResponse<ContactMessage>> {
  const { page = 1, pageSize = 10, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as ContactMessage[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getMessageById(id: string): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as ContactMessage;
}

export async function markAsRead(id: string): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status: 'read' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ContactMessage;
}

export async function markAsReplied(id: string): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status: 'replied' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ContactMessage;
}

export async function archiveMessage(id: string): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status: 'archived' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ContactMessage;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}
