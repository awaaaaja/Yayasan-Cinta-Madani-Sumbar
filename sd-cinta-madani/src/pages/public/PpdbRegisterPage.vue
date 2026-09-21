<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import PpdbWizard from "@/components/forms/PpdbWizard.vue";
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";
import { getActivePpdbPeriods } from "@/services/ppdb.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({
  title: "Daftar PPDB",
  description: "Formulir pendaftaran PPDB SD Cinta Madani secara online.",
});

const router = useRouter();
const store = usePpdbWizardStore();

const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchPeriod() {
  isLoading.value = true;
  error.value = null;
  try {
    const periods = await getActivePpdbPeriods();
    const open = periods.find((p) => p.status === "open") || periods[0];
    if (open) {
      store.periodId = open.id;
    } else {
      error.value = "PPDB saat ini belum dibuka.";
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchPeriod);

onUnmounted(() => {
  // Reset store when leaving the page
  if (!store.registrationNumber) {
    store.reset();
  }
});

async function handleSubmit() {
  const ok = await store.submitRegistration();
  if (ok) {
    router.push({ name: "ppdb-success", query: { reg: store.registrationNumber } });
  }
}

const breadcrumbs = [
  { label: "Beranda", to: "/" },
  { label: "PPDB", to: "/ppdb" },
  { label: "Daftar" },
];
</script>

<template>
  <div>
    <PageHeader title="Daftar PPDB" description="Isi formulir pendaftaran secara online. Semua field bertanda * wajib diisi." />

    <div class="container-site py-12 md:py-16">
      <Breadcrumb :items="breadcrumbs" class="mb-8 md:mb-12" />

      <div v-if="isLoading" class="max-w-2xl mx-auto">
        <Skeleton class="h-8 w-48 mb-4" />
        <Skeleton class="h-4 w-full mb-8" />
        <Skeleton class="h-64 w-full rounded-[16px]" />
      </div>

      <ErrorState v-else-if="error" :message="error" @retry="fetchPeriod" />

      <div v-else class="max-w-2xl mx-auto">
        <PpdbWizard @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>
