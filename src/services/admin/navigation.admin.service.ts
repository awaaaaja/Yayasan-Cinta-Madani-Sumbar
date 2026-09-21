import { supabase } from '../supabase';
import type { NavigationItem } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
}

export async function listNavigationItems(options: ListOptions = {}): Promise<{ data: NavigationItem[]; count: number }> {
  const { page = 1, pageSize = 50 } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('navigation_items')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (error) throw error;
  return { data: (data || []) as NavigationItem[], count: count || 0 };
}

export async function createNavigationItem(data: Partial<NavigationItem>): Promise<NavigationItem> {
  const { data: result, error } = await supabase
    .from('navigation_items')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result as NavigationItem;
}

export async function updateNavigationItem(id: string, data: Partial<NavigationItem>): Promise<NavigationItem> {
  const { data: result, error } = await supabase
    .from('navigation_items')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result as NavigationItem;
}

export async function deleteNavigationItem(id: string): Promise<void> {
  const { error } = await supabase.from('navigation_items').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderNavigationItems(items: { id: string; sort_order: number }[]): Promise<void> {
  for (const item of items) {
    await supabase
      .from('navigation_items')
      .update({ sort_order: item.sort_order })
      .eq('id', item.id);
  }
}
