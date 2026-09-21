import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";
import type { News, NewsCategory } from "@/types";

export type { News, NewsCategory };

export interface NewsListOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
}

export async function listPublishedNews(options: NewsListOptions = {}) {
  const { page = 1, limit = 9, categorySlug } = options;
  const offset = (page - 1) * limit;
  const unitId = await getSdUnitId();

  let query = supabase
    .from("news")
    .select("*, category:news_categories(*)", { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (unitId) query = query.eq("unit_id", unitId);
  if (categorySlug) query = query.eq("category.slug", categorySlug);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    items: data as (News & { category: NewsCategory | null })[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getNewsBySlug(slug: string): Promise<(News & { category: NewsCategory | null }) | null> {
  const unitId = await getSdUnitId();

  let query = supabase
    .from("news")
    .select("*, category:news_categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query.single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as News & { category: NewsCategory | null };
}

export async function getRelatedNews(newsId: string, limit = 3): Promise<News[]> {
  const unitId = await getSdUnitId();

  let query = supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .neq("id", newsId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query;
  if (error) throw error;
  return data as News[];
}

export async function listNewsCategories(): Promise<NewsCategory[]> {
  const { data, error } = await supabase
    .from("news_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as NewsCategory[];
}
