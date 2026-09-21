import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const profile = ref<UserProfile | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => profile.value?.role ?? "editor");
  const isSuperAdmin = computed(() => userRole.value === "super_admin");

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    user.value = session?.user ?? null;

    if (user.value) {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role, is_active")
        .eq("id", user.value.id)
        .single();
      profile.value = data as UserProfile | null;
    }

    loading.value = false;

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null;
      if (user.value) {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, role, is_active")
          .eq("id", user.value.id)
          .single();
        profile.value = data as UserProfile | null;
      } else {
        profile.value = null;
      }
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    user.value = null;
    profile.value = null;
  }

  return { user, profile, loading, isAuthenticated, userRole, isSuperAdmin, init, signOut };
});
