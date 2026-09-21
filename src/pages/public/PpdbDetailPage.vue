<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { getPpdbByUnitSlug, getPpdbRequirements, getPpdbFaqs } from "@/services/ppdb.service";
import { getUnitBySlug } from "@/services/units.service";
import type { PpdbPeriod, PpdbRequirement, PpdbFaq } from "@/services/ppdb.service";
import type { EducationUnit } from "@/services/units.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "PPDB" });

const route = useRoute();
const router = useRouter();
const unit = ref<EducationUnit | null>(null);
const period = ref<PpdbPeriod | null>(null);
const requirements = ref<PpdbRequirement[]>([]);
const faqs = ref<PpdbFaq[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const slug = route.params.unitSlug as string;
    const u = await getUnitBySlug(slug);
    if (!u) {       router.replace({ name: "not-found" }); return; }
    unit.value = u;
    document.title = `PPDB ${u.name} | Yayasan Cinta Madani`;
    usePageHead({ title: `PPDB ${u.name}`, description: `Informasi pendaftaran ${u.name} Yayasan Cinta Madani.` });
    const p = await getPpdbByUnitSlug(slug);
    period.value = p;
    if (p) {
      const [reqs, f] = await Promise.all([getPpdbRequirements(p.id), getPpdbFaqs(p.id)]);
      requirements.value = reqs;
      faqs.value = f;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
watch(() => route.params.unitSlug, fetchData);

function statusBadge(status: string) {
  switch (status) {
    case "open": return { label: "Dibuka", cls: "bg-surface-soft text-primary" };
    case "coming_soon": return { label: "Segera", cls: "bg-blue-100 text-blue-700" };
    default: return { label: "Ditutup", cls: "bg-surface-soft text-text-950" };
  }
}
</script>

<template>
  <div>
    <PageHeader
      :title="`PPDB ${unit?.name || ''}`"
      :description="`Informasi pendaftaran ${unit?.name || ''}.`"
    />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb
          v-if="unit"
          :items="[
            { label: 'PPDB', href: '/ppdb' },
            { label: unit.name }
          ]"
        />

        <div v-if="isLoading" class="animate-pulse flex flex-col gap-6">
          <div class="h-24 bg-surface-soft rounded-[16px]" />
          <div class="h-48 bg-surface-soft rounded-[16px]" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchData" />

        <EmptyState v-else-if="!period" title="Informasi PPDB belum tersedia" />

        <div v-else class="max-w-[760px] flex flex-col gap-8">
          <!-- Status -->
          <div class="bg-white rounded-[16px] p-6 md:p-8 border border-line">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 class="text-h3 text-text-950">{{ period.title }}</h2>
              <span :class="['px-3 py-1 rounded-full text-small font-medium', statusBadge(period.status).cls]">
                {{ statusBadge(period.status).label }}
              </span>
            </div>
            <p class="text-body text-text-950">{{ period.description }}</p>
            <a
              v-if="period.registration_url && period.status === 'open'"
              :href="period.registration_url"
              target="_blank"
              class="inline-flex items-center gap-2 mt-6 h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)] hover:bg-green-600 transition-colors"
            >
              Daftar Sekarang &rarr;
            </a>
          </div>

          <!-- Requirements -->
          <div v-if="requirements.length > 0">
            <h3 class="text-h3 text-text-950 mb-4">Persyaratan</h3>
            <ol class="list-decimal list-inside flex flex-col gap-3">
              <li v-for="req in requirements" :key="req.id" class="text-body text-text-950">
                <span class="font-semibold text-text-950">{{ req.title }}</span>
                <span v-if="req.description">: {{ req.description }}</span>
              </li>
            </ol>
          </div>

          <!-- FAQs -->
          <div v-if="faqs.length > 0">
            <h3 class="text-h3 text-text-950 mb-4">FAQ</h3>
            <div class="flex flex-col gap-4">
              <details
                v-for="faq in faqs"
                :key="faq.id"
                class="bg-white rounded-[16px] border border-line overflow-hidden group"
              >
                <summary class="flex items-center justify-between p-5 cursor-pointer text-body font-semibold text-text-950 hover:bg-cream-100/50 transition-colors">
                  {{ faq.question }}
                  <span class="text-primary text-h4 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div class="px-5 pb-5 text-body text-text-950">
                  {{ faq.answer }}
                </div>
              </details>
            </div>
          </div>

          <!-- Contact -->
          <div v-if="period.contact_name || period.contact_phone" class="bg-cream-100 rounded-[16px] p-6">
            <h3 class="text-h4 text-text-950 mb-2">Kontak Panitia</h3>
            <p v-if="period.contact_name" class="text-body text-text-950">{{ period.contact_name }}</p>
            <p v-if="period.contact_phone" class="text-body text-text-950">{{ period.contact_phone }}</p>
            <p v-if="period.contact_email" class="text-body text-text-950">{{ period.contact_email }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
