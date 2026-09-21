import { supabase } from "./supabase";
import type { Staff } from "@/types";

export async function listStaff(options: { unitId?: string } = {}): Promise<Staff[]> {
  let query = supabase
    .from("staff")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (options.unitId) {
    query = query.eq("unit_id", options.unitId);
  } else {
    query = query.is("unit_id", null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Staff[];
}
