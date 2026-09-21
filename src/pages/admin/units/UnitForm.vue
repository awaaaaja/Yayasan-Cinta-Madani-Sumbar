<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import SlugInput from '@/components/admin/SlugInput.vue';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import RichTextEditor from '@/components/admin/RichTextEditor.vue';
import SeoFields from '@/components/admin/SeoFields.vue';
import SaveBar from '@/components/admin/SaveBar.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getUnitById, createUnit, updateUnit, deleteUnit, publishUnit, archiveUnit } from '@/services/admin/units.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { EducationUnit } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Unit' : 'Tambah Unit';

const form = ref<Partial<EducationUnit>>({
  name: '',
  slug: '',
  short_description: '',
  description: '',
  logo_url: null,
  hero_image_url: null,
  address: '',
  phone: '',
  email: '',
  maps_url: '',
  sort_order: 0,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  og_image_url: '',
});

const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);
const originalStatus = ref('draft');

const { errors, validate, clearErrors } = useFormValidation({ name: [required('Nama')], slug: [required('Slug')] });
const { showError } = useErrorToast();
const saveError = ref('');

const seoValue = computed({
  get: () => ({
    title: form.value.seo_title || '',
    description: form.value.seo_description || '',
    ogImage: form.value.og_image_url || '',
  }),
  set: (val) => {
    form.value.seo_title = val.title;
    form.value.seo_description = val.description;
    form.value.og_image_url = val.ogImage;
  },
});

const hasUnsavedChanges = computed(() => {
  if (!isEdit.value) return true;
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

const originalForm = ref<Partial<EducationUnit>>({});

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true;
    try {
      const data = await getUnitById(route.params.id as string);
      form.value = { ...data };
      originalForm.value = { ...data };
      originalStatus.value = data.status;
    } catch (e) {
      console.error(e);
      showError('Gagal memuat data');
    } finally {
      loading.value = false;
    }
  }
});

async function handleSave(draft: boolean) {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (draft) form.value.status = 'draft';
    if (isEdit.value) {
      await updateUnit(route.params.id as string, form.value);
    } else {
      const created = await createUnit(form.value);
      router.replace(`/admin/units/${created.id}/edit`);
    }
  } catch (e: unknown) {
    saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan data.';
  } finally {
    saving.value = false;
  }
}

async function handlePublish() {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (isEdit.value) {
      await publishUnit(route.params.id as string);
    } else {
      form.value.status = 'published';
      const created = await createUnit(form.value);
      router.replace(`/admin/units/${created.id}/edit`);
    }
    router.push('/admin/units');
  } catch (e: unknown) {
    saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan saat mempublikasikan data.';
  } finally {
    saving.value = false;
  }
}

async function handleArchive() {
  saving.value = true;
  try {
    await archiveUnit(route.params.id as string);
    router.push('/admin/units');
  } catch (e) {
    console.error(e);
    showError('Gagal mengarsipkan data');
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  saving.value = true;
  try {
    await deleteUnit(route.params.id as string);
    showDeleteDialog.value = false;
    router.push('/admin/units');
  } catch (e) {
    console.error(e);
    showError('Gagal menghapus data');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-700">{{ saveError }}</div>
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>

    <template v-else>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Nama Unit" required :error="errors.name">
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
              placeholder="Nama unit pendidikan"
            />
          </FormField>

          <SlugInput v-model="form.slug!" :source="form.name || ''" table="education_units" :exclude-id="isEdit ? (route.params.id as string) : undefined" />

          <FormField label="Deskripsi Singkat">
            <textarea
              v-model="form.short_description!"
              rows="3"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
              placeholder="Deskripsi singkat unit"
            />
          </FormField>

          <FormField label="Deskripsi Lengkap">
            <RichTextEditor v-model="form.description!" placeholder="Deskripsi lengkap unit..." />
          </FormField>

          <FormField label="Alamat">
            <textarea
              v-model="form.address!"
              rows="2"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
              placeholder="Alamat unit"
            />
          </FormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Telepon">
              <input
                v-model="form.phone!"
                type="tel"
                class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
                placeholder="Nomor telepon"
              />
            </FormField>
            <FormField label="Email">
              <input
                v-model="form.email!"
                type="email"
                class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
                placeholder="Email unit"
              />
            </FormField>
          </div>

          <FormField label="URL Google Maps">
            <input
              v-model="form.maps_url!"
              type="url"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
              placeholder="https://maps.google.com/..."
            />
          </FormField>

          <FormField label="Urutan Tampilan">
            <input
              v-model.number="form.sort_order"
              type="number"
              min="0"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
            />
          </FormField>
        </div>

        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
            <h3 class="font-semibold text-[var(--color-bark)]">Logo</h3>
            <MediaPicker v-model="form.logo_url!" bucket="site-assets" folder="units/logos" />
          </div>

          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
            <h3 class="font-semibold text-[var(--color-bark)]">Gambar Hero</h3>
            <MediaPicker v-model="form.hero_image_url!" bucket="site-assets" folder="units/hero" />
          </div>

          <SeoFields v-model="seoValue" />
        </div>
      </div>
    </template>

    <SaveBar
      :loading="saving"
      :has-unsaved-changes="hasUnsavedChanges"
      :status="isEdit ? (originalStatus || 'draft') : 'draft'"
      @save="handleSave"
      @publish="handlePublish"
      @archive="handleArchive"
      @delete="showDeleteDialog = true"
    />

    <ConfirmDialog
      :open="showDeleteDialog"
      title="Hapus Unit"
      message="Apakah Anda yakin ingin menghapus unit ini? Tindakan ini tidak dapat dibatalkan."
      confirm-label="Hapus"
      confirm-variant="danger"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>
