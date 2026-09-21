import { supabase } from '../supabase';
import type { PaginatedResponse } from '@/types';

export interface PpdbRegistration {
  id: string;
  period_id: string;
  registration_number: string;
  nik: string;
  nisn: string | null;
  full_name: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  religion: string;
  address: string;
  rt: string | null;
  rw: string | null;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string | null;
  phone: string | null;
  father_name: string;
  father_occupation: string;
  father_income: string;
  mother_name: string;
  mother_occupation: string;
  mother_income: string;
  guardian_name: string | null;
  previous_school: string;
  previous_school_npsn: string | null;
  previous_school_address: string | null;
  graduation_year: number;
  status: "pending" | "verified" | "accepted" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PpdbDocument {
  id: string;
  registration_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  created_at: string;
}

export interface PpdbPeriod {
  id: string;
  title: string;
  academic_year: string;
  status: string;
}

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  periodId?: string;
}

export async function listRegistrations(options: ListOptions = {}): Promise<PaginatedResponse<PpdbRegistration>> {
  const { page = 1, pageSize = 10, search, status, periodId } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('ppdb_registrations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,nik.ilike.%${search}%,registration_number.ilike.%${search}%`);
  }
  if (status) query = query.eq('status', status);
  if (periodId) query = query.eq('period_id', periodId);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as PpdbRegistration[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function listPeriods(): Promise<PpdbPeriod[]> {
  const { data, error } = await supabase
    .from('ppdb_periods')
    .select('id, title, academic_year, status')
    .order('start_date', { ascending: false });
  if (error) throw error;
  return (data || []) as PpdbPeriod[];
}

export async function getRegistrationById(id: string): Promise<PpdbRegistration> {
  const { data, error } = await supabase.from('ppdb_registrations').select('*').eq('id', id).single();
  if (error) throw error;
  return data as PpdbRegistration;
}

export async function getRegistrationDocuments(registrationId: string): Promise<PpdbDocument[]> {
  const { data, error } = await supabase
    .from('ppdb_documents')
    .select('*')
    .eq('registration_id', registrationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as PpdbDocument[];
}

async function updateStatus(
  id: string,
  status: PpdbRegistration["status"],
  adminNotes: string | null,
): Promise<PpdbRegistration> {
  const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (adminNotes !== null) update.admin_notes = adminNotes;

  const { data: result, error } = await supabase
    .from('ppdb_registrations')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id, action: 'update_status', entity_type: 'ppdb_registrations',
      entity_id: id, metadata: { status, admin_notes: adminNotes },
    });
  }
  return result as PpdbRegistration;
}

export async function verifyRegistration(id: string): Promise<PpdbRegistration> {
  return updateStatus(id, 'verified', null);
}

export async function acceptRegistration(id: string, notes: string): Promise<PpdbRegistration> {
  return updateStatus(id, 'accepted', notes);
}

export async function rejectRegistration(id: string, notes: string): Promise<PpdbRegistration> {
  return updateStatus(id, 'rejected', notes);
}
