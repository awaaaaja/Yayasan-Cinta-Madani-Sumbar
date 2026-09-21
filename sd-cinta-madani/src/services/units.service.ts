import { supabase } from "./supabase";
import type { EducationUnit } from "@/types";

export type { EducationUnit };

export async function listPublishedUnits(): Promise<EducationUnit[]> {
  const { data, error } = await supabase
    .from("education_units")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as EducationUnit[];
}

export async function getUnitBySlug(slug: string): Promise<EducationUnit | null> {
  const { data, error } = await supabase
    .from("education_units")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as EducationUnit;
}
