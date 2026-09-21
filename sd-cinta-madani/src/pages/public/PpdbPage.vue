<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { getActivePpdbPeriods } from "@/services/ppdb.service";
import { listPublishedUnits } from "@/services/units.service";
import type { PpdbPeriod } from "@/services/ppdb.service";
import type { EducationUnit } from "@/services/units.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "PPDB", description: "Informasi Penerimaan Peserta Didik Baru SD Cinta Madani." });

const periods = ref<PpdbPeriod[]>([]);
const units = ref<EducationUnit[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [p, u] = await Promise.all([getActivePpdbPeriods(), listPublishedUnits()]);
    periods.value = p;
    units.value = u;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);

function statusBadge(status: string) {
  switch (status) {
    case "open": return { label: "Dibuka", variant: "success" as const };
    case "coming_soon": return { label: "Segera", variant: "info" as const };
    default: return { label: "Ditutup", variant: "neutral" as const };
  }
}

function getUnitName(unitId: string) {
  return units.value.find(u => u.id === unitId)?.name || "";
}
</script>

<template>
  <div>
    <PageHeader title="PPDB" description="Informasi Penerimaan Peserta Didik Baru SD Cinta Madani." />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'PPDB' }]" />

        <div v-if="isLoading" class="animate-pulse flex flex-col gap-6">
          <div v-for="i in 3" :key="i" class="h-24 bg-surface-soft rounded-[16px]" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchData" />

        <EmptyState v-else-if="periods.length === 0" title="Informasi PPDB belum tersedia" description="Informasi pendaftaran akan segera diumumkan." />

        <div v-else class="flex flex-col gap-6">
          <div
            v-for="period in periods"
            :key="period.id"
            class="bg-white rounded-[16px] p-6 md:p-8 border border-line"
          >
            <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 class="text-h3 text-text-950">{{ period.title }}</h2>
                <p class="text-body text-muted">{{ getUnitName(period.unit_id) }} &middot; {{ period.academic_year }}</p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-small font-medium',
                  period.status === 'open' ? 'bg-surface-soft text-primary' :
                  period.status === 'coming_soon' ? 'bg-blue-100 text-blue-700' :
                  'bg-surface-soft text-text-950'
                ]"
              >
                {{ statusBadge(period.status).label }}
              </span>
            </div>
            <p class="text-body text-text-950 mb-4">{{ period.description }}</p>
            <div class="flex flex-wrap gap-3 text-small text-muted">
              <span v-if="period.start_date">Mulai: {{ new Date(period.start_date).toLocaleDateString('id-ID') }}</span>
              <span v-if="period.end_date">Berakhir: {{ new Date(period.end_date).toLocaleDateString('id-ID') }}</span>
            </div>
            <RouterLink
              v-if="period.status === 'open'"
              to="/ppdb/daftar"
              class="inline-flex items-center gap-2 mt-6 h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)] hover:bg-green-600 transition-colors"
            >
              Daftar Sekarang →
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
