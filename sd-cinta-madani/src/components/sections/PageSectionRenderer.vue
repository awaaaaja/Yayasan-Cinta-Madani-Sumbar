<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getPageByKey, getPageSections } from "@/services/pages.service";
import RichTextRenderer from "@/components/ui/RichTextRenderer.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import Icon from "@/components/ui/Icon.vue";
import type { PageSection } from "@/types";

const props = defineProps<{
  pageKey: string;
}>();

const sections = ref<PageSection[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const page = await getPageByKey(props.pageKey);
    if (page) {
      sections.value = await getPageSections(page.id);
    }
  } finally {
    isLoading.value = false;
  }
});

function getSection(key: string): PageSection | undefined {
  return sections.value.find((s) => s.section_key === key);
}

function c(key: string): Record<string, unknown> {
  return (getSection(key)?.content || {}) as Record<string, unknown>;
}

function has(key: string): boolean {
  return !!getSection(key) && Object.keys(c(key)).length > 0;
}

const heroKeys = ["about_hero", "program_hero", "news_hero", "gallery_hero", "agenda_hero"] as const;

const knownKeys = [
  "about_hero", "about_profile", "about_values", "about_history",
  "program_hero", "program_featured", "program_grid",
  "news_hero", "news_featured",
  "gallery_hero",
  "agenda_hero", "agenda_info",
];

const unmatchedSections = computed(() =>
  sections.value.filter((s) => !knownKeys.includes(s.section_key) && (s.title || s.description || s.content))
);
</script>

<template>
  <div v-if="isLoading" class="space-y-8">
    <div class="animate-pulse space-y-4">
      <div class="h-64 bg-surface-soft rounded-2xl" />
      <div class="h-4 bg-surface-soft rounded w-48" />
      <div class="h-8 bg-surface-soft rounded w-72" />
    </div>
  </div>

  <div v-else-if="sections.length === 0" />

  <template v-else>
    <!-- HERO sections -->
    <template v-for="heroKey in heroKeys" :key="heroKey">
      <div v-if="getSection(heroKey)">
        <div class="relative overflow-hidden rounded-2xl bg-primary-dark">
          <SmartImage
            v-if="(c(heroKey).image as string)"
            :src="c(heroKey).image as string"
            :alt="(c(heroKey).heading as string) || ''"
            aspect="21/9"
            class="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div class="relative z-10 px-8 py-16 md:px-16 md:py-24">
            <h1 class="text-h1 text-cream-100 max-w-2xl">
              {{ (c(heroKey).heading as string) || getSection(heroKey)?.title }}
            </h1>
            <p v-if="c(heroKey).description" class="text-body-lg text-cream-100/70 mt-4 max-w-xl">
              {{ c(heroKey).description }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- about_profile: 2-column image + text + stats -->
    <div v-if="has('about_profile')" class="section-pad">
      <div class="container-site">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <SmartImage
            v-if="(c('about_profile').image as string)"
            :src="c('about_profile').image as string"
            :alt="(c('about_profile').heading as string) || ''"
            aspect="4/5"
            class="rounded-2xl overflow-hidden shadow-sm"
          />
          <div>
            <h2 class="text-h2 text-text mb-4">
              {{ (c('about_profile').heading as string) || getSection('about_profile')?.title }}
            </h2>
            <div v-if="c('about_profile').description">
              <RichTextRenderer :html="c('about_profile').description as string" />
            </div>
            <div v-if="(c('about_profile').stats as {label:string;value:string}[])?.length" class="grid grid-cols-2 gap-4 mt-8">
              <div
                v-for="(stat, i) in c('about_profile').stats as {label:string;value:string}[]"
                :key="i"
                class="p-4 rounded-xl bg-surface"
              >
                <p class="text-h2 text-primary font-bold">{{ stat.value }}</p>
                <p class="text-small text-muted mt-1">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- about_values: grid of icon cards -->
    <div v-if="has('about_values') && (c('about_values').items as unknown[])?.length" class="section-pad bg-surface-soft/50">
      <div class="container-site">
        <h2 class="text-h2 text-text mb-2">
          {{ getSection('about_values')?.title || 'Nilai-Nilai Kami' }}
        </h2>
        <p v-if="getSection('about_values')?.description" class="text-body text-muted mb-8 max-w-xl">
          {{ getSection('about_values')?.description }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(item, i) in c('about_values').items as {icon:string;title:string;description:string}[]"
            :key="i"
            class="p-6 rounded-2xl bg-white border border-line-light hover:shadow-md transition-shadow duration-300"
          >
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon :name="item.icon" icon-class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-body-lg font-semibold text-text mb-2">{{ item.title }}</h3>
            <p class="text-small text-muted leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- about_history: timeline -->
    <div v-if="has('about_history') && (c('about_history').items as unknown[])?.length" class="section-pad">
      <div class="container-site">
        <h2 class="text-h2 text-text mb-2">
          {{ getSection('about_history')?.title || 'Sejarah' }}
        </h2>
        <p v-if="getSection('about_history')?.description" class="text-body text-muted mb-8 max-w-xl">
          {{ getSection('about_history')?.description }}
        </p>
        <div class="relative max-w-2xl">
          <div class="absolute left-4 top-0 bottom-0 w-px bg-line-light" />
          <div
            v-for="(item, i) in c('about_history').items as {year:string;title:string;description:string}[]"
            :key="i"
            class="relative pl-12 pb-8 last:pb-0"
          >
            <div class="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
            <p class="text-caption font-mono text-primary font-semibold">{{ item.year }}</p>
            <h3 class="text-body-lg font-semibold text-text mt-1">{{ item.title }}</h3>
            <p v-if="item.description" class="text-small text-muted mt-1 leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- program_featured / news_featured: highlight block -->
    <div v-if="has('program_featured') || has('news_featured')" class="section-pad">
      <div class="container-site">
        <template v-for="featKey in ['program_featured', 'news_featured']" :key="featKey">
          <div v-if="has(featKey)">
            <h2 class="text-h2 text-text mb-2">
              {{ getSection(featKey)?.title || 'Unggulan' }}
            </h2>
            <p v-if="getSection(featKey)?.description || c(featKey).description" class="text-body text-muted mb-8 max-w-xl">
              {{ (c(featKey).description as string) || getSection(featKey)?.description }}
            </p>
          </div>
        </template>
      </div>
    </div>

    <!-- agenda_info: stat blocks -->
    <div v-if="has('agenda_info') && (c('agenda_info').items as unknown[])?.length" class="section-pad">
      <div class="container-site">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(item, i) in c('agenda_info').items as {icon:string;label:string;value:string}[]"
            :key="i"
            class="p-5 rounded-2xl bg-surface border border-line-light text-center"
          >
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Icon :name="item.icon" icon-class="w-5 h-5 text-primary" />
            </div>
            <p class="text-h3 text-text font-bold">{{ item.value }}</p>
            <p class="text-caption text-muted mt-1">{{ item.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Generic fallback -->
    <template v-for="section in unmatchedSections" :key="section.id">
      <div class="section-pad">
        <div class="container-site max-w-3xl">
          <h2 v-if="section.title" class="text-h2 text-text mb-4">{{ section.title }}</h2>
          <p v-if="section.description" class="text-body text-muted mb-6">{{ section.description }}</p>
          <div v-if="(section.content as Record<string,unknown>)?.html">
            <RichTextRenderer :html="(section.content as Record<string,unknown>).html as string" />
          </div>
        </div>
      </div>
    </template>
  </template>
</template>
