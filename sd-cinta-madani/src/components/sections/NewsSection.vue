<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { formatDate } from "@/utils/format";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import { getSectionContent } from "@/services/homepage.service";
import type { News, NewsCategory } from "@/services/news.service";

interface NewsSectionContent {
  heading?: string;
  section_number?: string;
  section_label?: string;
}

const news = ref<(News & { category: NewsCategory | null })[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const heading = ref("Berita Terkini.");
const sectionNumber = ref("08");
const sectionLabel = ref("Berita");

const { element: sectionEl, isVisible } = useScrollReveal();

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [newsResult, sectionContent] = await Promise.all([
      import("@/services/news.service").then(m => m.listPublishedNews({ limit: 4 })),
      getSectionContent<NewsSectionContent>("news"),
    ]);
    news.value = newsResult.items as (News & { category: NewsCategory | null })[];
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
    id="berita"
    class="section-pad bg-surface"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-4 bg-surface-soft rounded w-16 mb-4" />
        <div class="h-14 bg-surface-soft rounded w-40 mb-12" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="aspect-[16/9] bg-surface-soft rounded-[20px]" />
          <div class="flex flex-col gap-4">
            <div v-for="i in 3" :key="i" class="h-28 bg-surface-soft rounded-[16px]" />
          </div>
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
      <div v-else-if="news.length === 0" class="text-center py-16">
        <p class="text-body text-muted">Belum ada berita tersedia.</p>
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
            <ArrowLink to="/berita" label="Lihat Semua" class="hidden md:flex" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Featured news -->
          <RouterLink
            v-if="news[0]"
            :to="`/berita/${news[0].slug}`"
            class="group rounded-[16px] overflow-hidden bg-cream-50 hover:shadow-md transition-shadow duration-500"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 600ms var(--ease-out) 100ms',
            }"
          >
            <div class="aspect-[16/9] overflow-hidden">
              <SmartImage
                :src="news[0].cover_image_url"
                :fallback-key="'news1'"
                :alt="news[0].title"
                aspect="16/9"
                :hover-scale="true"
              />
            </div>
            <div class="p-6 md:p-8">
              <div class="flex items-center gap-3 mb-3">
                <span
                  v-if="news[0].category"
                  class="text-caption font-semibold text-primary bg-primary/5 px-3 py-1 rounded-full"
                >
                  {{ news[0].category.name }}
                </span>
                <span v-if="news[0].published_at" class="text-small text-muted">
                  {{ formatDate(news[0].published_at) }}
                </span>
              </div>
              <h3 class="text-h3 text-text group-hover:text-primary transition-colors duration-300 mb-3">
                {{ news[0].title }}
              </h3>
              <p v-if="news[0].excerpt" class="text-body text-muted line-clamp-2">
                {{ news[0].excerpt }}
              </p>
            </div>
          </RouterLink>

          <!-- Supporting news -->
          <div class="flex flex-col gap-4">
            <RouterLink
              v-for="(item, index) in news.slice(1, 4)"
              :key="item.id"
              :to="`/berita/${item.slug}`"
              class="group flex gap-4 bg-cream-50 rounded-[16px] p-4 hover:shadow-sm transition-all duration-400"
              :style="{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `all 500ms var(--ease-out) ${150 + index * 80}ms`,
              }"
            >
              <div class="w-24 h-24 md:w-28 md:h-20 flex-shrink-0 rounded-[12px] overflow-hidden">
                <SmartImage
                  :src="item.cover_image_url"
                  :fallback-key="'news2'"
                  :alt="item.title"
                  aspect="1/1"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span v-if="item.category" class="text-caption font-semibold text-primary">
                    {{ item.category.name }}
                  </span>
                </div>
                <h4 class="text-small font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                  {{ item.title }}
                </h4>
                <span v-if="item.published_at" class="text-caption text-muted mt-1 block">
                  {{ formatDate(item.published_at) }}
                </span>
              </div>
            </RouterLink>

            <RouterLink to="/berita" class="md:hidden mt-2">
              <ArrowLink label="Lihat Semua" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
