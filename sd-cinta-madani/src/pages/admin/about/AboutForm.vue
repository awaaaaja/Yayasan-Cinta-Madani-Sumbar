<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAboutSection, updateAboutSection } from '@/services/admin/about.admin.service';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import { useErrorToast } from '@/composables/useErrorToast';
import type { AboutContent } from '@/types';

const router = useRouter();
const saving = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);
const { showError } = useErrorToast();

const form = ref<AboutContent>({
  eyebrow: '01',
  heading: '',
  description: '',
  primary_image: '',
  secondary_image: '',
  cta_label: '',
  cta_url: '',
});

async function fetchData() {
  loading.value = true;
  try {
    const data = await getAboutSection();
    if (data) {
      form.value = {
        eyebrow: data.content.eyebrow || '01',
        heading: data.content.heading || '',
        description: data.content.description || '',
        primary_image: data.content.primary_image || '',
        secondary_image: data.content.secondary_image || '',
        cta_label: data.content.cta_label || '',
        cta_url: data.content.cta_url || '',
      };
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Gagal memuat data';
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  saving.value = true;
  error.value = null;
  try {
    await updateAboutSection(form.value);
    router.push('/admin/pages');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Gagal menyimpan';
    showError(error.value);
  } finally {
    saving.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">Edit Section Tentang</h1>
      <p class="mt-1 text-small text-[var(--color-moss)]">Kelola konten section "Tentang Yayasan" di homepage.</p>
    </div>

    <div v-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{{ error }}</div>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6 rounded-xl border border-[var(--color-sand)] bg-white p-6">
      <!-- Eyebrow -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Nomor Urut</label>
        <input v-model="form.eyebrow" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="01" />
      </div>

      <!-- Heading -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Judul</label>
        <input v-model="form.heading" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Pendidikan yang Membumi dan Menyentuh Hati." />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Deskripsi</label>
        <textarea v-model="form.description" rows="4" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Deskripsi singkat tentang yayasan..." />
      </div>

      <!-- Primary Image -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-2">Gambar Utama (Kiri)</label>
        <p class="text-xs text-[var(--color-moss)] mb-2">Foto utama yang ditampilkan di sisi kiri section.</p>
        <MediaPicker
          :model-value="form.primary_image ?? ''"
          bucket="site-assets"
          folder="about"
          @remove="form.primary_image = ''"
        />
      </div>

      <!-- Secondary Image -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-2">Gambar Kegiatan (Kanan)</label>
        <p class="text-xs text-[var(--color-moss)] mb-2">Foto kegiatan yayasan yang ditampilkan di sisi kanan section.</p>
        <MediaPicker
          :model-value="form.secondary_image ?? ''"
          bucket="site-assets"
          folder="about"
          @remove="form.secondary_image = ''"
        />
      </div>

      <!-- CTA -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">CTA Label</label>
          <input v-model="form.cta_label" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Baca Profil Yayasan" />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">CTA URL</label>
          <input v-model="form.cta_url" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="/tentang" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-4 border-t border-[var(--color-sand)]">
        <button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50">
          <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
        <button type="button" class="rounded-lg border border-[var(--color-sand)] px-5 py-2.5 text-sm font-medium text-[var(--color-bark)] hover:bg-[var(--color-cream)]" @click="router.push('/admin/pages')">
          Batal
        </button>
      </div>
    </form>
  </div>
</template>
