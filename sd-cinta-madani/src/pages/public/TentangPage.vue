<script setup lang="ts">
import { ref, onMounted } from "vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import PageSectionRenderer from "@/components/sections/PageSectionRenderer.vue";
import { getPageBySlug } from "@/services/pages.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Tentang", description: "Mengenal nilai, perjalanan, dan tujuan SD Cinta Madani." });

const hasPage = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function checkPage() {
  isLoading.value = true;
  error.value = null;
  try {
    const page = await getPageBySlug("tentang");
    hasPage.value = !!page;
    if (page) usePageHead({ title: page.title, description: page.description || undefined });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(checkPage);
</script>

<template>
  <div>
    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Tentang' }]" class="mb-8" />

        <ErrorState v-if="error" :message="error" :on-retry="checkPage" />
        <EmptyState v-else-if="!isLoading && !hasPage" title="Halaman belum tersedia" description="Konten halaman ini sedang dalam persiapan." />
        <PageSectionRenderer v-else-if="hasPage" page-key="tentang" />
      </div>
    </section>
  </div>
</template>
