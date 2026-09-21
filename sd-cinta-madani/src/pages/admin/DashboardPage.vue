<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { listNewsAdmin } from "@/services/admin/news.admin.service";
import { listUnits } from "@/services/admin/units.admin.service";
import { listPrograms } from "@/services/admin/programs.admin.service";
import { listMessages } from "@/services/admin/contacts.admin.service";

const router = useRouter();
const auth = useAuthStore();

const stats = ref([
  { label: "Berita", count: 0, icon: "📰", route: "/admin/news" },
  { label: "Unit", count: 0, icon: "🏫", route: "/admin/units" },
  { label: "Program", count: 0, icon: "📚", route: "/admin/programs" },
  { label: "Pesan", count: 0, icon: "✉️", route: "/admin/contacts" },
]);

const recentNews = ref<Array<{ id: string; title: string; status: string; created_at: string }>>([]);
const loading = ref(true);

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getBadgeClass(status: string) {
  if (status === "published") return "bg-green-100 text-green-700";
  if (status === "archived") return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-700";
}

onMounted(async () => {
  document.title = "Dashboard - Admin";

  const [news, units, programs, contacts] = await Promise.all([
    listNewsAdmin({ page: 1, pageSize: 5 }),
    listUnits({ page: 1, pageSize: 1 }),
    listPrograms({ page: 1, pageSize: 1 }),
    listMessages({ page: 1, pageSize: 1 }),
  ]);

  stats.value[0].count = news.count;
  stats.value[1].count = units.count;
  stats.value[2].count = programs.count;
  stats.value[3].count = contacts.count;
  recentNews.value = news.data.map((n) => ({
    id: n.id,
    title: n.title,
    status: n.status,
    created_at: n.created_at,
  }));

  loading.value = false;
});
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">
        Selamat datang, {{ auth.profile?.full_name || auth.user?.email?.split("@")[0] || "Admin" }}
      </h1>
      <p class="mt-1 text-body text-[var(--color-moss)]">Ringkasan data website</p>
    </div>

    <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <button
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-[var(--color-sand)] bg-white p-5 text-left transition-colors hover:border-[var(--color-moss)]"
        @click="router.push(stat.route)"
      >
        <div class="flex items-center justify-between">
          <span class="text-small text-[var(--color-moss)]">{{ stat.label }}</span>
          <span class="text-2xl">{{ stat.icon }}</span>
        </div>
        <p class="mt-3 text-3xl font-bold text-[var(--color-bark)]">
          {{ loading ? "-" : stat.count }}
        </p>
      </button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="font-semibold text-[var(--color-bark)]">Berita Terbaru</h2>
          <button
            class="text-small text-[var(--color-forest)] hover:underline"
            @click="router.push('/admin/news')"
          >
            Lihat Semua
          </button>
        </div>
        <div v-if="loading" class="py-8 text-center text-[var(--color-moss)]">Memuat...</div>
        <div v-else-if="recentNews.length === 0" class="py-8 text-center text-[var(--color-moss)]">
          Belum ada berita
        </div>
        <ul v-else class="divide-y divide-[var(--color-sand)]">
          <li
            v-for="news in recentNews"
            :key="news.id"
            class="flex cursor-pointer items-center justify-between py-3 hover:bg-[var(--color-cream)]/50 -mx-2 px-2 rounded-lg"
            @click="router.push(`/admin/news/${news.id}/edit`)"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate text-body font-medium text-[var(--color-bark)]">{{ news.title }}</p>
              <p class="text-xs text-[var(--color-moss)]">{{ formatDate(news.created_at) }}</p>
            </div>
            <span
              :class="[
                'ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                getBadgeClass(news.status),
              ]"
            >
              {{ news.status }}
            </span>
          </li>
        </ul>
      </div>

      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-5">
        <h2 class="mb-4 font-semibold text-[var(--color-bark)]">Aksi Cepat</h2>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="action in [
              { label: 'Tambah Berita', icon: 'M12 4v16m8-8H4', route: '/admin/news/create' },
              { label: 'Lihat Pesan', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', route: '/admin/contacts' },
              { label: 'Media Library', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', route: '/admin/media' },
              { label: 'Pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', route: '/admin/settings' },
            ]"
            :key="action.label"
            class="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-sand)] p-4 text-center hover:border-[var(--color-moss)] hover:bg-[var(--color-cream)]"
            @click="router.push(action.route)"
          >
            <svg class="h-6 w-6 text-[var(--color-forest)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
            </svg>
            <span class="text-small font-medium text-[var(--color-bark)]">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
