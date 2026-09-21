import { supabase } from '../supabase';
import type { EducationUnit, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listUnits(options: ListOptions = {}): Promise<PaginatedResponse<EducationUnit>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('education_units')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (search) query = query.ilike('name', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as EducationUnit[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getUnitById(id: string): Promise<EducationUnit> {
  const { data, error } = await supabase
    .from('education_units')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as EducationUnit;
}

export async function createUnit(data: Partial<EducationUnit>): Promise<EducationUnit> {
  const { data: result, error } = await supabase
    .from('education_units')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      entity_type: 'education_units',
      entity_id: result.id,
      metadata: { name: result.name },
    });
  }

  return result as EducationUnit;
}

export async function updateUnit(id: string, data: Partial<EducationUnit>): Promise<EducationUnit> {
  const { data: result, error } = await supabase
    .from('education_units')
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
      entity_type: 'education_units',
      entity_id: id,
      metadata: data,
    });
  }

  return result as EducationUnit;
}

export async function deleteUnit(id: string): Promise<void> {
  const { data: existing } = await supabase.from('education_units').select('name').eq('id', id).single();
  const { error } = await supabase.from('education_units').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'education_units',
      entity_id: id,
      metadata: { name: existing?.name },
    });
  }
}

export async function publishUnit(id: string): Promise<EducationUnit> {
  return updateUnit(id, { status: 'published' });
}

export async function archiveUnit(id: string): Promise<EducationUnit> {
  return updateUnit(id, { status: 'archived' });
}

export async function duplicateUnit(id: string): Promise<EducationUnit> {
  const original = await getUnitById(id);
  const { id: _id, ...rest } = original;
  return createUnit({ ...rest, name: `${rest.name} (Salinan)`, slug: `${rest.slug}-copy`, status: 'draft' });
}
