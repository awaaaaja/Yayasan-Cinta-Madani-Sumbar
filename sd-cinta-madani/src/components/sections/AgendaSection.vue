<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useScrollReveal } from "@/composables/useScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel.vue";
import ArrowLink from "@/components/ui/ArrowLink.vue";
import { getSectionContent } from "@/services/homepage.service";
import type { Event } from "@/services/events.service";

interface AgendaContent {
  heading?: string;
  section_number?: string;
  section_label?: string;
}

const events = ref<Event[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const heading = ref("Agenda Mendatang.");
const sectionNumber = ref("09");
const sectionLabel = ref("Agenda");

const { element: sectionEl, isVisible } = useScrollReveal();

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase();
  return { day: String(day), month };
}

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [eventsResult, sectionContent] = await Promise.all([
      import("@/services/events.service").then(m => m.listUpcomingEvents({ limit: 5 })),
      getSectionContent<AgendaContent>("agenda"),
    ]);
    events.value = eventsResult.items;
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
    id="agenda"
    class="section-pad bg-background"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-4 bg-surface-soft rounded w-16 mb-4" />
        <div class="h-14 bg-surface-soft rounded w-40 mb-12" />
        <div class="flex flex-col gap-4">
          <div v-for="i in 4" :key="i" class="h-20 bg-surface-soft rounded-[16px]" />
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
      <div v-else-if="events.length === 0" class="text-center py-16">
        <p class="text-body text-muted">Belum ada agenda mendatang.</p>
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
            <ArrowLink to="/agenda" label="Lihat Semua" class="hidden md:flex" />
          </div>
        </div>

        <!-- Editorial timeline list -->
        <div class="flex flex-col">
          <RouterLink
            v-for="(event, index) in events"
            :key="event.id"
            :to="`/agenda/${event.slug}`"
            class="group flex items-center gap-6 md:gap-8 py-5 md:py-6 border-b border-line-light last:border-b-0 hover:bg-surface-soft/50 -mx-4 px-4 rounded-[12px] transition-colors duration-300"
            :style="{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-12px)',
              transition: `all 400ms var(--ease-out) ${100 + index * 60}ms`,
            }"
          >
            <!-- Date block -->
            <div class="flex-shrink-0 w-14 md:w-16 text-center">
              <span class="block text-h2 text-primary leading-none">
                {{ formatEventDate(event.event_date).day }}
              </span>
              <span class="block text-caption text-muted font-semibold mt-1">
                {{ formatEventDate(event.event_date).month }}
              </span>
            </div>

            <!-- Vertical divider -->
            <div class="w-px h-10 bg-line-light flex-shrink-0" />

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="text-h4 text-text group-hover:text-primary transition-colors duration-300 truncate">
                {{ event.title }}
              </h3>
              <p v-if="event.location" class="text-small text-muted mt-1 truncate">
                {{ event.location }}
              </p>
            </div>

            <!-- Arrow -->
            <svg
              class="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </RouterLink>
        </div>

        <div class="mt-8 md:hidden">
          <ArrowLink to="/agenda" label="Lihat Semua" />
        </div>
      </div>
    </div>
  </section>
</template>
