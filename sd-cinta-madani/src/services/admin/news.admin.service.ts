import { supabase } from '../supabase';
import type { News, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listNewsAdmin(options: ListOptions = {}): Promise<PaginatedResponse<News>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('news')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as News[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getNewsById(id: string): Promise<News> {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
  if (error) throw error;
  return data as News;
}

export async function createNews(data: Partial<News>): Promise<News> {
  const { data: result, error } = await supabase.from('news').insert(data).select().single();
  if (error) throw error;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({ user_id: user.id, action: 'create', entity_type: 'news', entity_id: result.id, metadata: { title: result.title } });
  }
  return result as News;
}

export async function updateNews(id: string, data: Partial<News>): Promise<News> {
  const { data: result, error } = await supabase.from('news').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({ user_id: user.id, action: 'update', entity_type: 'news', entity_id: id, metadata: data });
  }
  return result as News;
}

export async function deleteNews(id: string): Promise<void> {
  const { data: existing } = await supabase.from('news').select('title').eq('id', id).single();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({ user_id: user.id, action: 'delete', entity_type: 'news', entity_id: id, metadata: { title: existing?.title } });
  }
}

export async function publishNews(id: string): Promise<News> {
  return updateNews(id, { status: 'published', published_at: new Date().toISOString() });
}

export async function archiveNews(id: string): Promise<News> {
  return updateNews(id, { status: 'archived' });
}
