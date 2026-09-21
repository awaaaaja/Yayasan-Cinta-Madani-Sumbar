<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useErrorToast } from "@/composables/useErrorToast";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminTopbar from "@/components/admin/AdminTopbar.vue";

const auth = useAuthStore();
const router = useRouter();
const sidebarOpen = ref(false);
const { toasts, dismiss } = useErrorToast();

onMounted(async () => {
  await auth.init();
  if (!auth.isAuthenticated) {
    router.push("/admin/login");
  }
});

async function handleLogout() {
  await auth.signOut();
  router.push("/admin/login");
}
</script>

<template>
  <div v-if="auth.loading" class="flex h-screen items-center justify-center bg-[var(--color-cream)]">
    <div class="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-moss)] border-t-transparent" />
  </div>
  <div v-else-if="auth.isAuthenticated" class="flex h-screen overflow-hidden bg-[var(--color-cream)]">
    <AdminSidebar :collapsed="!sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />
    <div class="flex flex-1 flex-col lg:pl-[240px]">
      <AdminTopbar
        :user="{
          full_name: auth.profile?.full_name || auth.user?.email?.split('@')[0] || 'Admin',
          avatar_url: auth.profile?.avatar_url ?? undefined,
          role: auth.userRole,
        }"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @logout="handleLogout"
      />
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <RouterView />
      </main>
    </div>
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
  <!-- Toast notifications -->
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300',
        toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
      ]"
    >
      {{ toast.message }}
      <button @click="dismiss(toast.id)" class="ml-2 underline">✕</button>
    </div>
  </div>
</template>
