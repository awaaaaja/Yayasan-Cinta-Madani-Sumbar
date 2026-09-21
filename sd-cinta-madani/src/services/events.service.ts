import { supabase } from "./supabase";
import { getSdUnitId } from "./sd-unit";
import type { Event } from "@/types";

export type { Event };

export async function listUpcomingEvents(options: { limit?: number; page?: number } = {}) {
  const { limit = 10, page = 1 } = options;
  const unitId = await getSdUnitId();

  let countQuery = supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .gte("event_date", new Date().toISOString());

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
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
    items: data as Event[],
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const unitId = await getSdUnitId();

  let query = supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published");

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query.single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Event;
}
