<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { getProgramBySlug } from "@/services/programs.service";
import type { Program } from "@/services/programs.service";
import { usePageHead } from "@/composables/usePageHead";

const route = useRoute();
const router = useRouter();
const program = ref<Program | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

usePageHead({ title: "Program" });

async function fetchProgram() {
  isLoading.value = true;
  error.value = null;
  program.value = null;
  try {
    const slug = route.params.slug as string;
    const data = await getProgramBySlug(slug);
    if (!data) {
      router.replace({ name: "not-found" });
      return;
    }
    program.value = data;
    usePageHead({ title: data.title, description: data.excerpt || undefined });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchProgram);
watch(() => route.params.slug, fetchProgram);
</script>

<template>
  <div>
    <PageHeader
      v-if="program"
      :title="program.title"
      :description="program.excerpt"
      :image="program.image_url"
    />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb
          v-if="program"
          :items="[
            { label: 'Program', href: '/program' },
            { label: program.title }
          ]"
        />

        <div v-if="isLoading" class="animate-pulse flex flex-col gap-4">
          <div class="h-4 bg-surface-soft rounded w-1/3" />
          <div class="h-32 bg-surface-soft rounded w-full" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchProgram" />

        <EmptyState v-else-if="!program" title="Program tidak ditemukan" />

        <div v-else class="max-w-[760px]">
          <h2 class="text-h3 text-text-950 mb-4">Tentang Program</h2>
          <p class="text-body text-text-950">{{ program.excerpt }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
