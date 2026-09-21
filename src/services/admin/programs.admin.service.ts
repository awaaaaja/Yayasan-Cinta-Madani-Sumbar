import { supabase } from '../supabase';
import type { Program, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listPrograms(options: ListOptions = {}): Promise<PaginatedResponse<Program>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('programs')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Program[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getProgramById(id: string): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Program;
}

export async function createProgram(data: Partial<Program>, unitIds: string[] = []): Promise<Program> {
  const { data: result, error } = await supabase
    .from('programs')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  if (unitIds.length > 0) {
    const links = unitIds.map((unit_id) => ({ program_id: result.id, unit_id }));
    await supabase.from('unit_programs').insert(links);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      entity_type: 'programs',
      entity_id: result.id,
      metadata: { title: result.title, unit_ids: unitIds },
    });
  }

  return result as Program;
}

export async function updateProgram(id: string, data: Partial<Program>, unitIds?: string[]): Promise<Program> {
  const { data: result, error } = await supabase
    .from('programs')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  if (unitIds !== undefined) {
    await supabase.from('unit_programs').delete().eq('program_id', id);
    if (unitIds.length > 0) {
      const links = unitIds.map((unit_id) => ({ program_id: id, unit_id }));
      await supabase.from('unit_programs').insert(links);
    }
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'update',
      entity_type: 'programs',
      entity_id: id,
      metadata: data,
    });
  }

  return result as Program;
}

export async function deleteProgram(id: string): Promise<void> {
  const { data: existing } = await supabase.from('programs').select('title').eq('id', id).single();
  await supabase.from('unit_programs').delete().eq('program_id', id);
  const { error } = await supabase.from('programs').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'programs',
      entity_id: id,
      metadata: { title: existing?.title },
    });
  }
}

export async function publishProgram(id: string): Promise<Program> {
  return updateProgram(id, { status: 'published' });
}

export async function archiveProgram(id: string): Promise<Program> {
  return updateProgram(id, { status: 'archived' });
}

export async function duplicateProgram(id: string): Promise<Program> {
  const original = await getProgramById(id);
  const { id: _id, ...rest } = original;
  return createProgram({ ...rest, title: `${rest.title} (Salinan)`, slug: `${rest.slug}-copy`, status: 'draft' });
}

export async function getProgramUnitIds(programId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('unit_programs')
    .select('unit_id')
    .eq('program_id', programId);
  if (error) throw error;
  return (data || []).map((r: { unit_id: string }) => r.unit_id);
}
