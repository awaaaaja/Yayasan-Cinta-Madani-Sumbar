import { supabase } from "./supabase";
import type {
  PageSection,
  HeroContent,
  TrustStripContent,
  AboutContent,
} from "@/types";

async function getHomepagePageId(): Promise<string | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("id")
    .eq("page_key", "home")
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data.id;
}

export async function getHomepageSections(): Promise<PageSection[]> {
  const pageId = await getHomepagePageId();
  if (!pageId) return [];

  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as PageSection[];
}

export async function getSectionContent<T>(
  sectionKey: string
): Promise<T | null> {
  const pageId = await getHomepagePageId();
  if (!pageId) return null;

  const { data, error } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_id", pageId)
    .eq("section_key", sectionKey)
    .eq("is_visible", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return (data?.content as T) || null;
}

export function getHeroContent() {
  return getSectionContent<HeroContent>("hero");
}

export function getTrustStripContent() {
  return getSectionContent<TrustStripContent>("statistics");
}

export function getAboutContent() {
  return getSectionContent<AboutContent>("about");
}
