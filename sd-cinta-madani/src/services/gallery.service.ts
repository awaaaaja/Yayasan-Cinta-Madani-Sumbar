import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";
import type { GalleryAlbum } from "@/types";

export type { GalleryAlbum };

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

export async function listPublishedAlbums(options: { limit?: number; page?: number } = {}) {
  const { limit = 12, page = 1 } = options;
  const unitId = await getSdUnitId();

  let countQuery = supabase
    .from("gallery_albums")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  let query = supabase
    .from("gallery_albums")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (unitId) {
    countQuery = countQuery.eq("unit_id", unitId);
    query = query.eq("unit_id", unitId);
  }

  const { count } = await countQuery;
  const { data, error } = await query;
  if (error) throw error;

  const total = count || 0;
  return {
    items: data as GalleryAlbum[],
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  const unitId = await getSdUnitId();

  let query = supabase
    .from("gallery_albums")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published");

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query.single();
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
