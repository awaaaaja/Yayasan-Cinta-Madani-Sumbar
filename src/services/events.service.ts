import { supabase } from "./supabase";
import type { Event } from "@/types";

export type { Event };

export async function listUpcomingEvents(options: { unitId?: string; limit?: number } = {}) {
  const { unitId, limit = 10 } = options;

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(limit);

  if (unitId) {
    query = query.eq("unit_id", unitId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Event[];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Event;
}
