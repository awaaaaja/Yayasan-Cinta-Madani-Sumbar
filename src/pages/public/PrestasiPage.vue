<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorState from "@/components/common/ErrorState.vue";
import Skeleton from "@/components/common/Skeleton.vue";
import SmartImage from "@/components/ui/SmartImage.vue";
import { listAchievements } from "@/services/achievements.service";
import type { Achievement } from "@/services/achievements.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Prestasi", description: "Prestasi siswa dan Unit Pendidikan Yayasan Cinta Madani." });

const achievements = ref<Achievement[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchAchievements() {
  isLoading.value = true;
  error.value = null;
  try {
    achievements.value = await listAchievements();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Gagal memuat data";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchAchievements);
</script>

<template>
  <div>
    <PageHeader title="Prestasi" description="Pencapaian dan penghargaan yang diraih oleh siswa dan institusi." />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Prestasi' }]" />

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton v-for="i in 4" :key="i" :count="1" />
        </div>

        <ErrorState v-else-if="error" :message="error" :on-retry="fetchAchievements" />

        <EmptyState v-else-if="achievements.length === 0" title="Belum ada prestasi" description="Prestasi akan ditampilkan jika sudah tersedia." />

        <!-- Story format — bukan statistik angka -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="item in achievements"
            :key="item.id"
            class="flex gap-6 bg-white rounded-[16px] p-6 border border-line"
          >
            <SmartImage
              v-if="item.image_url"
              :src="item.image_url"
              :alt="item.title"
              class="w-20 h-20 shrink-0"
              rounded="var(--radius-sm)"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-small text-primary font-medium">{{ item.year }}</span>
                <span v-if="item.level" class="text-small text-muted">&middot; {{ item.level }}</span>
              </div>
              <h2 class="text-h4 text-text-950 mb-1">{{ item.title }}</h2>
              <p class="text-body text-muted">{{ item.student_or_team }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
