<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormField from '@/components/admin/FormField.vue';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import { getSettings, updateSettings } from '@/services/admin/settings.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { SiteSettings } from '@/types';

document.title = 'Pengaturan Situs';

const defaultSocial = { instagram: '', facebook: '', youtube: '', tiktok: '' };
const form = ref<Partial<SiteSettings>>({ social_links: { ...defaultSocial } });
const loading = ref(true);
const saving = ref(false);
const saveError = ref('');

const { errors, validate, clearErrors } = useFormValidation({
  school_name: [required('Nama Sekolah')],
});
const { showError } = useErrorToast();

onMounted(async () => {
  try {
    const data = await getSettings();
    form.value = { ...data, social_links: { ...defaultSocial, ...(data.social_links || {}) } };
  } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
});

async function handleSave() {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    await updateSettings(form.value);
  } catch (e) { saveError.value = 'Gagal menyimpan pengaturan. Silakan coba lagi.'; } finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <h1 class="text-2xl font-bold text-[var(--color-bark)]">Pengaturan Situs</h1>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ saveError }}</div>
      <div class="space-y-6">
        <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6 space-y-4">
          <h2 class="text-lg font-semibold text-[var(--color-bark)]">Identitas</h2>
          <FormField label="Nama Sekolah" required :error="errors.school_name">
            <input v-model="form.school_name" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </FormField>
          <FormField label="Tagline">
            <input v-model="form.tagline" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </FormField>
          <FormField label="Deskripsi">
            <textarea v-model="form.description" rows="3" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </FormField>
        </div>

        <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6 space-y-4">
          <h2 class="text-lg font-semibold text-[var(--color-bark)]">Logo & Ikon</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-small font-semibold text-[var(--color-bark)]">Logo Utama</label>
              <MediaPicker :model-value="form.logo_url || ''" @update:model-value="form.logo_url = $event" bucket="site-assets" folder="logos" />
            </div>
            <div class="space-y-2">
              <label class="block text-small font-semibold text-[var(--color-bark)]">Favicon</label>
              <MediaPicker :model-value="form.favicon_url || ''" @update:model-value="form.favicon_url = $event" bucket="site-assets" folder="logos" />
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6 space-y-4">
          <h2 class="text-lg font-semibold text-[var(--color-bark)]">Kontak</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Email">
              <input v-model="form.email" type="email" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="Telepon">
              <input v-model="form.phone" type="tel" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="WhatsApp">
              <input v-model="form.whatsapp" type="tel" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="URL Google Maps">
              <input v-model="form.maps_url" type="url" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
          </div>
          <FormField label="Alamat">
            <textarea v-model="form.address" rows="2" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </FormField>
        </div>

        <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6 space-y-4">
          <h2 class="text-lg font-semibold text-[var(--color-bark)]">Media Sosial</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Instagram">
              <input v-model="form.social_links!.instagram" type="url" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="https://instagram.com/..." />
            </FormField>
            <FormField label="Facebook">
              <input v-model="form.social_links!.facebook" type="url" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="https://facebook.com/..." />
            </FormField>
            <FormField label="YouTube">
              <input v-model="form.social_links!.youtube" type="url" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="https://youtube.com/..." />
            </FormField>
            <FormField label="TikTok">
              <input v-model="form.social_links!.tiktok" type="url" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="https://tiktok.com/..." />
            </FormField>
          </div>
        </div>
      </div>
    </template>

    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-sand)] bg-white shadow-lg">
      <div class="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-3">
        <button :disabled="saving" class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="handleSave">
          {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
        </button>
      </div>
    </div>
  </div>
</template>
