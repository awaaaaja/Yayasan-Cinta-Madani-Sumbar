import { supabase } from '../supabase';
import type { GalleryAlbum, MediaItem, PaginatedResponse } from '@/types';

interface ListAlbumsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listAlbums(options: ListAlbumsOptions = {}): Promise<PaginatedResponse<GalleryAlbum>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('gallery_albums')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as GalleryAlbum[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getAlbumById(id: string): Promise<GalleryAlbum> {
  const { data, error } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as GalleryAlbum;
}

export async function createAlbum(data: Partial<GalleryAlbum>): Promise<GalleryAlbum> {
  const { data: result, error } = await supabase
    .from('gallery_albums')
    .insert(data)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      entity_type: 'gallery_albums',
      entity_id: result.id,
      metadata: { title: result.title },
    });
  }

  return result as GalleryAlbum;
}

export async function updateAlbum(id: string, data: Partial<GalleryAlbum>): Promise<GalleryAlbum> {
  const { data: result, error } = await supabase
    .from('gallery_albums')
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
      entity_type: 'gallery_albums',
      entity_id: id,
      metadata: data,
    });
  }

  return result as GalleryAlbum;
}

export async function deleteAlbum(id: string): Promise<void> {
  const { data: existing } = await supabase.from('gallery_albums').select('title').eq('id', id).single();
  await supabase.from('gallery_items').delete().eq('album_id', id);
  const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'gallery_albums',
      entity_id: id,
      metadata: { title: existing?.title },
    });
  }
}

export async function publishAlbum(id: string): Promise<GalleryAlbum> {
  return updateAlbum(id, { status: 'published' });
}

export async function archiveAlbum(id: string): Promise<GalleryAlbum> {
  return updateAlbum(id, { status: 'archived' });
}

export async function getAlbumItems(albumId: string) {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*, media:media(*)')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addMediaToAlbum(albumId: string, mediaId: string, caption?: string) {
  const maxOrder = await supabase
    .from('gallery_items')
    .select('sort_order')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxOrder.data?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from('gallery_items')
    .insert({ album_id: albumId, media_id: mediaId, caption: caption || null, sort_order: nextOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeMediaFromAlbum(itemId: string): Promise<void> {
  const { error } = await supabase.from('gallery_items').delete().eq('id', itemId);
  if (error) throw error;
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const ext = file.name.split('.').pop();
  const path = `gallery/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(path, file, { contentType: file.type, upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path);

  const { data: result, error: insertError } = await supabase
    .from('media')
    .insert({
      file_name: file.name,
      storage_path: path,
      public_url: urlData.publicUrl,
      mime_type: file.type,
      file_size: file.size,
      folder: 'gallery',
      uploaded_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();
  if (insertError) throw insertError;

  return result as MediaItem;
}
