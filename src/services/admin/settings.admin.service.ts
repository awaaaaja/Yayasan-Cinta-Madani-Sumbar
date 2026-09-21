import { supabase } from '../supabase';
import type { SiteSettings } from '@/types';

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const existing = await getSettings();
  const { data: result, error } = await supabase
    .from('site_settings')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', existing.id)
    .select()
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'update',
      entity_type: 'site_settings',
      entity_id: existing.id,
      metadata: Object.keys(data),
    });
  }

  return result as SiteSettings;
}
