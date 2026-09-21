<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { imagePlaceholders } from "@/config/images";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import type { EducationUnit } from "@/services/units.service";

const units = ref<EducationUnit[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const { element: sectionEl, isVisible } = useScrollReveal();

function getUnitImage(unit: EducationUnit): keyof typeof imagePlaceholders {
  const slug = unit.slug?.toLowerCase() || "";
  if (slug.includes("tk")) return "unitTK";
  if (slug.includes("sd")) return "unitSD";
  if (slug.includes("smp")) return "unitSMP";
  if (slug.includes("sma")) return "unitSMA";
  return "fallback";
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const { listPublishedUnits } = await import("@/services/units.service");
    units.value = (await listPublishedUnits()) as EducationUnit[];
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
    id="unit-pendidikan"
    :ref="(el) => { sectionEl = el as HTMLElement }"
    class="section-pad-lg bg-cream-50"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-4 bg-sand rounded w-32 mb-4" />
        <div class="h-14 bg-sand rounded w-64 mb-12" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="h-72 bg-sand rounded-[20px]" />
          <div class="h-72 bg-sand rounded-[20px]" />
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
      <div v-else-if="units.length === 0" class="text-center py-16">
        <p class="text-body text-muted">Belum ada unit pendidikan.</p>
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
          <SectionLabel index="03" label="Unit Pendidikan" />
          <div class="flex items-end justify-between mb-10 md:mb-14">
            <h2 class="text-h1 text-text">Pendidikan untuk Semua Usia.</h2>
            <ArrowLink to="/unit-pendidikan" label="Semua Unit" class="hidden md:flex" />
          </div>
        </div>

        <!-- Featured Unit (first) -->
        <RouterLink
          v-if="units[0]"
          :to="`/unit-pendidikan/${units[0].slug}`"
          class="group block mb-6"
          :style="{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 600ms var(--ease-out) 100ms',
          }"
        >
          <div class="relative rounded-[20px] overflow-hidden bg-surface shadow-sm hover:shadow-lg transition-shadow duration-500">
            <div class="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <SmartImage
                :src="units[0].hero_image_url"
                :fallback-key="getUnitImage(units[0])"
                :alt="units[0].name"
                aspect="21/9"
                :hover-scale="true"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/20 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span class="text-eyebrow text-accent-light mb-2 block">{{ units[0].short_description ? 'Unit' : 'Pendidikan' }}</span>
              <h3 class="text-h2 text-cream-100 mb-2">{{ units[0].name }}</h3>
              <p v-if="units[0].short_description" class="text-body text-cream-100/70 max-w-[480px]">
                {{ units[0].short_description }}
              </p>
              <span class="inline-flex items-center gap-2 text-cream-100 font-semibold mt-4 group-hover:translate-x-1 transition-transform duration-300">
                Selengkapnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- Other Units Grid -->
        <div v-if="units.length > 1" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="(unit, i) in units.slice(1)"
            :key="unit.id"
            :to="`/unit-pendidikan/${unit.slug}`"
            class="group"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 500ms var(--ease-out) ${200 + i * 80}ms`,
            }"
          >
            <div class="rounded-[20px] overflow-hidden bg-surface shadow-sm hover:shadow-md transition-all duration-500 h-full flex flex-col">
              <div class="aspect-[4/3] overflow-hidden">
                <SmartImage
                  :src="unit.hero_image_url"
                  :fallback-key="getUnitImage(unit)"
                  :alt="unit.name"
                  aspect="4/3"
                  :hover-scale="true"
                />
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <h4 class="text-h3 text-text mb-2 group-hover:text-primary transition-colors duration-300">
                  {{ unit.name }}
                </h4>
                <p v-if="unit.short_description" class="text-body text-muted line-clamp-2 flex-1">
                  {{ unit.short_description }}
                </p>
                <span class="inline-flex items-center gap-2 text-primary font-semibold text-sm mt-4 group-hover:gap-3 transition-all duration-300">
                  Selengkapnya
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Mobile: see all link -->
        <div class="mt-8 md:hidden">
          <ArrowLink to="/unit-pendidikan" label="Semua Unit" />
        </div>
      </div>
    </div>
  </section>
</template>
