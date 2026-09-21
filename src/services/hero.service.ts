import { supabase } from "./supabase";

export interface HeroSlide {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  image_alt: string | null;
  image_position: string;
  duration: number;
  sort_order: number;
  is_active: boolean;
  cta_label: string | null;
  cta_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function listActiveHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as HeroSlide[];
}

export async function listAllHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as HeroSlide[];
}

export async function getHeroSlide(id: string): Promise<HeroSlide | null> {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as HeroSlide;
}

export async function createHeroSlide(
  slide: Omit<HeroSlide, "id" | "created_at" | "updated_at">
): Promise<HeroSlide> {
  const { data, error } = await supabase
    .from("hero_slides")
    .insert(slide)
    .select()
    .single();

  if (error) throw error;
  return data as HeroSlide;
}

export async function updateHeroSlide(
  id: string,
  updates: Partial<Omit<HeroSlide, "id" | "created_at" | "updated_at">>
): Promise<HeroSlide> {
  const { data, error } = await supabase
    .from("hero_slides")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as HeroSlide;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderHeroSlides(
  orderedIds: string[]
): Promise<void> {
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("hero_slides")
      .update({ sort_order: index + 1 })
      .eq("id", id)
  );
  await Promise.all(updates);
}
