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

export interface PpdbRegistrationInput {
  period_id: string;
  nik: string;
  nisn: string | null;
  full_name: string;
  birth_place: string;
  birth_date: string;
  gender: "L" | "P";
  religion: string;
  address: string;
  rt: string | null;
  rw: string | null;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string | null;
  phone: string | null;
  father_name: string;
  father_occupation: string;
  father_income: string;
  mother_name: string;
  mother_occupation: string;
  mother_income: string;
  guardian_name: string | null;
  previous_school: string;
  previous_school_npsn: string | null;
  previous_school_address: string | null;
  graduation_year: number;
}

export async function submitRegistration(
  input: PpdbRegistrationInput,
  files: Record<string, File>,
): Promise<string> {
  const now = new Date().toISOString();
  const regNumber = `PPDB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

  const { data: regData, error: regError } = await supabase
    .from("ppdb_registrations")
    .insert({
      ...input,
      registration_number: regNumber,
      status: "pending",
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (regError) throw regError;

  const regId = regData.id;
  const entries = Object.entries(files);
  if (entries.length > 0) {
    const docs = await Promise.all(
      entries.map(async ([key, file]) => {
        const path = `${regId}/${key}`;
        const { data: upload, error: uploadErr } = await supabase.storage
          .from("ppdb-documents")
          .upload(path, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("ppdb-documents").getPublicUrl(upload.path);
        return {
          registration_id: regId,
          document_type: key,
          file_name: file.name,
          file_url: urlData.publicUrl,
        };
      }),
    );
    const { error: docErr } = await supabase.from("ppdb_documents").insert(docs);
    if (docErr) throw docErr;
  }

  return regNumber;
}
