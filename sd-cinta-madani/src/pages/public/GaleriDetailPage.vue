<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import { getAlbumBySlug, getAlbumItems } from "@/services/gallery.service";
import type { GalleryAlbum, GalleryItem } from "@/services/gallery.service";
import { usePageHead } from "@/composables/usePageHead";
import { useFocusTrap } from "@/composables/useFocusTrap";

usePageHead({ title: "Galeri" });

const route = useRoute();
const router = useRouter();
const album = ref<GalleryAlbum | null>(null);
const items = ref<GalleryItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const lightboxRef = ref<HTMLElement | null>(null);

useFocusTrap(lightboxOpen, lightboxRef);

async function fetchAlbum() {
  isLoading.value = true;
  error.value = null;
  album.value = null;
  items.value = [];
  try {
    const slug = route.params.slug as string;
    const data = await getAlbumBySlug(slug);
    if (!data) {
      router.replace({ name: "not-found" });
      return;
    }
    album.value = data;
    usePageHead({ title: data.title, description: data.description || undefined });
    items.value = await getAlbumItems(data.id);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

function openLightbox(index: number) {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
}

function closeLightbox() {
  lightboxOpen.value = false;
}

function nextImage() {
  if (lightboxIndex.value < items.value.length - 1) lightboxIndex.value++;
}

function prevImage() {
  if (lightboxIndex.value > 0) lightboxIndex.value--;
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
}

onMounted(() => {
  fetchAlbum();
  document.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
watch(() => route.params.slug, fetchAlbum);
</script>

<template>
  <div>
    <div v-if="isLoading" class="bg-primary-dark min-h-[280px] md:min-h-[340px] flex items-end">
      <div class="container-site w-full py-12 md:py-16 lg:py-20 animate-pulse">
        <div class="h-4 bg-white/10 rounded w-24 mb-3" />
        <div class="h-10 bg-white/10 rounded w-3/4" />
      </div>
    </div>
    <PageHeader
      v-else-if="album"
      :title="album.title"
      :description="album.description || undefined"
      eyebrow="Galeri"
    />

    <section class="section-pad bg-background">
      <div class="container-site">
        <Breadcrumb v-if="album" :items="[{ label: 'Galeri', href: '/galeri' }, { label: album.title }]" />

        <ErrorState v-if="error" :message="error" :on-retry="fetchAlbum" />
        <EmptyState v-else-if="!isLoading && !album" title="Album tidak ditemukan" />

        <div v-else-if="items.length > 0" class="columns-2 md:columns-3 lg:columns-4 gap-4">
          <button
            v-for="(item, index) in items"
            :key="item.id"
            class="block w-full mb-4 break-inside-avoid rounded-[16px] overflow-hidden bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="openLightbox(index)"
          >
            <img
              v-if="item.media?.public_url"
              :src="item.media.public_url"
              :alt="item.media.alt_text || item.caption || album?.title"
              class="w-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        ref="lightboxRef"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/90 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Lightbox gambar"
        @click.self="closeLightbox"
      >
        <button
          class="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-cream-100 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
          aria-label="Tutup"
          @click="closeLightbox"
        >
          &times;
        </button>
        <button
          v-if="lightboxIndex > 0"
          class="absolute left-4 w-12 h-12 flex items-center justify-center text-cream-100 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
          aria-label="Gambar sebelumnya"
          @click="prevImage"
        >
          &#8249;
        </button>
        <button
          v-if="lightboxIndex < items.length - 1"
          class="absolute right-4 w-12 h-12 flex items-center justify-center text-cream-100 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
          aria-label="Gambar berikutnya"
          @click="nextImage"
        >
          &#8250;
        </button>
        <div class="max-w-[90vw] max-h-[85vh]">
          <img
            v-if="items[lightboxIndex]?.media?.public_url"
            :src="items[lightboxIndex].media!.public_url"
            :alt="items[lightboxIndex].media!.alt_text || items[lightboxIndex].caption || ''"
            class="max-w-full max-h-[85vh] object-contain rounded-[var(--radius-sm)]"
          />
          <p v-if="items[lightboxIndex]?.caption" class="text-center text-cream-100 text-body mt-4">
            {{ items[lightboxIndex].caption }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
