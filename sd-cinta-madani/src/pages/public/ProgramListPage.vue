<script setup lang="ts">
import { ref, onMounted } from "vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import PageSectionRenderer from "@/components/sections/PageSectionRenderer.vue";
import { listPublishedPrograms } from "@/services/programs.service";
import type { Program } from "@/services/programs.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Program", description: "Program unggulan SD Cinta Madani." });

const programs = ref<Program[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = 12;

async function fetchPrograms() {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await listPublishedPrograms({ page: currentPage.value, limit });
    programs.value = result.items;
    totalPages.value = result.totalPages;
    total.value = result.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchPrograms();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(fetchPrograms);
</script>

<template>
  <div>
    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Program' }]" class="mb-8" />

        <PageSectionRenderer page-key="program" />

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Skeleton v-for="i in 4" :key="i" :count="1" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchPrograms" />

        <EmptyState v-else-if="programs.length === 0" title="Belum ada program" description="Program akan segera tersedia." />

        <div v-else>
          <p class="text-small text-muted mb-4 mt-8">{{ total }} program</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RouterLink
              v-for="program in programs"
              :key="program.id"
              :to="`/program/${program.slug}`"
              class="group block bg-white rounded-[16px] overflow-hidden border border-line hover:border-green-700/30 transition-all duration-[var(--motion-fast)]"
            >
              <div class="aspect-[16/9] bg-surface-soft overflow-hidden">
                <img
                  v-if="program.image_url"
                  :src="program.image_url"
                  :alt="program.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[var(--motion-slow)]"
                  loading="lazy"
                />
              </div>
              <div class="p-6">
                <h2 class="text-h4 text-text-950 mb-2">{{ program.title }}</h2>
                <p class="text-body text-muted line-clamp-2">{{ program.excerpt }}</p>
                <span class="inline-flex items-center gap-2 mt-4 text-primary font-semibold text-body group-hover:gap-3 transition-all duration-[var(--motion-fast)]">
                  Selengkapnya &rarr;
                </span>
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
