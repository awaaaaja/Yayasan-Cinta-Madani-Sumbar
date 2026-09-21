<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { imagePlaceholders } from "@/config/images";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import Icon from "@/components/ui/Icon.vue";
import { getSectionContent } from "@/services/homepage.service";
import type { Program } from "@/services/programs.service";

interface ProgramsContent {
  heading?: string;
  section_number?: string;
  section_label?: string;
}

const programs = ref<Program[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const heading = ref("Program Unggulan.");
const sectionNumber = ref("04");
const sectionLabel = ref("Program Unggulan");

const { element: sectionEl, isVisible } = useScrollReveal();

const programImages: Record<string, keyof typeof imagePlaceholders> = {
  tahfidz: "programTahfidz",
  stem: "programSTEM",
  robotika: "programSTEM",
  bahasa: "programLanguage",
  arab: "programLanguage",
  inggris: "programLanguage",
  leadership: "programLeadership",
  kepemudaan: "programLeadership",
};

function getProgramImage(program: Program): keyof typeof imagePlaceholders {
  const slug = program.slug?.toLowerCase() || "";
  for (const [key, img] of Object.entries(programImages)) {
    if (slug.includes(key)) return img;
  }
  return "fallback";
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [programsResult, sectionContent] = await Promise.all([
      import("@/services/programs.service").then(m => m.listPublishedPrograms({ limit: 6 })),
      getSectionContent<ProgramsContent>("programs"),
    ]);
    programs.value = programsResult.items;
    if (sectionContent?.heading) heading.value = sectionContent.heading;
    if (sectionContent?.section_number) sectionNumber.value = sectionContent.section_number;
    if (sectionContent?.section_label) sectionLabel.value = sectionContent.section_label;
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
    id="program"
    class="section-pad bg-surface-soft"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-4 bg-sand rounded w-20 mb-4" />
        <div class="h-14 bg-sand rounded w-56 mb-12" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" class="h-56 bg-sand rounded-[20px]" />
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
      <div v-else-if="programs.length === 0" class="text-center py-16">
        <p class="text-body text-muted">Belum ada program tersedia.</p>
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
            <ArrowLink to="/program" label="Semua Program" class="hidden md:flex" />
          </div>
        </div>

        <!-- Desktop: Bento Grid -->
        <div class="hidden md:grid grid-cols-2 gap-5">
          <RouterLink
            v-for="(program, index) in programs.slice(0, 4)"
            :key="program.id"
            :to="`/program/${program.slug}`"
            class="group relative rounded-[20px] overflow-hidden"
            :class="index === 0 ? 'row-span-2' : ''"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 600ms var(--ease-out) ${100 + index * 100}ms`,
            }"
          >
            <!-- Background image -->
            <div class="absolute inset-0">
              <SmartImage
                :src="program.image_url"
                :fallback-key="getProgramImage(program)"
                :alt="program.title"
                :aspect="index === 0 ? '3/4' : '16/9'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/30 to-primary-dark/10 group-hover:from-primary-dark/90 transition-all duration-500" />
            </div>

            <!-- Content -->
            <div class="relative z-10 h-full flex flex-col justify-end p-8" :class="index === 0 ? 'min-h-[400px]' : 'min-h-[240px]'">
              <span v-if="program.icon" class="text-3xl mb-3"><Icon :name="program.icon" icon-class="w-8 h-8 text-accent" /></span>
              <h3 class="text-h3 text-cream-100 mb-2">{{ program.title }}</h3>
              <p v-if="program.excerpt" class="text-body text-cream-100/70 line-clamp-2 max-w-[360px]">
                {{ program.excerpt }}
              </p>
              <span class="inline-flex items-center gap-2 text-accent font-semibold mt-4 group-hover:gap-3 transition-all duration-300">
                Selengkapnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </RouterLink>
        </div>

        <!-- Mobile: Stacked cards -->
        <div class="md:hidden flex flex-col gap-4">
          <RouterLink
            v-for="(program, index) in programs"
            :key="program.id"
            :to="`/program/${program.slug}`"
            class="group relative rounded-[16px] overflow-hidden"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `all 400ms var(--ease-out) ${index * 60}ms`,
            }"
          >
            <div class="relative h-44">
              <SmartImage
                :src="program.image_url"
                :fallback-key="getProgramImage(program)"
                :alt="program.title"
                aspect="16/9"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <span v-if="program.icon" class="text-xl mb-1 block"><Icon :name="program.icon" icon-class="w-5 h-5 text-accent" /></span>
                <h4 class="text-h4 text-cream-100 text-base">{{ program.title }}</h4>
              </div>
            </div>
          </RouterLink>

          <RouterLink to="/program" class="mt-2">
            <ArrowLink label="Semua Program" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
