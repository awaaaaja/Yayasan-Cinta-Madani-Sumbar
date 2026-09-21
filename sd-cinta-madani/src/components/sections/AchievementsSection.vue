<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import { getSectionContent } from "@/services/homepage.service";
import type { Achievement } from "@/services/achievements.service";

interface AchievementsContent {
  heading?: string;
  section_number?: string;
  section_label?: string;
}

const achievements = ref<Achievement[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const heading = ref("Prestasi Siswa.");
const sectionNumber = ref("06");
const sectionLabel = ref("Prestasi");

const { element: sectionEl, isVisible } = useScrollReveal();

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [achievementsResult, sectionContent] = await Promise.all([
      import("@/services/achievements.service").then(m => m.listAchievements({ featuredOnly: true })),
      getSectionContent<AchievementsContent>("achievements"),
    ]);
    achievements.value = achievementsResult.slice(0, 4);
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
    id="prestasi"
    class="section-pad bg-background"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-4 bg-surface-soft rounded w-24 mb-4" />
        <div class="h-14 bg-surface-soft rounded w-56 mb-12" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div v-for="i in 4" :key="i" class="h-32 bg-surface-soft rounded-[16px]" />
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
      <div v-else-if="achievements.length === 0" class="text-center py-16">
        <p class="text-body text-muted">Prestasi akan segera ditampilkan.</p>
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
            <ArrowLink to="/prestasi" label="Semua Prestasi" class="hidden md:flex" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="(item, index) in achievements"
            :key="item.id"
            class="flex gap-5 bg-surface rounded-[16px] p-5 md:p-6 border border-line-light hover:shadow-sm hover:border-primary/10 transition-all duration-400 group"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `all 500ms var(--ease-out) ${index * 80}ms`,
            }"
          >
            <!-- Image/Badge -->
            <div class="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-[12px] overflow-hidden bg-surface-soft">
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-xl md:text-2xl">
                🏆
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="text-h4 text-text group-hover:text-primary transition-colors duration-300 mb-1">
                {{ item.title }}
              </h3>
              <p v-if="item.description" class="text-small text-muted line-clamp-2 mb-2">
                {{ item.description }}
              </p>
              <div class="flex items-center gap-2 text-caption text-muted">
                <span v-if="item.year" class="font-semibold text-primary">{{ item.year }}</span>
                <span v-if="item.level" class="text-line">·</span>
                <span v-if="item.level">{{ item.level }}</span>
                <span v-if="item.student_or_team" class="text-line">·</span>
                <span v-if="item.student_or_team">{{ item.student_or_team }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 md:hidden">
          <ArrowLink to="/prestasi" label="Semua Prestasi" />
        </div>
      </div>
    </div>
  </section>
</template>
