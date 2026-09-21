import { supabase } from '../supabase';
import type { Staff, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  unitId?: string;
}

export async function listStaffAdmin(options: ListOptions = {}): Promise<PaginatedResponse<Staff>> {
  const { page = 1, pageSize = 10, search, unitId } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('staff')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (search) query = query.ilike('full_name', `%${search}%`);
  if (unitId) query = query.eq('unit_id', unitId);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Staff[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getStaffById(id: string): Promise<Staff> {
  const { data, error } = await supabase.from('staff').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Staff;
}

export async function createStaff(data: Partial<Staff>): Promise<Staff> {
  const { data: result, error } = await supabase.from('staff').insert(data).select().single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id, action: 'create', entity_type: 'staff',
      entity_id: result.id, metadata: { full_name: result.full_name },
    });
  }
  return result as Staff;
}

export async function updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
  const { data: result, error } = await supabase
    .from('staff').update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id).select().single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id, action: 'update', entity_type: 'staff',
      entity_id: id, metadata: data,
    });
  }
  return result as Staff;
}

export async function deleteStaff(id: string): Promise<void> {
  const { data: existing } = await supabase.from('staff').select('full_name').eq('id', id).single();
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id, action: 'delete', entity_type: 'staff',
      entity_id: id, metadata: { full_name: existing?.full_name },
    });
  }
}
