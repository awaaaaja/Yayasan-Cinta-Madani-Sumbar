<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import Icon from "@/components/ui/Icon.vue";
import { listFacilities } from "@/services/facilities.service";
import type { Facility } from "@/services/facilities.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({
  title: "Fasilitas",
  description: "Fasilitas SD Cinta Madani yang mendukung proses belajar mengajar dan pengembangan potensi siswa.",
});

const facilities = ref<Facility[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    facilities.value = await listFacilities();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);

const breadcrumbs = [
  { label: "Beranda", to: "/" },
  { label: "Fasilitas" },
];
</script>

<template>
  <div>
    <PageHeader
      title="Fasilitas"
      description="Fasilitas modern yang mendukung proses belajar mengajar dan pengembangan potensi setiap siswa."
    />

    <div class="container-site py-12 md:py-16">
      <Breadcrumb :items="breadcrumbs" class="mb-8 md:mb-12" />

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="rounded-[20px] overflow-hidden bg-surface">
          <Skeleton class="aspect-[4/3] w-full" />
          <div class="p-6">
            <Skeleton class="h-5 w-32 mb-2" />
            <Skeleton class="h-4 w-full" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <ErrorState v-else-if="error" :message="error" @retry="fetchData" />

      <!-- Empty -->
      <EmptyState v-else-if="facilities.length === 0" message="Belum ada data fasilitas." />

      <!-- Content -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <article
          v-for="item in facilities"
          :key="item.id"
          class="group rounded-[20px] overflow-hidden bg-surface shadow-sm hover:shadow-md transition-shadow duration-500"
        >
          <div v-if="item.image_url" class="aspect-[4/3] overflow-hidden">
            <SmartImage
              :src="item.image_url"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div class="p-6">
            <div v-if="item.icon" class="mb-2"><Icon :name="item.icon" icon-class="w-6 h-6 text-primary" /></div>
            <h3 class="text-body font-semibold text-text mb-2">{{ item.name }}</h3>
            <p v-if="item.description" class="text-small text-muted line-clamp-3">
              {{ item.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
