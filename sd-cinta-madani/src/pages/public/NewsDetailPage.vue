<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import { getNewsBySlug, getRelatedNews } from "@/services/news.service";
import type { News, NewsCategory } from "@/services/news.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Berita" });

const route = useRoute();
const router = useRouter();
const news = ref<(News & { category: NewsCategory | null }) | null>(null);
const related = ref<News[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchNews() {
  isLoading.value = true;
  error.value = null;
  news.value = null;
  related.value = [];
  try {
    const slug = route.params.slug as string;
    const data = await getNewsBySlug(slug);
    if (!data) {
      router.replace({ name: "not-found" });
      return;
    }
    news.value = data;
    usePageHead({ title: data.title, description: data.excerpt || undefined });
    related.value = await getRelatedNews(data.id);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchNews);
watch(() => route.params.slug, fetchNews);
</script>

<template>
  <div>
    <!-- Hero via PageHeader -->
    <div v-if="isLoading" class="bg-primary-dark min-h-[280px] md:min-h-[340px] flex items-end">
      <div class="container-site w-full py-12 md:py-16 lg:py-20 animate-pulse">
        <div class="h-4 bg-white/10 rounded w-24 mb-3" />
        <div class="h-10 bg-white/10 rounded w-3/4 mb-3" />
        <div class="h-4 bg-white/10 rounded w-1/3" />
      </div>
    </div>
    <PageHeader
      v-else-if="news"
      :title="news.title"
      :description="news.published_at ? new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined"
      :image="news.cover_image_url || undefined"
      :eyebrow="news.category?.name || 'Berita'"
    />

    <section class="section-pad bg-background">
      <div class="container-site">
        <Breadcrumb
          v-if="news"
          :items="[
            { label: 'Berita', href: '/berita' },
            { label: news.title }
          ]"
        />

        <ErrorState v-if="error" :message="error" :on-retry="fetchNews" />
        <EmptyState v-else-if="!isLoading && !news" title="Berita tidak ditemukan" />

        <div v-else-if="news" class="max-w-[760px]">
          <p class="text-body-lg text-text-950 whitespace-pre-line leading-relaxed">{{ news.excerpt }}</p>
        </div>

        <!-- Related News -->
        <div v-if="related.length > 0" class="mt-16 pt-12 border-t border-line">
          <h2 class="text-h3 text-text mb-8">Berita Terkait</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RouterLink
              v-for="item in related"
              :key="item.id"
              :to="`/berita/${item.slug}`"
              class="group block bg-surface rounded-[16px] overflow-hidden border border-line-light hover:border-primary/20 hover:shadow-sm transition-all duration-300"
            >
              <SmartImage
                :src="item.cover_image_url"
                :alt="item.title"
                aspect="16/9"
                :hover-scale="true"
              />
              <div class="p-5">
                <h3 class="text-h4 text-text group-hover:text-primary transition-colors duration-300 line-clamp-2">{{ item.title }}</h3>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
