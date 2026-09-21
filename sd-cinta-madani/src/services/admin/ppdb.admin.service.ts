import { supabase } from '../supabase';
import type { PpdbPeriod, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listPeriods(options: ListOptions = {}): Promise<PaginatedResponse<PpdbPeriod>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('ppdb_periods')
    .select('*, unit:education_units(name)', { count: 'exact' })
    .order('start_date', { ascending: false })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as PpdbPeriod[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getPeriodById(id: string): Promise<PpdbPeriod> {
  const { data, error } = await supabase
    .from('ppdb_periods')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as PpdbPeriod;
}

export async function createPeriod(data: Partial<PpdbPeriod>): Promise<PpdbPeriod> {
  const { data: result, error } = await supabase
    .from('ppdb_periods')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      entity_type: 'ppdb_periods',
      entity_id: result.id,
      metadata: { title: result.title },
    });
  }

  return result as PpdbPeriod;
}

export async function updatePeriod(id: string, data: Partial<PpdbPeriod>): Promise<PpdbPeriod> {
  const { data: result, error } = await supabase
    .from('ppdb_periods')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'update',
      entity_type: 'ppdb_periods',
      entity_id: id,
      metadata: data,
    });
  }

  return result as PpdbPeriod;
}

export async function deletePeriod(id: string): Promise<void> {
  const { data: existing } = await supabase.from('ppdb_periods').select('title').eq('id', id).single();
  await supabase.from('ppdb_requirements').delete().eq('ppdb_period_id', id);
  await supabase.from('ppdb_faqs').delete().eq('ppdb_period_id', id);
  const { error } = await supabase.from('ppdb_periods').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'ppdb_periods',
      entity_id: id,
      metadata: { title: existing?.title },
    });
  }
}

export async function getRequirements(periodId: string) {
  const { data, error } = await supabase
    .from('ppdb_requirements')
    .select('*')
    .eq('ppdb_period_id', periodId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertRequirements(periodId: string, items: { title: string; description: string; sort_order: number }[]) {
  await supabase.from('ppdb_requirements').delete().eq('ppdb_period_id', periodId);
  if (items.length === 0) return;
  const rows = items.map((item) => ({ ...item, ppdb_period_id: periodId }));
  const { error } = await supabase.from('ppdb_requirements').insert(rows);
  if (error) throw error;
}

export async function getFaqs(periodId: string) {
  const { data, error } = await supabase
    .from('ppdb_faqs')
    .select('*')
    .eq('ppdb_period_id', periodId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertFaqs(periodId: string, items: { question: string; answer: string; sort_order: number }[]) {
  await supabase.from('ppdb_faqs').delete().eq('ppdb_period_id', periodId);
  if (items.length === 0) return;
  const rows = items.map((item) => ({ ...item, ppdb_period_id: periodId }));
  const { error } = await supabase.from('ppdb_faqs').insert(rows);
  if (error) throw error;
}
