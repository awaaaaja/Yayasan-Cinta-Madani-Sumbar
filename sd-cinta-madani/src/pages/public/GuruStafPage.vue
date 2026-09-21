<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import { listStaff } from "@/services/staff.service";
import type { Staff } from "@/types";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({
  title: "Guru & Staf",
  description: "Kenali guru dan staf pengajar SD Cinta Madani yang berdedikasi untuk pendidikan terbaik anak Anda.",
});

const staff = ref<Staff[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    staff.value = await listStaff();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);

const breadcrumbs = [
  { label: "Beranda", to: "/" },
  { label: "Guru & Staf" },
];
</script>

<template>
  <div>
    <PageHeader
      title="Guru & Staf"
      description="SD Cinta Madani memiliki tenaga pengajar dan staf yang berdedikasi, profesional, dan mencintai anak."
    />

    <div class="container-site py-12 md:py-16">
      <Breadcrumb :items="breadcrumbs" class="mb-8 md:mb-12" />

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="text-center">
          <Skeleton class="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4" />
          <Skeleton class="h-5 w-28 mx-auto mb-2" />
          <Skeleton class="h-4 w-20 mx-auto" />
        </div>
      </div>

      <!-- Error -->
      <ErrorState v-else-if="error" :message="error" @retry="fetchData" />

      <!-- Empty -->
      <EmptyState v-else-if="staff.length === 0" message="Belum ada data guru & staf." />

      <!-- Content -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        <article
          v-for="person in staff"
          :key="person.id"
          class="group text-center"
        >
          <div class="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full overflow-hidden bg-sand">
            <SmartImage
              :src="person.photo_url"
              :alt="person.full_name"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="text-body font-semibold text-text group-hover:text-primary transition-colors duration-300">
            {{ person.full_name }}
          </h3>
          <p class="text-small text-muted mt-1">{{ person.position }}</p>
          <p v-if="person.bio" class="text-small text-muted mt-2 line-clamp-2 hidden md:block">
            {{ person.bio }}
          </p>
        </article>
      </div>
    </div>
  </div>
</template>
