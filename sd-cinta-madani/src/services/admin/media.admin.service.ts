import { supabase } from '../supabase';
import type { MediaItem, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  folder?: string;
}

export async function listMedia(options: ListOptions = {}): Promise<PaginatedResponse<MediaItem>> {
  const { page = 1, pageSize = 20, folder } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('media')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (folder) query = query.eq('folder', folder);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as MediaItem[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getMediaById(id: string): Promise<MediaItem> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as MediaItem;
}

export async function uploadMedia(file: File, bucket: string, folder: string): Promise<MediaItem> {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  const { data: result, error: insertError } = await supabase
    .from('media')
    .insert({
      file_name: file.name,
      storage_path: path,
      public_url: urlData.publicUrl,
      mime_type: file.type,
      file_size: file.size,
      folder,
      uploaded_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();
  if (insertError) throw insertError;

  return result as MediaItem;
}

export async function updateMedia(id: string, data: Partial<MediaItem>): Promise<MediaItem> {
  const { data: result, error } = await supabase
    .from('media')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result as MediaItem;
}

export async function deleteMedia(id: string): Promise<void> {
  const { data: existing } = await supabase.from('media').select('storage_path').eq('id', id).single();
  if (existing?.storage_path) {
    await supabase.storage.from('site-assets').remove([existing.storage_path]);
  }
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) throw error;
}
