import { supabase } from "./supabase";
import type { Page, PageSection } from "@/types";

export type { Page, PageSection };

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Page;
}

export async function getPageByKey(pageKey: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("page_key", pageKey)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Page;
}

export async function getPageSections(pageId: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as PageSection[];
}

export async function getSectionContent<T>(pageKey: string, sectionKey: string): Promise<T | null> {
  const page = await getPageByKey(pageKey);
  if (!page) return null;

  const { data, error } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_id", page.id)
    .eq("section_key", sectionKey)
    .eq("is_visible", true)
    .single();

  if (error || !data) return null;
  return data.content as T;
}
