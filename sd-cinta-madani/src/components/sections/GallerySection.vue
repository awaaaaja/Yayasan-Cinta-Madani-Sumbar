<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { useFocusTrap } from "@/composables/useFocusTrap";
import { type PlaceholderKey } from "@/config/images";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import { getSectionContent } from "@/services/homepage.service";
import type { GalleryAlbum } from "@/services/gallery.service";

interface GalleryContent {
  heading?: string;
  section_number?: string;
  section_label?: string;
}

const albums = ref<GalleryAlbum[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const lightboxIndex = ref<number | null>(null);
const lightboxOpen = computed(() => lightboxIndex.value !== null);
const lightboxRef = ref<HTMLElement | null>(null);
const heading = ref("Galeri Kegiatan.");
const sectionNumber = ref("07");
const sectionLabel = ref("Galeri");

useFocusTrap(lightboxOpen, lightboxRef);

const { element: sectionEl, isVisible } = useScrollReveal();

const galleryPlaceholders: PlaceholderKey[] = [
  "gallery1", "gallery2", "gallery3", "gallery4", "gallery5",
];

function openLightbox(index: number) {
  lightboxIndex.value = index;
}

function closeLightbox() {
  lightboxIndex.value = null;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && lightboxIndex.value !== null) closeLightbox();
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [galleryResult, sectionContent] = await Promise.all([
      import("@/services/gallery.service").then(m => m.listPublishedAlbums({ limit: 6 })),
      getSectionContent<GalleryContent>("gallery"),
    ]);
    albums.value = galleryResult.items;
    if (sectionContent?.heading) heading.value = sectionContent.heading;
    if (sectionContent?.section_number) sectionNumber.value = sectionContent.section_number;
    if (sectionContent?.section_label) sectionLabel.value = sectionContent.section_label;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchData();
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <section
    :ref="(el) => { sectionEl = el as HTMLElement }"
    id="galeri"
    class="section-pad bg-cream-50"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-4 bg-sand rounded w-16 mb-4" />
        <div class="h-14 bg-sand rounded w-40 mb-12" />
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="aspect-[4/5] bg-sand rounded-[20px]" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-body text-muted mb-4">{{ error }}</p>
        <button class="h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)]" @click="fetchData">
          Coba Lagi
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="albums.length === 0" class="text-center py-16">
        <p class="text-body text-muted">Belum ada galeri tersedia.</p>
      </div>

      <!-- Content -->
      <div v-else>
        <div
          :style="{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 500ms var(--ease-out)',
          }"
        >
          <SectionLabel :index="sectionNumber" :label="sectionLabel" />
          <div class="flex items-end justify-between mb-10 md:mb-14">
            <h2 class="text-h1 text-text">{{ heading }}</h2>
            <ArrowLink to="/galeri" label="Lihat Semua" class="hidden md:flex" />
          </div>
        </div>

        <!-- Editorial staggered grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(album, index) in albums"
            :key="album.id"
            class="group relative rounded-[16px] overflow-hidden cursor-pointer"
            :class="[
              index === 0 ? 'md:row-span-2' : '',
            ]"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 500ms var(--ease-out) ${index * 60}ms`,
            }"
            @click="openLightbox(index)"
          >
            <div :class="index === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/5]'">
              <SmartImage
                :src="album.cover_url"
                :fallback-key="galleryPlaceholders[index % galleryPlaceholders.length]"
                :alt="album.title"
                :aspect="index === 0 ? '4/5' : '4/5'"
                :hover-scale="true"
              />
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <h3 class="text-h4 text-cream-100 mb-1">{{ album.title }}</h3>
                <p v-if="album.description" class="text-small text-cream-100/70 line-clamp-2">
                  {{ album.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 md:hidden">
          <ArrowLink to="/galeri" label="Lihat Semua" />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxIndex !== null && albums[lightboxIndex]"
        ref="lightboxRef"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        @click.self="closeLightbox"
      >
        <button
          class="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          @click="closeLightbox"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="max-w-[90vw] max-h-[85vh] text-center">
          <SmartImage
            :src="albums[lightboxIndex].cover_url"
            :fallback-key="galleryPlaceholders[lightboxIndex % galleryPlaceholders.length]"
            :alt="albums[lightboxIndex].title"
            aspect="16/10"
          />
          <p class="text-cream-100 mt-4 text-body font-semibold">
            {{ albums[lightboxIndex].title }}
          </p>
        </div>
      </div>
    </Teleport>
  </section>
</template>
