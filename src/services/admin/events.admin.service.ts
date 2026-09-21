import { supabase } from '../supabase';
import type { Event, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listEvents(options: ListOptions = {}): Promise<PaginatedResponse<Event>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .order('event_date', { ascending: false })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Event[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getEventById(id: string): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Event;
}

export async function createEvent(data: Partial<Event>): Promise<Event> {
  const { data: result, error } = await supabase
    .from('events')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      entity_type: 'events',
      entity_id: result.id,
      metadata: { title: result.title },
    });
  }

  return result as Event;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event> {
  const { data: result, error } = await supabase
    .from('events')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'update',
      entity_type: 'events',
      entity_id: id,
      metadata: data,
    });
  }

  return result as Event;
}

export async function deleteEvent(id: string): Promise<void> {
  const { data: existing } = await supabase.from('events').select('title').eq('id', id).single();
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'events',
      entity_id: id,
      metadata: { title: existing?.title },
    });
  }
}

export async function publishEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: 'published' });
}

export async function archiveEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: 'archived' });
}

export async function duplicateEvent(id: string): Promise<Event> {
  const original = await getEventById(id);
  const { id: _id, ...rest } = original;
  return createEvent({ ...rest, title: `${rest.title} (Salinan)`, slug: `${rest.slug}-copy`, status: 'draft' });
}
