<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import { listUpcomingEvents } from "@/services/events.service";
import type { Event } from "@/services/events.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Agenda", description: "Agenda kegiatan mendatang Yayasan Cinta Madani." });

const events = ref<Event[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchEvents() {
  isLoading.value = true;
  error.value = null;
  try {
    events.value = await listUpcomingEvents({ limit: 20 });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
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
    <PageHeader title="Agenda" description="Kegiatan dan acara mendatang dari Yayasan Cinta Madani." />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Agenda' }]" />

        <div v-if="isLoading" class="flex flex-col gap-4">
          <Skeleton v-for="i in 5" :key="i" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchEvents" />

        <EmptyState v-else-if="events.length === 0" title="Belum ada agenda" description="Agenda kegiatan akan segera tersedia." />

        <div v-else class="flex flex-col">
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
      </div>
    </section>
  </div>
</template>
