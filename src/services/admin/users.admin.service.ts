import { supabase } from '@/services/supabase';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export async function listUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role, is_active, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as UserProfile[];
}

export async function updateUserProfile(id: string, data: { role?: string; is_active?: boolean }): Promise<UserProfile> {
  const { data: result, error } = await supabase
    .from('profiles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result as UserProfile;
}
