<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel.vue";

interface ValueItem {
  number: string;
  title: string;
  description: string;
  image?: string;
}

const items = ref<ValueItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const activeIndex = ref<number | null>(null);

const { element: sectionEl, isVisible } = useScrollReveal();

const fallbackItems: ValueItem[] = [
  { number: "01", title: "Tauhid & Akhlak", description: "Menanamkan keimanan dan akhlak mulia sebagai fondasi utama pendidikan, membentuk pribadi yang bertakwa dan berbudi pekerti luhur." },
  { number: "02", title: "Ilmu & Keterampilan", description: "Memberikan pendidikan berkualitas yang menggabungkan ilmu pengetahuan modern dengan nilai-nilai Islam, mempersiapkan siswa menghadapi tantangan masa depan." },
  { number: "03", title: "Kemandirian", description: "Mendorong siswa untuk mandiri, kritis, dan percaya diri dalam menghadapi tantangan hidup dengan berlandaskan nilai-nilai keislaman." },
  { number: "04", title: "Kepedulian Lingkungan", description: "Menumbuhkan empati dan kepedulian terhadap sesama manusia, makhluk hidup, dan kelestarian lingkungan sebagai bentuk pengamalan iman." },
];

function toggle(index: number) {
  activeIndex.value = activeIndex.value === index ? null : index;
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const { getSectionContent } = await import("@/services/homepage.service");
    const content = await getSectionContent<{ items?: ValueItem[] }>("values");
    items.value = content?.items || fallbackItems;
  } catch {
    items.value = fallbackItems;
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <section
    id="nilai"
    :ref="(el) => { sectionEl = el as HTMLElement }"
    class="section-pad bg-background"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="max-w-[900px] mx-auto">
        <div class="animate-pulse flex flex-col gap-4">
          <div class="h-4 bg-surface-soft rounded w-24" />
          <div class="h-12 bg-surface-soft rounded w-48 mb-8" />
          <div v-for="i in 4" :key="i" class="h-20 bg-surface-soft rounded-[16px]" />
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
      <div v-else class="max-w-[900px] mx-auto">
        <div
          :style="{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 500ms var(--ease-out)',
          }"
        >
          <SectionLabel index="02" label="Nilai Kami" />
          <h2 class="text-h1 text-text mb-10 md:mb-14">Nilai yang Membimbing.</h2>
        </div>

        <!-- Desktop: Full-width accordion -->
        <div class="hidden md:flex flex-col gap-2">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="group rounded-[16px] overflow-hidden transition-all duration-400 cursor-pointer border"
            :class="activeIndex === index
              ? 'bg-primary border-primary shadow-lg'
              : 'bg-surface border-line-light hover:border-primary/20 hover:shadow-sm'"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `all 500ms var(--ease-out) ${200 + index * 80}ms`,
            }"
            @click="toggle(index)"
          >
            <!-- Header -->
            <div class="flex items-center gap-6 px-8 h-[80px]">
              <span
                class="text-h2 font-mono transition-colors duration-300"
                :class="activeIndex === index ? 'text-accent' : 'text-line'"
              >
                {{ item.number }}
              </span>
              <h3
                class="flex-1 text-h3 transition-colors duration-300"
                :class="activeIndex === index ? 'text-cream-100' : 'text-text'"
              >
                {{ item.title }}
              </h3>
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                :class="activeIndex === index ? 'bg-accent text-primary-dark rotate-180' : 'bg-surface-soft text-muted'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Expanded content -->
            <div
              class="overflow-hidden transition-all duration-500"
              :style="{ maxHeight: activeIndex === index ? '200px' : '0' }"
            >
              <div class="px-8 pb-8 pt-0 pl-[72px]">
                <p
                  class="text-body leading-relaxed transition-colors duration-300"
                  :class="activeIndex === index ? 'text-cream-100/80' : 'text-muted'"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Card accordion -->
        <div class="md:hidden flex flex-col gap-3">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="rounded-[16px] overflow-hidden transition-all duration-300 border"
            :class="activeIndex === index
              ? 'bg-primary border-primary shadow-lg'
              : 'bg-surface border-line-light'"
          >
            <button
              class="w-full flex items-center gap-4 px-5 py-4 text-left"
              :aria-expanded="activeIndex === index"
              @click="toggle(index)"
            >
              <span
                class="text-h3 font-mono transition-colors"
                :class="activeIndex === index ? 'text-accent' : 'text-line'"
              >
                {{ item.number }}
              </span>
              <span
                class="flex-1 text-h4 transition-colors"
                :class="activeIndex === index ? 'text-cream-100' : 'text-text'"
              >
                {{ item.title }}
              </span>
              <svg
                class="w-5 h-5 transition-transform duration-300 flex-shrink-0"
                :class="activeIndex === index ? 'text-accent rotate-180' : 'text-muted'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              class="overflow-hidden transition-all duration-400"
              :style="{ maxHeight: activeIndex === index ? '200px' : '0' }"
            >
              <div class="px-5 pb-5 pt-0">
                <p
                  class="text-small leading-relaxed transition-colors"
                  :class="activeIndex === index ? 'text-cream-100/80' : 'text-muted'"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
