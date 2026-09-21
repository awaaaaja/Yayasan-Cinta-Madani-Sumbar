import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";
import type { Download } from "@/types";

export async function listPublishedDownloads(options: { page?: number; pageSize?: number } = {}): Promise<{ data: Download[]; count: number; page: number; pageSize: number; totalPages: number }> {
  const { page = 1, pageSize = 12 } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const unitId = await getSdUnitId();

  let query = supabase
    .from("downloads")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Download[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getDownload(id: string): Promise<Download> {
  const { data, error } = await supabase
    .from("downloads")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return data as Download;
}
