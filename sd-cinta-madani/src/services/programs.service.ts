import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";
import type { Program } from "@/types";

export type { Program };

export async function listPublishedPrograms(options?: { page?: number; limit?: number }): Promise<{ items: Program[]; total: number; totalPages: number }> {
  const page = options?.page || 1;
  const limit = options?.limit || 12;
  const unitId = await getSdUnitId();

  if (unitId) {
    // Filter through unit_programs junction table
    const { count } = await supabase
      .from("unit_programs")
      .select("*", { count: "exact", head: true })
      .eq("unit_id", unitId);

    const { data: links, error: linkError } = await supabase
      .from("unit_programs")
      .select("program_id")
      .eq("unit_id", unitId);

    if (linkError) throw linkError;

    const programIds = (links || []).map(l => l.program_id);
    if (programIds.length === 0) {
      return { items: [], total: 0, totalPages: 0 };
    }

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .in("id", programIds)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const total = count || 0;
    return {
      items: data as Program[],
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // No unit filter — return all published programs
  const { count } = await supabase
    .from("programs")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;

  const total = count || 0;
  return {
    items: data as Program[],
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Program;
}
