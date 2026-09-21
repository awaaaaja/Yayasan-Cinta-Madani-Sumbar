import { supabase } from '../supabase';
import type { HeroSlide, PaginatedResponse } from '@/types';

interface ListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function listHeroSlidesAdmin(options: ListOptions = {}): Promise<PaginatedResponse<HeroSlide>> {
  const { page = 1, pageSize = 20, search } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('hero_slides')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (search) query = query.ilike('title', `%${search}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as HeroSlide[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getHeroSlideById(id: string): Promise<HeroSlide> {
  const { data, error } = await supabase.from('hero_slides').select('*').eq('id', id).single();
  if (error) throw error;
  return data as HeroSlide;
}

export async function createHeroSlide(data: Partial<HeroSlide>): Promise<HeroSlide> {
  const { data: result, error } = await supabase.from('hero_slides').insert(data).select().single();
  if (error) throw error;
  return result as HeroSlide;
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<HeroSlide> {
  const { data: result, error } = await supabase.from('hero_slides').update(data).eq('id', id).select().single();
  if (error) throw error;
  return result as HeroSlide;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderHeroSlides(orderedIds: string[]): Promise<void> {
  const updates = orderedIds.map((id, index) =>
    supabase.from('hero_slides').update({ sort_order: index + 1 }).eq('id', id)
  );
  await Promise.all(updates);
}
