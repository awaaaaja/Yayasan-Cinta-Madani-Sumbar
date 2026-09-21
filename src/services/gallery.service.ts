import { supabase } from "./supabase";
import type { GalleryAlbum } from "@/types";

export type { GalleryAlbum };

// ponytail: not in @/types — keep local until canonical definition is added
export interface GalleryItem {
  id: string;
  album_id: string;
  media_id: string;
  caption: string;
  sort_order: number;
  created_at: string;
  media?: {
    public_url: string;
    alt_text: string;
    width: number;
    height: number;
  };
}

export async function listPublishedAlbums(options: { unitId?: string; limit?: number } = {}) {
  const { unitId, limit = 12 } = options;

  let query = supabase
    .from("gallery_albums")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (unitId) {
    query = query.eq("unit_id", unitId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as GalleryAlbum[];
}

export async function getAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  const { data, error } = await supabase
    .from("gallery_albums")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as GalleryAlbum;
}

export async function getAlbumItems(albumId: string): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*, media:media(public_url, alt_text, width, height)")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as GalleryItem[];
}
