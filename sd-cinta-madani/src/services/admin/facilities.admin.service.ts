import { supabase } from '../supabase';
import type { PaginatedResponse } from '@/types';

export interface Facility {
  id: string;
  unit_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  unitId?: string;
}

export async function listFacilitiesAdmin(options: ListOptions = {}): Promise<PaginatedResponse<Facility>> {
  const { page = 1, pageSize = 10, search, unitId } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('unit_facilities')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (search) query = query.ilike('name', `%${search}%`);
  if (unitId) query = query.eq('unit_id', unitId);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Facility[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getFacilityById(id: string): Promise<Facility> {
  const { data, error } = await supabase.from('unit_facilities').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Facility;
}

export async function createFacility(data: Partial<Facility>): Promise<Facility> {
  const { data: result, error } = await supabase.from('unit_facilities').insert(data).select().single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id, action: 'create', entity_type: 'unit_facilities',
      entity_id: result.id, metadata: { name: result.name },
    });
  }
  return result as Facility;
}

export async function updateFacility(id: string, data: Partial<Facility>): Promise<Facility> {
  const { data: result, error } = await supabase
    .from('unit_facilities').update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id).select().single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id, action: 'update', entity_type: 'unit_facilities',
      entity_id: id, metadata: data,
    });
  }
  return result as Facility;
}

export async function deleteFacility(id: string): Promise<void> {
  const { data: existing } = await supabase.from('unit_facilities').select('name').eq('id', id).single();
  const { error } = await supabase.from('unit_facilities').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id, action: 'delete', entity_type: 'unit_facilities',
      entity_id: id, metadata: { name: existing?.name },
    });
  }
}
