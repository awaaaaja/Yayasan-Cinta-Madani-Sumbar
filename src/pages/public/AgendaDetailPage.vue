<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import { getEventBySlug } from "@/services/events.service";
import type { Event } from "@/services/events.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Agenda" });

const route = useRoute();
const router = useRouter();
const event = ref<Event | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchEvent() {
  isLoading.value = true;
  error.value = null;
  event.value = null;
  try {
    const slug = route.params.slug as string;
    const data = await getEventBySlug(slug);
    if (!data) {
      router.replace({ name: "not-found" });
      return;
    }
    event.value = data;
    usePageHead({ title: data.title, description: data.description?.substring(0, 160) || undefined });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchEvent);
watch(() => route.params.slug, fetchEvent);

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
    <div v-if="isLoading" class="bg-primary-dark min-h-[280px] md:min-h-[340px] flex items-end">
      <div class="container-site w-full py-12 md:py-16 lg:py-20 animate-pulse">
        <div class="h-4 bg-white/10 rounded w-24 mb-3" />
        <div class="h-10 bg-white/10 rounded w-3/4" />
      </div>
    </div>
    <PageHeader
      v-else-if="event"
      :title="event.title"
      :description="formatDate(event.event_date) + (event.location ? ` · ${event.location}` : '')"
      :image="event.cover_image_url || undefined"
      eyebrow="Agenda"
    />

    <section class="section-pad bg-background">
      <div class="container-site">
        <Breadcrumb v-if="event" :items="[{ label: 'Agenda', href: '/agenda' }, { label: event.title }]" />

        <ErrorState v-if="error" :message="error" :on-retry="fetchEvent" />
        <EmptyState v-else-if="!isLoading && !event" title="Agenda tidak ditemukan" />

        <div v-else-if="event" class="max-w-[760px]">
          <p class="text-body-lg text-text-950 whitespace-pre-line leading-relaxed">{{ event.description }}</p>
          <a
            v-if="event.registration_url"
            :href="event.registration_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 mt-8 min-h-[44px] px-6 bg-accent text-forest-950 text-sm font-semibold rounded-[var(--radius-sm)] transition-all duration-300 hover:bg-accent-light hover:shadow-md"
          >
            Daftar Sekarang
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
