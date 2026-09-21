<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { getPageBySlug } from "@/services/pages.service";
import type { Page } from "@/services/pages.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Tentang", description: "Mengenal nilai, perjalanan, dan tujuan Yayasan Cinta Madani." });

const page = ref<Page | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchPage() {
  isLoading.value = true;
  error.value = null;
  try {
    page.value = await getPageBySlug("tentang");
    if (page.value) usePageHead({ title: page.value.title, description: page.value.description || undefined });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchPage);
</script>

<template>
  <div>
    <PageHeader
      v-if="page"
      :title="page.title"
      :description="page.description"
    />
    <PageHeader
      v-else-if="!isLoading"
      title="Tentang Yayasan"
      description="Mengenal nilai, perjalanan, dan tujuan Yayasan Cinta Madani."
    />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Tentang' }]" />

        <!-- Loading -->
        <div v-if="isLoading" class="animate-pulse flex flex-col gap-4">
          <div class="h-4 bg-surface-soft rounded w-1/3" />
          <div class="h-4 bg-surface-soft rounded w-2/3" />
          <div class="h-4 bg-surface-soft rounded w-1/2" />
        </div>

        <!-- Error -->
        <ErrorState
          v-else-if="error"
          :message="error"
          :on-retry="fetchPage"
        />

        <!-- Empty -->
        <EmptyState
          v-else-if="!page"
          title="Halaman belum tersedia"
          description="Konten halaman ini sedang dalam persiapan."
        />

        <!-- Content -->
        <div v-else class="prose max-w-none">
          <p class="text-body text-text-950">{{ page.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
