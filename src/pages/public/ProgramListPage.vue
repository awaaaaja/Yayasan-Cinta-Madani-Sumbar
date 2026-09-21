<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import { listPublishedPrograms } from "@/services/programs.service";
import type { Program } from "@/services/programs.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Program", description: "Program unggulan Yayasan Cinta Madani." });

const programs = ref<Program[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchPrograms() {
  isLoading.value = true;
  error.value = null;
  try {
    programs.value = await listPublishedPrograms();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchPrograms);
</script>

<template>
  <div>
    <PageHeader
      title="Program"
      description="Program-program unggulan Yayasan Cinta Madani."
    />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Program' }]" />

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton v-for="i in 4" :key="i" :count="1" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchPrograms" />

        <EmptyState
          v-else-if="programs.length === 0"
          title="Belum ada program"
          description="Program akan segera tersedia."
        />

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </section>
  </div>
</template>
