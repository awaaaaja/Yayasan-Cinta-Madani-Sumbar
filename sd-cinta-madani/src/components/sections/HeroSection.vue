<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { listActiveHeroSlides } from "@/services/hero.service";
import { imagePlaceholders } from "@/config/images";
import AnimatedButton from "@/components/ui/AnimatedButton.vue";
import type { HeroSlide } from "@/services/hero.service";

const slides = ref<HeroSlide[]>([]);
const currentIndex = ref(0);
const isLoading = ref(true);
const isVisible = ref(false);
const isPaused = ref(false);
const isHovered = ref(false);
const progress = ref(0);

let autoplayTimer: ReturnType<typeof setInterval> | null = null;
let progressTimer: ReturnType<typeof setInterval> | null = null;
let observer: IntersectionObserver | null = null;

const currentSlide = computed(() => slides.value[currentIndex.value] || null);
const totalSlides = computed(() => slides.value.length);
const showAutoplay = computed(() => totalSlides.value > 1 && !isPaused.value && !isHovered.value);

function getSlideImage(slide: HeroSlide): string {
  return slide.image_url || imagePlaceholders.hero;
}

function getSlidePosition(slide: HeroSlide): string {
  const map: Record<string, string> = {
    center: "center center",
    top: "center top",
    bottom: "center bottom",
    left: "left center",
    right: "right center",
  };
  return map[slide.image_position] || "center center";
}

function goToSlide(index: number) {
  if (index === currentIndex.value) return;
  currentIndex.value = index;
  resetProgress();
}

function nextSlide() {
  if (totalSlides.value === 0) return;
  currentIndex.value = (currentIndex.value + 1) % totalSlides.value;
  resetProgress();
}

function prevSlide() {
  if (totalSlides.value === 0) return;
  currentIndex.value = (currentIndex.value - 1 + totalSlides.value) % totalSlides.value;
  resetProgress();
}

function togglePause() {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}

function resetProgress() {
  progress.value = 0;
  stopAutoplay();
  if (!isPaused.value && !isHovered.value) {
    startAutoplay();
  }
}

function startAutoplay() {
  stopAutoplay();
  const duration = currentSlide.value?.duration || 6000;
  const interval = 50;
  const step = (interval / duration) * 100;

  progressTimer = setInterval(() => {
    progress.value = Math.min(progress.value + step, 100);
  }, interval);

  autoplayTimer = setTimeout(() => {
    nextSlide();
  }, duration);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearTimeout(autoplayTimer);
    autoplayTimer = null;
  }
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progress.value = 0;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === " ") {
    e.preventDefault();
    togglePause();
  }
}

async function fetchSlides() {
  isLoading.value = true;
  try {
    const data = await listActiveHeroSlides();
    slides.value = data;
  } catch {
    const fallbackTitles = [
      "Menumbuhkan Generasi Cerdas, Berkarakter, dan Berakhlak Mulia.",
      "Membangun Fondasi Iman dan Ilmu sejak Dini.",
      "Lingkungan Belajar yang Aman, Nyaman, dan Menyenangkan.",
    ];
    const fallbackDescriptions = [
      "Sekolah dasar Islam unggulan yang menggabungkan kurikulum nasional dengan nilai-nilai keislaman, membentuk siswa yang cerdas, kreatif, dan beriman.",
      "Program Tahfiz, Bahasa Arab, dan Bina Pribadi Islami menyempurnakan pendidikan formal dengan pembentukan karakter Islami.",
      "Setiap hari adalah kesempatan belajar, bermain, dan bertumbuh dalam nuansa keimanan dan kebersamaan.",
    ];
    slides.value = imagePlaceholders.heroSlides.map((url, i) => ({
      id: `fallback-${i}`,
      title: fallbackTitles[i] || fallbackTitles[0],
      description: fallbackDescriptions[i] || fallbackDescriptions[0],
      image_url: url,
      image_alt: null,
      image_position: "center",
      duration: 6000,
      sort_order: i,
      is_active: true,
      cta_label: i === 0 ? "Kenali SD" : "Lihat Program",
      cta_url: i === 0 ? "/tentang" : "/program",
      created_at: "",
      updated_at: "",
    }));
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchSlides();

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    isVisible.value = true;
    isPaused.value = true;
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.1 }
  );
  const el = document.getElementById("hero-section");
  if (el) observer.observe(el);
});

onUnmounted(() => {
  observer?.disconnect();
  stopAutoplay();
});

watch(
  [isVisible, () => slides.value.length],
  ([visible, len]) => {
    if (visible && len > 0 && !isPaused.value) {
      startAutoplay();
    }
  },
  { immediate: true }
);

watch(isHovered, (hovered) => {
  if (hovered) {
    stopAutoplay();
  } else if (!isPaused.value && isVisible.value) {
    startAutoplay();
  }
});
</script>

<template>
  <section
    id="hero-section"
    class="relative min-h-[85vh] md:min-h-[88vh] flex items-end md:items-center bg-forest-950 overflow-hidden"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @keydown="handleKeydown"
  >
    <!-- Loading -->
    <div v-if="isLoading" class="w-full container-site py-32">
      <div class="flex flex-col gap-6 animate-pulse max-w-[640px]">
        <div class="h-4 bg-white/10 rounded w-40" />
        <div class="h-16 bg-white/10 rounded w-3/4" />
        <div class="h-16 bg-white/10 rounded w-1/2" />
        <div class="h-4 bg-white/10 rounded w-2/3 mt-4" />
        <div class="flex gap-4 mt-4">
          <div class="h-12 bg-white/10 rounded-xl w-40" />
          <div class="h-12 bg-white/10 rounded-xl w-40" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="slides.length === 0 && !isLoading" class="w-full container-site py-32 text-center">
      <p class="text-cream-100/80 text-body mb-4">Gagal memuat data hero.</p>
      <AnimatedButton variant="accent" @click="fetchSlides">Coba Lagi</AnimatedButton>
    </div>

    <!-- Slideshow -->
    <template v-else>
      <!-- Background slides with crossfade -->
      <div class="absolute inset-0 z-0">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          :class="index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          <div
            class="w-full h-full bg-cover bg-no-repeat transition-transform duration-[8000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            :style="{
              backgroundImage: `url(${getSlideImage(slide)})`,
              backgroundPosition: getSlidePosition(slide),
              transform: index === currentIndex ? 'scale(1.04)' : 'scale(1)',
            }"
          />
        </div>
      </div>

      <!-- Gradient overlay -->
      <div class="absolute inset-0 z-[1] bg-gradient-to-r from-forest-950/82 via-forest-950/42 to-forest-950/12" />
      <div class="absolute inset-0 z-[1] bg-gradient-to-t from-forest-950/60 via-transparent to-forest-950/20" />

      <!-- Content overlay -->
      <div class="relative z-10 w-full container-site py-20 md:py-28 lg:py-32">
        <div class="max-w-[700px]">
          <!-- Eyebrow -->
          <p
            class="text-eyebrow text-accent-light mb-4 md:mb-5"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 500ms cubic-bezier(0.22,1,0.36,1) 100ms',
            }"
          >
            SD QUR'AN CINTA MADANI
          </p>

          <!-- Headline — from CMS slide or fallback -->
          <h1
            class="text-display-hero text-cream-100 mb-5 md:mb-6"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 600ms cubic-bezier(0.22,1,0.36,1) 200ms',
            }"
          >
            {{ currentSlide?.title || "Menumbuhkan Generasi Cerdas, Berkarakter, dan Berakhlak Mulia." }}
          </h1>

          <!-- Description — from CMS slide or fallback -->
          <p
            class="text-body-lg text-cream-100/70 max-w-[480px] mb-8 md:mb-10"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 500ms cubic-bezier(0.22,1,0.36,1) 350ms',
            }"
          >
            {{ currentSlide?.description || "Sekolah dasar Islam unggulan yang menggabungkan kurikulum nasional dengan nilai-nilai keislaman, membentuk siswa yang cerdas, kreatif, dan beriman." }}
          </p>

          <!-- CTAs — from CMS slide or fallback -->
          <div
            class="flex flex-wrap gap-3 md:gap-4"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 500ms cubic-bezier(0.22,1,0.36,1) 450ms',
            }"
          >
            <AnimatedButton
              variant="accent"
              size="lg"
              :to="currentSlide?.cta_url || '/tentang'"
            >
              {{ currentSlide?.cta_label || "Kenali SD" }}
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              size="lg"
              to="/program"
              class="!border-cream-100/30 !text-cream-100 hover:!bg-cream-100/10"
            >
              Lihat Program
            </AnimatedButton>
          </div>
        </div>
      </div>

      <!-- Slide counter (bottom left) -->
      <div
        class="absolute bottom-8 left-6 md:bottom-12 md:left-8 z-10 flex items-center gap-3"
        :style="{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.22,1,0.36,1) 700ms',
        }"
      >
        <button
          v-if="showAutoplay"
          class="w-9 h-9 flex items-center justify-center rounded-full border border-cream-100/30 text-cream-100/70 hover:text-cream-100 hover:border-cream-100/60 transition-all duration-300"
          :aria-label="isPaused ? 'Putar slideshow' : 'Jeda slideshow'"
          @click="togglePause"
        >
          <svg v-if="!isPaused" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
        <span class="text-caption text-cream-100/50 tabular-nums">
          {{ String(currentIndex + 1).padStart(2, "0") }} / {{ String(totalSlides).padStart(2, "0") }}
        </span>
      </div>

      <!-- Progress bar (bottom) -->
      <div
        v-if="showAutoplay"
        class="absolute bottom-0 left-0 right-0 h-[2px] z-10 bg-cream-100/10"
      >
        <div
          class="h-full bg-accent transition-none"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <!-- Navigation arrows (desktop) -->
      <div
        class="absolute bottom-8 right-6 md:bottom-12 md:right-8 z-10 hidden md:flex items-center gap-2"
        :style="{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.22,1,0.36,1) 700ms',
        }"
      >
        <button
          class="w-10 h-10 flex items-center justify-center rounded-full border border-cream-100/20 text-cream-100/60 hover:text-cream-100 hover:border-cream-100/50 transition-all duration-300"
          aria-label="Slide sebelumnya"
          @click="prevSlide"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          class="w-10 h-10 flex items-center justify-center rounded-full border border-cream-100/20 text-cream-100/60 hover:text-cream-100 hover:border-cream-100/50 transition-all duration-300"
          aria-label="Slide berikutnya"
          @click="nextSlide"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <!-- Dot indicators (mobile) -->
      <div
        class="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 md:hidden"
        :style="{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.22,1,0.36,1) 700ms',
        }"
      >
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="index === currentIndex ? 'bg-accent w-5' : 'bg-cream-100/30'"
          :aria-label="`Slide ${index + 1}`"
          @click="goToSlide(index)"
        />
      </div>

      <!-- Scroll indicator (desktop) -->
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:block"
        :style="{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.22,1,0.36,1) 900ms',
        }"
      >
        <a href="#stats" class="inline-flex flex-col items-center gap-2 text-cream-100/30 text-caption group">
          <span class="transition-colors duration-300 group-hover:text-cream-100/60">Scroll</span>
          <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </template>
  </section>
</template>
