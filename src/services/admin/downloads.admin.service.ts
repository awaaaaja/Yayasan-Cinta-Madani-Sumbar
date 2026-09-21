import { supabase } from '../supabase';
import type { Download, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listDownloads(options: ListOptions = {}): Promise<PaginatedResponse<Download>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('downloads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Download[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getDownloadById(id: string): Promise<Download> {
  const { data, error } = await supabase
    .from('downloads')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Download;
}

export async function createDownload(data: Partial<Download>): Promise<Download> {
  const { data: result, error } = await supabase
    .from('downloads')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      entity_type: 'downloads',
      entity_id: result.id,
      metadata: { title: result.title },
    });
  }

  return result as Download;
}

export async function updateDownload(id: string, data: Partial<Download>): Promise<Download> {
  const { data: result, error } = await supabase
    .from('downloads')
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
      entity_type: 'downloads',
      entity_id: id,
      metadata: data,
    });
  }

  return result as Download;
}

export async function deleteDownload(id: string): Promise<void> {
  const { data: existing } = await supabase.from('downloads').select('title, file_url').eq('id', id).single();
  if (existing?.file_url) {
    const pathMatch = existing.file_url.match(/documents\/(.+)/);
    if (pathMatch) await supabase.storage.from('documents').remove([pathMatch[1]]);
  }
  const { error } = await supabase.from('downloads').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'downloads',
      entity_id: id,
      metadata: { title: existing?.title },
    });
  }
}

export async function publishDownload(id: string): Promise<Download> {
  return updateDownload(id, { status: 'published' });
}

export async function archiveDownload(id: string): Promise<Download> {
  return updateDownload(id, { status: 'archived' });
}

export async function uploadFile(file: File): Promise<{ url: string; fileType: string; fileSize: number }> {
  const ext = file.name.split('.').pop();
  const path = `documents/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(path, file, { contentType: file.type, upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('documents').getPublicUrl(path);
  return { url: data.publicUrl, fileType: file.type, fileSize: file.size };
}
