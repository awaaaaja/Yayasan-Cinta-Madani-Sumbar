<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import { listPublishedNews, listNewsCategories } from "@/services/news.service";
import type { NewsCategory } from "@/services/news.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Berita", description: "Berita terkini seputar kegiatan dan perkembangan Yayasan Cinta Madani." });

type NewsWithCategory = { id: string; unit_id: string | null; category_id: string | null; title: string; slug: string; excerpt: string; content: unknown; cover_image_url: string; status: string; featured: boolean; author_id: string; published_at: string | null; scheduled_at: string | null; seo_title: string; seo_description: string; og_image_url: string; created_at: string; updated_at: string; category: NewsCategory | null };

const route = useRoute();
const items = ref<NewsWithCategory[]>([]);
const categories = ref<NewsCategory[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(true);
const error = ref<string | null>(null);
const limit = 9;

const categorySlug = computed(() => route.params.slug as string | undefined);
const pageTitle = computed(() => {
  if (categorySlug.value) {
    const cat = categories.value.find(c => c.slug === categorySlug.value);
    return cat ? `Berita: ${cat.name}` : "Berita";
  }
  return "Berita";
});

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
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

async function fetchCategories() {
  try {
    categories.value = await listNewsCategories();
  } catch {
    // silent — non-critical
  }
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
    <PageHeader :title="pageTitle" description="Informasi dan kabar terkini dari Yayasan Cinta Madani." />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Berita' }]" />

        <!-- Category Filter -->
        <div v-if="categories.length > 0" class="flex flex-wrap gap-2 mb-8">
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
        <EmptyState
          v-else-if="items.length === 0"
          title="Belum ada berita"
          description="Berita akan segera tersedia."
        />

        <!-- Content -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouterLink
              v-for="item in items"
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
