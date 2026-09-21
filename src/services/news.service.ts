import { supabase } from "./supabase";
import type { News, NewsCategory } from "@/types";

export type { News, NewsCategory };

export interface NewsListOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  unitId?: string;
}

export async function listPublishedNews(options: NewsListOptions = {}) {
  const { page = 1, limit = 9, categorySlug, unitId } = options;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("news")
    .select("*, category:news_categories(*)", { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
  }
  if (unitId) {
    query = query.eq("unit_id", unitId);
  }

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
  const { data, error } = await supabase
    .from("news")
    .select("*, category:news_categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as News & { category: NewsCategory | null };
}

export async function getRelatedNews(newsId: string, limit = 3): Promise<News[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .neq("id", newsId)
    .order("published_at", { ascending: false })
    .limit(limit);

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
