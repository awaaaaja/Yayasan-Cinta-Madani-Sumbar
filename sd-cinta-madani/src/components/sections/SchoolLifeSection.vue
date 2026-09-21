<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { useFocusTrap } from "@/composables/useFocusTrap";
import { getSectionContent } from "@/services/homepage.service";
import { imagePlaceholders } from "@/config/images";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import SmartImage from "@/components/ui/SmartImage.vue";

interface SchoolLifeContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  images?: string[];
  captions?: string[];
  section_label?: string;
  activity_labels?: string[];
}

const content = ref<SchoolLifeContent | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const lightboxIndex = ref<number | null>(null);
const lightboxOpen = computed(() => lightboxIndex.value !== null);
const lightboxRef = ref<HTMLElement | null>(null);

useFocusTrap(lightboxOpen, lightboxRef);

const { element: sectionEl, isVisible } = useScrollReveal();

const fallbackImages = [
  imagePlaceholders.schoolLife,
  imagePlaceholders.schoolLife1,
  imagePlaceholders.schoolLife2,
  imagePlaceholders.schoolLife3,
];

function openLightbox(index: number) {
  lightboxIndex.value = index;
}

function closeLightbox() {
  lightboxIndex.value = null;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && lightboxIndex.value !== null) {
    closeLightbox();
  }
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    content.value = await getSectionContent<SchoolLifeContent>("school_life");
  } catch {
    content.value = null;
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
    id="school-life"
    class="relative section-pad-lg bg-primary-dark text-cream-100 overflow-hidden"
  >
    <!-- Background image with overlay -->
    <div class="absolute inset-0 z-0">
      <img
        :src="(content?.images?.[0]) || fallbackImages[0]"
        alt=""
        class="w-full h-full object-cover opacity-20"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary-dark/85 to-primary-dark/95" />
    </div>

    <div class="container-site relative z-10">
      <!-- Loading -->
        <div v-if="isLoading" class="animate-pulse">
        <div class="h-4 bg-white/10 rounded w-24 mb-4" />
        <div class="h-14 bg-white/10 rounded w-72 mb-12" />
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div class="md:col-span-7 aspect-[4/3] bg-white/5 rounded-[16px]" />
          <div class="md:col-span-5 grid grid-cols-2 gap-3">
            <div class="aspect-[4/3] bg-white/5 rounded-[16px]" />
            <div class="aspect-[4/3] bg-white/5 rounded-[16px]" />
            <div class="aspect-[4/3] bg-white/5 rounded-[16px]" />
            <div class="aspect-[4/3] bg-white/5 rounded-[16px]" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-body text-cream-100/60 mb-4">{{ error }}</p>
        <button class="h-12 px-6 bg-accent text-primary-dark font-semibold rounded-[var(--radius-sm)]" @click="fetchData">
          Coba Lagi
        </button>
      </div>

      <!-- Empty / Content -->
      <div v-else>
        <div
          :style="{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 600ms var(--ease-out)',
          }"
        >
          <SectionLabel :index="content?.eyebrow || '05'" :label="content?.section_label || 'Kehidupan Sekolah'" class="!text-accent [&_.text-eyebrow]:!text-accent" />
          <h2 class="text-h1 text-cream-100 mb-4 max-w-lg">
            {{ content?.heading || 'Setiap Hari adalah Petualangan Belajar.' }}
          </h2>
          <p v-if="content?.description" class="text-body-lg text-cream-100/60 max-w-[480px] mb-10">
            {{ content.description }}
          </p>
        </div>

        <!-- Image grid -->
        <div
          class="grid grid-cols-2 md:grid-cols-12 gap-3"
          :style="{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 700ms var(--ease-out) 200ms',
          }"
        >
          <!-- Main image (7 cols desktop, 2 cols mobile) -->
          <div
            class="col-span-2 md:col-span-7 relative group rounded-[16px] overflow-hidden cursor-pointer"
            @click="openLightbox(0)"
          >
            <SmartImage
              :src="content?.images?.[0] || fallbackImages[0]"
              :alt="content?.captions?.[0] || 'Kehidupan sekolah'"
              aspect="4/3"
              :hover-scale="true"
            />
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <p class="text-caption text-cream-100">{{ content?.captions?.[0] || 'Kehidupan di Cinta Madani' }}</p>
            </div>
          </div>

          <!-- Detail images (5 cols desktop, 2 cols mobile) — 2x2 grid -->
          <div class="col-span-2 md:col-span-5 grid grid-cols-2 gap-3">
            <div
              v-for="(img, i) in (content?.images || fallbackImages).slice(1, 4)"
              :key="i"
              class="relative group rounded-[16px] overflow-hidden cursor-pointer"
              @click="openLightbox(i + 1)"
            >
              <SmartImage
                :src="img"
                :alt="content?.captions?.[i + 1] || 'Detail kehidupan sekolah'"
                aspect="4/3"
                :hover-scale="true"
              />
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-primary-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <p class="text-caption text-cream-100">{{ content?.captions?.[i + 1] || 'Aktivitas' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating activity labels -->
        <div
          class="hidden md:flex gap-3 mt-8"
          :style="{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms var(--ease-out) 500ms',
          }"
        >
          <span v-for="label in (content?.activity_labels?.length ? content.activity_labels : ['Belajar', 'Bermain', 'Eksplorasi'])" :key="label" class="glass-dark rounded-full px-4 py-2 text-caption text-cream-100/80">
            {{ label }}
          </span>
        </div>

        <!-- CTA -->
        <div
          :style="{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms var(--ease-out) 600ms',
          }"
          class="mt-10"
        >
          <ArrowLink to="/galeri" label="Lihat Galeri" :white="true" />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxIndex !== null"
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
        <img
          :src="(content?.images || fallbackImages)[lightboxIndex]"
          :alt="content?.captions?.[lightboxIndex] || ''"
          class="max-w-[90vw] max-h-[85vh] object-contain rounded-[16px]"
        />
      </div>
    </Teleport>
  </section>
</template>
