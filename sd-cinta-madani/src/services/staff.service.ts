import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";
import type { Staff } from "@/types";

export async function listStaff(): Promise<Staff[]> {
  const unitId = await getSdUnitId();

  let query = supabase
    .from("staff")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query;
  if (error) throw error;
  return data as Staff[];
}

export async function getStaff(id: string): Promise<Staff> {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .single();
  if (error) throw error;
  return data as Staff;
}
