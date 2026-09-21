import { supabase } from '../supabase';
import type { Achievement, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  year?: number;
}

export async function listAchievements(options: ListOptions = {}): Promise<PaginatedResponse<Achievement>> {
  const { page = 1, pageSize = 10, search, year } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('achievements')
    .select('*', { count: 'exact' })
    .order('year', { ascending: false })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (year) query = query.eq('year', year);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Achievement[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getAchievementById(id: string): Promise<Achievement> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Achievement;
}

export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  const { data: result, error } = await supabase
    .from('achievements')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      entity_type: 'achievements',
      entity_id: result.id,
      metadata: { title: result.title },
    });
  }

  return result as Achievement;
}

export async function updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement> {
  const { data: result, error } = await supabase
    .from('achievements')
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
      entity_type: 'achievements',
      entity_id: id,
      metadata: data,
    });
  }

  return result as Achievement;
}

export async function deleteAchievement(id: string): Promise<void> {
  const { data: existing } = await supabase.from('achievements').select('title').eq('id', id).single();
  const { error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'achievements',
      entity_id: id,
      metadata: { title: existing?.title },
    });
  }
}
