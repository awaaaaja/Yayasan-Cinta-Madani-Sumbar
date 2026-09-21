<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { getSectionContent } from "@/services/homepage.service";
import SectionLabel from "@/components/ui/SectionLabel.vue";

interface ValueItem {
  number: string;
  title: string;
  description: string;
  image?: string;
}

interface ValuesContent {
  items?: ValueItem[];
  heading?: string;
  section_number?: string;
  section_label?: string;
}

const items = ref<ValueItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const activeIndex = ref<number | null>(null);
const heading = ref("Nilai yang Membimbing.");
const sectionNumber = ref("02");
const sectionLabel = ref("Nilai Kami");

const { element: sectionEl, isVisible } = useScrollReveal();

const fallbackItems: ValueItem[] = [
  { number: "01", title: "Iman & Takwa", description: "Menanamkan keimanan dan ketakwaan kepada Allah SWT sebagai fondasi karakter siswa sejak dini melalui pembelajaran agama dan praktik ibadah." },
  { number: "02", title: "Cerdas & Kreatif", description: "Mengembangkan potensi akademik siswa dengan metode pembelajaran inovatif yang mendorong rasa ingin tahu, berpikir kritis, dan kreativitas." },
  { number: "03", title: "Disiplin & Tanggung Jawab", description: "Membentuk siswa yang disiplin, bertanggung jawab, dan mandiri dalam menjalankan kewajiban sebagai pelajar dan anggota masyarakat." },
  { number: "04", title: "Peduli & Gotong Royong", description: "Menumbuhkan kepedulian terhadap sesama, lingkungan, dan semangat gotong royong sebagai bagian dari nilai-nilai luhur bangsa Indonesia." },
];

function toggle(index: number) {
  activeIndex.value = activeIndex.value === index ? null : index;
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const content = await getSectionContent<ValuesContent>("values");
    items.value = content?.items || fallbackItems;
    if (content?.heading) heading.value = content.heading;
    if (content?.section_number) sectionNumber.value = content.section_number;
    if (content?.section_label) sectionLabel.value = content.section_label;
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
          <div class="h-12 bg-surface-soft rounded w-48 mb-4" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="i in 4" :key="i" class="h-24 bg-surface-soft rounded-[16px]" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-body text-muted mb-4">{{ error }}</p>
        <button class="h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)]" @click="fetchData">
          Coba Lagi
        </button>
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
          <h2 class="text-h2 md:text-h1 text-text mb-4 md:mb-6">{{ heading }}</h2>
        </div>

        <!-- Desktop: 2-column grid -->
        <div class="hidden md:grid grid-cols-2 gap-3" role="list">
          <button
            v-for="(item, index) in items"
            :key="index"
            role="listitem"
            class="group rounded-[16px] overflow-hidden transition-all duration-400 cursor-pointer border text-left w-full"
            :class="activeIndex === index
              ? 'bg-primary border-primary shadow-lg'
              : 'bg-surface border-line-light hover:border-primary/20 hover:shadow-sm'"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `all 500ms var(--ease-out) ${200 + index * 80}ms`,
            }"
            :aria-expanded="activeIndex === index"
            :aria-label="`Nilai: ${item.title}`"
            @click="toggle(index)"
          >
            <!-- Header -->
            <div class="flex items-center gap-4 px-5 h-[56px]">
              <span
                class="text-h4 font-mono transition-colors duration-300"
                :class="activeIndex === index ? 'text-accent' : 'text-line'"
              >
                {{ item.number }}
              </span>
              <h3
                class="flex-1 text-body font-semibold transition-colors duration-300"
                :class="activeIndex === index ? 'text-cream-100' : 'text-text'"
              >
                {{ item.title }}
              </h3>
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                :class="activeIndex === index ? 'bg-accent text-primary-dark rotate-180' : 'bg-surface-soft text-muted'"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Expanded content -->
            <div
              class="overflow-hidden transition-all duration-400"
              :style="{ maxHeight: activeIndex === index ? '120px' : '0' }"
            >
              <div class="px-5 pb-4 pt-0 pl-[52px]">
                <p
                  class="text-small leading-relaxed transition-colors duration-300"
                  :class="activeIndex === index ? 'text-cream-100/80' : 'text-muted'"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>
          </button>
        </div>
        <div class="md:hidden flex flex-col gap-2">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="rounded-[12px] overflow-hidden transition-all duration-300 border"
            :class="activeIndex === index
              ? 'bg-primary border-primary shadow-lg'
              : 'bg-surface border-line-light'"
          >
            <button
              class="w-full flex items-center gap-3 px-4 py-3 text-left"
              :aria-expanded="activeIndex === index"
              @click="toggle(index)"
            >
              <span
                class="text-body-lg font-mono transition-colors"
                :class="activeIndex === index ? 'text-accent' : 'text-line'"
              >
                {{ item.number }}
              </span>
              <span
                class="flex-1 text-body font-semibold transition-colors"
                :class="activeIndex === index ? 'text-cream-100' : 'text-text'"
              >
                {{ item.title }}
              </span>
              <svg
                class="w-4 h-4 transition-transform duration-300 flex-shrink-0"
                :class="activeIndex === index ? 'text-accent rotate-180' : 'text-muted'"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              class="overflow-hidden transition-all duration-400"
              :style="{ maxHeight: activeIndex === index ? '120px' : '0' }"
            >
              <div class="px-4 pb-4 pt-0">
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
