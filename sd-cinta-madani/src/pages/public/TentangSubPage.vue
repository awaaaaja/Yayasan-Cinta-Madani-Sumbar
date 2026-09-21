<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { getPageBySlug, getPageSections } from "@/services/pages.service";
import type { Page } from "@/services/pages.service";
import type { PageSection } from "@/types";
import { usePageHead } from "@/composables/usePageHead";

const route = useRoute();
const page = ref<Page | null>(null);
const sections = ref<PageSection[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const subPages: Record<string, { title: string; description: string; slug: string; breadcrumb: string }> = {
  profil: { title: "Profil", description: "Mengenal Yayasan Cinta Madani lebih dekat.", slug: "tentang-profil", breadcrumb: "Profil" },
  sejarah: { title: "Sejarah", description: "Perjalanan dan tonggak penting yayasan.", slug: "tentang-sejarah", breadcrumb: "Sejarah" },
  "visi-misi": { title: "Visi & Misi", description: "Arah dan tujuan pendidikan kami.", slug: "tentang-visi-misi", breadcrumb: "Visi & Misi" },
  nilai: { title: "Nilai", description: "Prinsip yang menjadi fondasi setiap kegiatan.", slug: "tentang-nilai", breadcrumb: "Nilai" },
  pengurus: { title: "Pengurus", description: "Tim yang menjalankan visi yayasan.", slug: "tentang-pengurus", breadcrumb: "Pengurus" },
};

async function fetchPage() {
  isLoading.value = true;
  error.value = null;
  try {
    const slug = route.params.sub as string;
    const meta = subPages[slug];
    if (!meta) {
      error.value = "Halaman tidak ditemukan";
      return;
    }
    page.value = await getPageBySlug(meta.slug);
    if (page.value) {
      sections.value = await getPageSections(page.value.id);
      usePageHead({ title: meta.title, description: page.value.description || meta.description });
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchPage);
watch(() => route.params.sub, fetchPage);
</script>

<template>
  <div>
    <PageHeader
      v-if="page"
      :title="page.title"
      :description="page.description"
    />
    <PageHeader
      v-else-if="!isLoading && subPages[route.params.sub as string]"
      :title="subPages[route.params.sub as string].title"
      :description="subPages[route.params.sub as string].description"
    />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb
          :items="[
            { label: 'Tentang', href: '/tentang' },
            { label: subPages[route.params.sub as string]?.breadcrumb || String(route.params.sub) }
          ]"
        />

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
          <div v-for="section in sections" :key="section.id" class="mt-8">
            <h2 v-if="section.title" class="text-h3 text-text-950 mb-4">{{ section.title }}</h2>
            <p v-if="section.description" class="text-body text-text-950">{{ section.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
