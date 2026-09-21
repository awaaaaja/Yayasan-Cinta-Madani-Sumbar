<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import { listPublishedAlbums } from "@/services/gallery.service";
import type { GalleryAlbum } from "@/services/gallery.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Galeri", description: "Galeri kegiatan dan momen Yayasan Cinta Madani." });

const albums = ref<GalleryAlbum[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchAlbums() {
  isLoading.value = true;
  error.value = null;
  try {
    albums.value = await listPublishedAlbums({ limit: 20 });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchAlbums);
</script>

<template>
  <div>
    <PageHeader title="Galeri" description="Dokumentasi kegiatan dan momen di Yayasan Cinta Madani." />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Galeri' }]" />

        <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Skeleton v-for="i in 8" :key="i" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchAlbums" />

        <EmptyState v-else-if="albums.length === 0" title="Belum ada galeri" description="Galeri akan segera tersedia." />

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>
    </section>
  </div>
</template>
