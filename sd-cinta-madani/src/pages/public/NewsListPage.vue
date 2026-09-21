<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import PageSectionRenderer from "@/components/sections/PageSectionRenderer.vue";
import { listPublishedNews, listNewsCategories } from "@/services/news.service";
import type { NewsCategory } from "@/services/news.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Berita", description: "Berita terkini seputar kegiatan dan perkembangan SD Cinta Madani." });

type NewsWithCategory = { id: string; unit_id: string | null; category_id: string | null; title: string; slug: string; excerpt: string | null; content: unknown; cover_image_url: string | null; status: string; featured: boolean; author_id: string; published_at: string | null; scheduled_at: string | null; seo_title: string | null; seo_description: string | null; og_image_url: string | null; created_at: string; updated_at: string; category: NewsCategory | null };

const route = useRoute();
const items = ref<NewsWithCategory[]>([]);
const categories = ref<NewsCategory[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);
const limit = 9;

const categorySlug = computed(() => route.params.slug as string | undefined);
const featuredItems = computed(() => items.value.filter(i => i.featured));
const regularItems = computed(() => items.value.filter(i => !i.featured));

async function fetchNews() {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await listPublishedNews({
      page: currentPage.value,
      limit,
      categorySlug: categorySlug.value,
    });
    items.value = result.items;
    totalPages.value = result.totalPages;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

async function fetchCategories() {
  try {
    categories.value = await listNewsCategories();
  } catch { /* silent */ }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchNews();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  fetchCategories();
  fetchNews();
});
</script>

<template>
  <div>
    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Berita' }]" class="mb-8" />

        <PageSectionRenderer page-key="berita" />

        <!-- Category Filter -->
        <div v-if="categories.length > 0" class="flex flex-wrap gap-2 mb-8 mt-8">
          <RouterLink
            to="/berita"
            :class="[
              'px-4 py-2 rounded-full text-small font-medium transition-colors duration-[var(--motion-fast)]',
              !categorySlug ? 'bg-primary text-white' : 'bg-surface-soft text-text-950 hover:bg-surface-soft'
            ]"
          >
            Semua
          </RouterLink>
          <RouterLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/berita/kategori/${cat.slug}`"
            :class="[
              'px-4 py-2 rounded-full text-small font-medium transition-colors duration-[var(--motion-fast)]',
              categorySlug === cat.slug ? 'bg-primary text-white' : 'bg-surface-soft text-text-950 hover:bg-surface-soft'
            ]"
          >
            {{ cat.name }}
          </RouterLink>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton v-for="i in 6" :key="i" :count="1" />
        </div>

        <!-- Error -->
        <ErrorState v-else-if="error" :message="error" :on-retry="fetchNews" />

        <!-- Empty -->
        <EmptyState v-else-if="items.length === 0" title="Belum ada berita" description="Berita akan segera tersedia." />

        <!-- Content -->
        <div v-else>
          <!-- Featured News -->
          <div v-if="featuredItems.length > 0" class="mb-8">
            <RouterLink
              :to="`/berita/${featuredItems[0].slug}`"
              class="group block bg-white rounded-[16px] overflow-hidden border border-line hover:border-green-700/30 transition-all duration-[var(--motion-fast)]"
            >
              <div class="grid md:grid-cols-2 gap-0">
                <div class="aspect-[16/9] md:aspect-auto bg-surface-soft overflow-hidden">
                  <img
                    v-if="featuredItems[0].cover_image_url"
                    :src="featuredItems[0].cover_image_url"
                    :alt="featuredItems[0].title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[var(--motion-slow)]"
                    loading="lazy"
                  />
                </div>
                <div class="p-6 md:p-8 flex flex-col justify-center">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">Unggulan</span>
                    <span v-if="featuredItems[0].category" class="text-small text-primary font-medium">
                      {{ featuredItems[0].category.name }}
                    </span>
                  </div>
                  <h2 class="text-h3 text-text-950 mb-3 group-hover:text-primary transition-colors">{{ featuredItems[0].title }}</h2>
                  <p class="text-body text-muted line-clamp-3 mb-4">{{ featuredItems[0].excerpt }}</p>
                  <span class="inline-flex items-center gap-2 text-primary font-semibold text-body group-hover:gap-3 transition-all duration-[var(--motion-fast)]">
                    Baca selengkapnya &rarr;
                  </span>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Regular News Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouterLink
              v-for="item in (featuredItems.length > 0 ? regularItems : items)"
              :key="item.id"
              :to="`/berita/${item.slug}`"
              class="group block bg-white rounded-[16px] overflow-hidden border border-line hover:border-green-700/30 transition-all duration-[var(--motion-fast)]"
            >
              <div class="aspect-[16/9] bg-surface-soft overflow-hidden">
                <img
                  v-if="item.cover_image_url"
                  :src="item.cover_image_url"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[var(--motion-slow)]"
                  loading="lazy"
                />
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 mb-2">
                  <span v-if="item.category" class="text-small text-primary font-medium">
                    {{ item.category.name }}
                  </span>
                  <span v-if="item.published_at" class="text-small text-muted">
                    {{ new Date(item.published_at).toLocaleDateString('id-ID') }}
                  </span>
                </div>
                <h2 class="text-h4 text-text-950 mb-2 line-clamp-2">{{ item.title }}</h2>
                <p class="text-body text-muted line-clamp-2">{{ item.excerpt }}</p>
              </div>
            </RouterLink>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-12">
            <button
              :disabled="currentPage <= 1"
              class="h-10 px-4 rounded-[var(--radius-sm)] text-small font-medium border border-line disabled:opacity-40 hover:bg-surface-soft transition-colors"
              @click="goToPage(currentPage - 1)"
            >
              &laquo; Sebelumnya
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              :class="[
                'h-10 w-10 rounded-[var(--radius-sm)] text-small font-medium transition-colors',
                page === currentPage ? 'bg-primary text-white' : 'border border-line hover:bg-surface-soft'
              ]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage >= totalPages"
              class="h-10 px-4 rounded-[var(--radius-sm)] text-small font-medium border border-line disabled:opacity-40 hover:bg-surface-soft transition-colors"
              @click="goToPage(currentPage + 1)"
            >
              Selanjutnya &raquo;
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
