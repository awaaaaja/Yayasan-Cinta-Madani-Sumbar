<script setup lang="ts">
import { ref, onMounted } from "vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import PageSectionRenderer from "@/components/sections/PageSectionRenderer.vue";
import { listPublishedAlbums } from "@/services/gallery.service";
import type { GalleryAlbum } from "@/services/gallery.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Galeri", description: "Galeri kegiatan dan momen SD Cinta Madani." });

const albums = ref<GalleryAlbum[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = 12;

async function fetchAlbums() {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await listPublishedAlbums({ page: currentPage.value, limit });
    albums.value = result.items;
    totalPages.value = result.totalPages;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchAlbums();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(fetchAlbums);
</script>

<template>
  <div>
    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Galeri' }]" class="mb-8" />

        <PageSectionRenderer page-key="galeri" />

        <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          <Skeleton v-for="i in 8" :key="i" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchAlbums" />

        <EmptyState v-else-if="albums.length === 0" title="Belum ada galeri" description="Galeri akan segera tersedia." />

        <div v-else>
          <p class="text-small text-muted mb-4 mt-8">{{ total }} album</p>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <RouterLink
              v-for="album in albums"
              :key="album.id"
              :to="`/galeri/${album.slug}`"
              class="group block relative aspect-square bg-surface-soft rounded-[16px] overflow-hidden"
            >
              <img
                v-if="album.cover_url"
                :src="album.cover_url"
                :alt="album.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[var(--motion-slow)]"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--motion-normal)]" />
              <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[var(--motion-normal)]">
                <h2 class="text-body font-semibold text-cream-100">{{ album.title }}</h2>
              </div>
            </RouterLink>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-12">
            <button
              :disabled="currentPage <= 1"
              class="h-10 px-4 rounded-[var(--radius-sm)] text-small font-medium border border-line disabled:opacity-40 hover:bg-surface-soft transition-colors"
              @click="goToPage(currentPage - 1)"
            >
              &laquo; Sebelumnya
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              :class="[
                'h-10 w-10 rounded-[var(--radius-sm)] text-small font-medium transition-colors',
                page === currentPage ? 'bg-primary text-white' : 'border border-line hover:bg-surface-soft'
              ]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage >= totalPages"
              class="h-10 px-4 rounded-[var(--radius-sm)] text-small font-medium border border-line disabled:opacity-40 hover:bg-surface-soft transition-colors"
              @click="goToPage(currentPage + 1)"
            >
              Selanjutnya &raquo;
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
