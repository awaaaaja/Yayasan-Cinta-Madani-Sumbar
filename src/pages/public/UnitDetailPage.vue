<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import { getUnitBySlug } from "@/services/units.service";
import type { EducationUnit } from "@/services/units.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Unit Pendidikan" });

const route = useRoute();
const router = useRouter();
const unit = ref<EducationUnit | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchUnit() {
  isLoading.value = true;
  error.value = null;
  unit.value = null;
  try {
    const slug = route.params.slug as string;
    const data = await getUnitBySlug(slug);
    if (!data) {
      router.replace({ name: "not-found" });
      return;
    }
    unit.value = data;
    usePageHead({ title: data.name, description: data.short_description || undefined });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchUnit);
watch(() => route.params.slug, fetchUnit);
</script>

<template>
  <div>
    <PageHeader
      v-if="unit"
      :title="unit.name"
      :description="unit.short_description"
      :image="unit.hero_image_url"
    />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb
          v-if="unit"
          :items="[
            { label: 'Unit Pendidikan', href: '/unit-pendidikan' },
            { label: unit.name }
          ]"
        />

        <!-- Loading -->
        <div v-if="isLoading" class="animate-pulse flex flex-col gap-6">
          <div class="h-4 bg-surface-soft rounded w-1/3" />
          <div class="h-32 bg-surface-soft rounded w-full" />
          <div class="h-4 bg-surface-soft rounded w-2/3" />
        </div>

        <!-- Error -->
        <ErrorState
          v-else-if="error"
          :message="error"
          :on-retry="fetchUnit"
        />

        <!-- Empty -->
        <EmptyState
          v-else-if="!unit"
          title="Unit tidak ditemukan"
          description="Unit pendidikan yang Anda cari tidak tersedia."
        />

        <!-- Content -->
        <div v-else class="max-w-[760px]">
          <h2 class="text-h3 text-text-950 mb-6">Profil Unit</h2>
          <p class="text-body text-text-950 mb-8">{{ unit.description }}</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-if="unit.address" class="flex items-start gap-3">
              <span class="text-primary mt-1">&#9679;</span>
              <div>
                <p class="text-small font-semibold text-text-950">Alamat</p>
                <p class="text-body text-text-950">{{ unit.address }}</p>
              </div>
            </div>
            <div v-if="unit.phone" class="flex items-start gap-3">
              <span class="text-primary mt-1">&#9679;</span>
              <div>
                <p class="text-small font-semibold text-text-950">Telepon</p>
                <p class="text-body text-text-950">{{ unit.phone }}</p>
              </div>
            </div>
            <div v-if="unit.email" class="flex items-start gap-3">
              <span class="text-primary mt-1">&#9679;</span>
              <div>
                <p class="text-small font-semibold text-text-950">Email</p>
                <p class="text-body text-text-950">{{ unit.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
