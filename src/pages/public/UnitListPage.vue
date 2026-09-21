<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { listPublishedUnits } from "@/services/units.service";
import type { EducationUnit } from "@/services/units.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Unit Pendidikan", description: "Unit pendidikan di bawah naungan Yayasan Cinta Madani." });

const units = ref<EducationUnit[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchUnits() {
  isLoading.value = true;
  error.value = null;
  try {
    units.value = await listPublishedUnits();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchUnits);
</script>

<template>
  <div>
    <PageHeader
      title="Unit Pendidikan"
      description="Mengenal unit-unit pendidikan di bawah Yayasan Cinta Madani."
    />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Unit Pendidikan' }]" />

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton v-for="i in 6" :key="i" :count="1" />
        </div>

        <!-- Error -->
        <ErrorState
          v-else-if="error"
          :message="error"
          :on-retry="fetchUnits"
        />

        <!-- Empty -->
        <EmptyState
          v-else-if="units.length === 0"
          title="Belum ada unit pendidikan"
          description="Unit pendidikan akan segera tersedia."
        />

        <!-- Content -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="unit in units"
            :key="unit.id"
            :to="`/unit-pendidikan/${unit.slug}`"
            class="group block bg-white rounded-[16px] overflow-hidden border border-line hover:border-green-700/30 transition-all duration-[var(--motion-fast)]"
          >
            <div class="aspect-[16/9] bg-surface-soft overflow-hidden">
              <img
                v-if="unit.hero_image_url"
                :src="unit.hero_image_url"
                :alt="unit.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[var(--motion-slow)]"
                loading="lazy"
              />
            </div>
            <div class="p-6">
              <h2 class="text-h4 text-text-950 mb-2">{{ unit.name }}</h2>
              <p class="text-body text-muted line-clamp-2">{{ unit.short_description }}</p>
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
