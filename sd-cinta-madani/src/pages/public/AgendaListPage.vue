<script setup lang="ts">
import { ref, onMounted } from "vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import PageSectionRenderer from "@/components/sections/PageSectionRenderer.vue";
import { listUpcomingEvents } from "@/services/events.service";
import type { Event } from "@/services/events.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Agenda", description: "Agenda kegiatan mendatang SD Cinta Madani." });

const events = ref<Event[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = 10;

async function fetchEvents() {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await listUpcomingEvents({ page: currentPage.value, limit });
    events.value = result.items;
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
  fetchEvents();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(fetchEvents);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <div>
    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Agenda' }]" class="mb-8" />

        <PageSectionRenderer page-key="agenda" />

        <div v-if="isLoading" class="flex flex-col gap-4 mt-8">
          <Skeleton v-for="i in 5" :key="i" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchEvents" />

        <EmptyState v-else-if="events.length === 0" title="Belum ada agenda" description="Agenda kegiatan akan segera tersedia." />

        <div v-else>
          <p class="text-small text-muted mb-4 mt-8">{{ total }} agenda mendatang</p>
          <div class="flex flex-col">
            <RouterLink
              v-for="event in events"
              :key="event.id"
              :to="`/agenda/${event.slug}`"
              class="group flex flex-col md:flex-row md:items-center gap-4 py-6 border-b border-line hover:bg-cream-100/50 transition-colors px-4 -mx-4 rounded-[var(--radius-sm)]"
            >
              <div class="md:w-32 shrink-0">
                <p class="text-h3 text-primary">{{ new Date(event.event_date).getDate() }}</p>
                <p class="text-small text-muted">{{ formatDate(event.event_date).split(' ').slice(1).join(' ') }}</p>
              </div>
              <div class="flex-1">
                <h2 class="text-h4 text-text-950 mb-1 group-hover:text-primary transition-colors">{{ event.title }}</h2>
                <p v-if="event.location" class="text-small text-muted">{{ event.location }}</p>
              </div>
              <span class="text-primary font-semibold text-body group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
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
