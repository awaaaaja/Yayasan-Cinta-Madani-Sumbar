import { supabase } from "./supabase";

const SD_UNIT_SLUG = "sd-cinta-madani";

let cachedUnitId: string | null = null;
let fetched = false;

export async function getSdUnitId(): Promise<string | null> {
  if (fetched) return cachedUnitId;

  const { data, error } = await supabase
    .from("education_units")
    .select("id")
    .eq("slug", SD_UNIT_SLUG)
    .eq("status", "published")
    .single();

  if (error || !data) {
    cachedUnitId = null;
  } else {
    cachedUnitId = data.id;
  }
  fetched = true;
  return cachedUnitId;
}
