import { supabase } from "./supabase";
import type { PpdbPeriod } from "@/types";

export type { PpdbPeriod };

// ponytail: not in @/types — keep local until canonical definition is added
export interface PpdbRequirement {
  id: string;
  ppdb_period_id: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
}

// ponytail: not in @/types — keep local until canonical definition is added
export interface PpdbFaq {
  id: string;
  ppdb_period_id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}

export async function getActivePpdbPeriods(): Promise<PpdbPeriod[]> {
  const { data, error } = await supabase
    .from("ppdb_periods")
    .select("*")
    .in("status", ["open", "coming_soon"])
    .order("start_date", { ascending: true });

  if (error) throw error;
  return data as PpdbPeriod[];
}

export async function getPpdbByUnitSlug(unitSlug: string): Promise<PpdbPeriod | null> {
  const { data: unit, error: unitError } = await supabase
    .from("education_units")
    .select("id")
    .eq("slug", unitSlug)
    .single();

  if (unitError || !unit) return null;

  const { data, error } = await supabase
    .from("ppdb_periods")
    .select("*")
    .eq("unit_id", unit.id)
    .in("status", ["open", "coming_soon"])
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as PpdbPeriod;
}

export async function getPpdbRequirements(periodId: string): Promise<PpdbRequirement[]> {
  const { data, error } = await supabase
    .from("ppdb_requirements")
    .select("*")
    .eq("ppdb_period_id", periodId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as PpdbRequirement[];
}

export async function getPpdbFaqs(periodId: string): Promise<PpdbFaq[]> {
  const { data, error } = await supabase
    .from("ppdb_faqs")
    .select("*")
    .eq("ppdb_period_id", periodId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as PpdbFaq[];
}
