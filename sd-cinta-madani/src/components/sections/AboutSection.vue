<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { getAboutContent } from "@/services/homepage.service";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import type { AboutContent } from "@/types";

const content = ref<AboutContent | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const { element: sectionEl, isVisible } = useScrollReveal();

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    content.value = await getAboutContent();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <section
    :ref="(el) => { sectionEl = el as HTMLElement }"
    id="tentang"
    class="section-pad-lg bg-cream-100"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div class="lg:col-span-5 flex flex-col gap-6 animate-pulse">
          <div class="h-4 bg-sand rounded w-24" />
          <div class="h-14 bg-sand rounded w-3/4" />
          <div class="h-4 bg-sand rounded w-full mt-2" />
          <div class="h-4 bg-sand rounded w-2/3" />
        </div>
        <div class="lg:col-span-7 flex gap-4 animate-pulse">
          <div class="flex-[5] aspect-[4/5] bg-sand rounded-[24px]" />
          <div class="flex-[7] aspect-square bg-sand rounded-[24px] self-end" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-body text-muted mb-4">{{ error }}</p>
        <button class="h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)]" @click="fetchData">
          Coba Lagi
        </button>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <!-- Text Column -->
        <div
          class="lg:col-span-5 order-2 lg:order-1"
          :class="isVisible ? 'about-text-visible' : 'about-text-hidden'"
        >
          <SectionLabel
            :index="content?.eyebrow || '01'"
            :label="content?.section_label || 'Tentang SD'"
          />

          <h2 class="text-h1 text-text mb-6">
            {{ content?.heading || 'Pendidikan Dasar yang Menyenangkan dan Bermakna.' }}
          </h2>

          <p class="text-body-lg text-muted mb-8 leading-relaxed">
            {{ content?.description || 'SD Cinta Madani menyediakan lingkungan belajar yang aman, menyenangkan, dan menyeluruh bagi siswa untuk tumbuh secara akademis, sosial, dan spiritual.' }}
          </p>

          <ArrowLink
            :to="content?.cta_url || '/profil'"
            :label="content?.cta_label || 'Baca Profil SD'"
          />
        </div>

        <!-- Image Column -->
        <div
          class="lg:col-span-7 order-1 lg:order-2 relative"
          :class="isVisible ? 'about-image-visible' : 'about-image-hidden'"
        >
          <div class="flex gap-4 md:gap-6">
            <!-- Primary Image -->
            <div class="flex-[5]">
              <SmartImage
                :src="content?.primary_image"
                fallback-key="about"
                alt="SD Cinta Madani"
                aspect="4/5"
                rounded="var(--radius-lg)"
              />
            </div>

            <!-- Secondary Image -->
            <div class="flex-[7] self-end mb-0 md:translate-y-8">
              <SmartImage
                :src="content?.secondary_image"
                fallback-key="aboutSecondary"
                alt="Kegiatan belajar mengajar di SD Cinta Madani"
                aspect="1/1"
                rounded="var(--radius-lg)"
              />
            </div>
          </div>

          <!-- Floating year card -->
          <div
            class="absolute bottom-4 md:bottom-12 left-2 md:-left-4 z-20 glass rounded-2xl px-5 py-4 shadow-lg"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            style="transition: all 500ms var(--ease-out) 400ms"
          >
            <p class="text-editorial-number !text-2xl !leading-none">{{ content?.founded_year || '2020' }}</p>
            <p class="text-caption text-muted mt-1">Berdiri</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-text-hidden {
  opacity: 0;
  transform: translateX(-20px);
}
.about-text-visible {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
}
.about-image-hidden {
  opacity: 0;
  transform: translateX(20px);
}
.about-image-visible {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 700ms var(--ease-out) 100ms, transform 700ms var(--ease-out) 100ms;
}
</style>
