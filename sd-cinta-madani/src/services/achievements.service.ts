import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";
import type { Achievement } from "@/types";

export type { Achievement };

export async function listAchievements(options: { featuredOnly?: boolean } = {}) {
  const { featuredOnly } = options;
  const unitId = await getSdUnitId();

  let query = supabase
    .from("achievements")
    .select("*")
    .order("year", { ascending: false });

  if (unitId) query = query.eq("unit_id", unitId);
  if (featuredOnly) query = query.eq("featured", true);

  const { data, error } = await query;
  if (error) throw error;
  return data as Achievement[];
}
