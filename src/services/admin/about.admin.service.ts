import { supabase } from '../supabase';
import type { AboutContent } from '@/types';

async function getHomepagePageId(): Promise<string | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('id')
    .eq('page_key', 'home')
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data.id;
}

export async function getAboutSection(): Promise<{ id: string; content: AboutContent } | null> {
  const pageId = await getHomepagePageId();
  if (!pageId) return null;

  const { data, error } = await supabase
    .from('page_sections')
    .select('id, content')
    .eq('page_id', pageId)
    .eq('section_key', 'about')
    .single();

  if (error || !data) return null;
  return { id: data.id, content: (data.content as AboutContent) || {} };
}

export async function updateAboutSection(content: AboutContent): Promise<void> {
  const pageId = await getHomepagePageId();
  if (!pageId) throw new Error('Homepage not found');

  const { error } = await supabase
    .from('page_sections')
    .update({ content })
    .eq('page_id', pageId)
    .eq('section_key', 'about');

  if (error) throw error;
}
