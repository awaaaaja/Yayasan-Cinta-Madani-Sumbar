import { supabase } from "./supabase";
import type { SiteSettings, NavigationItem } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("school_name, logo_url, email, phone, address, social_links")
    .single();

  if (error) return null;
  return data as SiteSettings;
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  const { data, error } = await supabase
    .from("navigation_items")
    .select("label, url, sort_order")
    .eq("is_visible", true)
    .order("sort_order");

  if (error) return [];
  return (data || []).filter(
    (item) => !item.url.includes("unit-pendidikan")
  ) as NavigationItem[];
}
