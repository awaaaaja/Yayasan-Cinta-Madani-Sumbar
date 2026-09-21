import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";

export interface Facility {
  id: string;
  unit_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
}

export async function listFacilities(): Promise<Facility[]> {
  const unitId = await getSdUnitId();

  let query = supabase
    .from("unit_facilities")
    .select("*")
    .order("sort_order", { ascending: true });

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query;
  if (error) throw error;
  return data as Facility[];
}

export async function getFacility(id: string): Promise<Facility> {
  const { data, error } = await supabase
    .from("unit_facilities")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Facility;
}
