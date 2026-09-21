import { supabase } from '../supabase';
import type { Page, PageSection, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listPages(options: ListOptions = {}): Promise<PaginatedResponse<Page>> {
  const { page = 1, pageSize = 10, search, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('pages')
    .select('*', { count: 'exact' })
    .order('title', { ascending: true })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Page[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getPageById(id: string): Promise<Page> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Page;
}

export async function getPageByKey(pageKey: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('id')
    .eq('page_key', pageKey)
    .single();
  if (error) return null;
  return data as Page;
}

export async function updatePage(id: string, data: Partial<Page>): Promise<Page> {
  const { data: result, error } = await supabase
    .from('pages')
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
      entity_type: 'pages',
      entity_id: id,
      metadata: { title: result.title },
    });
  }

  return result as Page;
}

export async function listSections(pageId: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as PageSection[];
}

export async function updateSection(pageId: string, sectionKey: string, content: Partial<PageSection>): Promise<PageSection> {
  const { data: existing } = await supabase
    .from('page_sections')
    .select('id')
    .eq('page_id', pageId)
    .eq('section_key', sectionKey)
    .single();

  if (existing) {
    const { data: result, error } = await supabase
      .from('page_sections')
      .update({ ...content, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'update',
        entity_type: 'page_sections',
        entity_id: existing.id,
        metadata: { page_id: pageId, section_key: sectionKey },
      });
    }

    return result as PageSection;
  }

  const { data: result, error } = await supabase
    .from('page_sections')
    .insert({ page_id: pageId, section_key: sectionKey, ...content })
    .select()
    .single();
  if (error) throw error;
  return result as PageSection;
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase.from('page_sections').delete().eq('id', id);
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      entity_type: 'page_sections',
      entity_id: id,
    });
  }
}

export async function reorderSections(sections: { id: string; sort_order: number }[]): Promise<void> {
  for (const s of sections) {
    await supabase
      .from('page_sections')
      .update({ sort_order: s.sort_order, updated_at: new Date().toISOString() })
      .eq('id', s.id);
  }
}
