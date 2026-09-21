<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import SaveBar from '@/components/admin/SaveBar.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getDownloadById, createDownload, updateDownload, deleteDownload, uploadFile } from '@/services/admin/downloads.admin.service';
import { listUnits } from '@/services/admin/units.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { Download, EducationUnit } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Download' : 'Tambah Download';

const form = ref<Partial<Download>>({
  title: '', description: '', file_url: '', file_type: null, file_size: null, status: 'draft', unit_id: null,
});

const { errors, validate, clearErrors } = useFormValidation({
  title: [required('Judul')],
  file_url: [required('File')],
});
const { showError } = useErrorToast();
const saveError = ref('');

const units = ref<EducationUnit[]>([]);
const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const originalForm = ref<Partial<Download>>({});
const hasUnsavedChanges = computed(() => {
  if (!isEdit.value) return true;
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

onMounted(async () => {
  const unitsResult = await listUnits({ pageSize: 100 });
  units.value = unitsResult.data;
  if (isEdit.value) {
    loading.value = true;
    try {
      const data = await getDownloadById(route.params.id as string);
      form.value = { ...data };
      originalForm.value = { ...data };
    } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
  }
});

async function onFileUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  uploading.value = true;
  try {
    const result = await uploadFile(file);
    form.value.file_url = result.url;
    form.value.file_type = result.fileType;
    form.value.file_size = result.fileSize;
  } catch (e) { console.error(e); showError('Gagal mengunggah file'); } finally {
    if (fileInput.value) fileInput.value.value = '';
  }
}

async function handleSave(draft: boolean) {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (draft) form.value.status = 'draft';
    if (isEdit.value) { await updateDownload(route.params.id as string, form.value); }
    else { const created = await createDownload(form.value); router.replace(`/admin/downloads/${created.id}/edit`); }
  } catch (e) { saveError.value = 'Gagal menyimpan download. Silakan coba lagi.'; } finally { saving.value = false; }
}

async function handleDelete() {
  saving.value = true;
  try { await deleteDownload(route.params.id as string); showDeleteDialog.value = false; router.push('/admin/downloads'); } catch (e) { console.error(e); showError('Gagal menghapus data'); } finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ saveError }}</div>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Judul" required :error="errors.title">
            <input v-model="form.title" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Judul file" />
          </FormField>
          <FormField label="Deskripsi">
            <textarea v-model="form.description!" rows="3" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Deskripsi file" />
          </FormField>
          <FormField label="File" :error="errors.file_url">
            <input ref="fileInput" type="file" class="hidden" @change="onFileUpload" />
            <div class="flex items-center gap-3">
              <button :disabled="uploading" class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="fileInput?.click()">
                {{ uploading ? 'Mengunggah...' : 'Pilih File' }}
              </button>
              <span v-if="form.file_url" class="text-small text-[var(--color-moss)]">{{ form.title }}</span>
            </div>
          </FormField>
        </div>
        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-3">
            <h3 class="font-semibold text-[var(--color-bark)]">Unit</h3>
            <select v-model="form.unit_id" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20">
              <option :value="null">Semua Unit</option>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </template>

    <SaveBar :loading="saving" :has-unsaved-changes="hasUnsavedChanges" :status="isEdit ? 'draft' : 'draft'" @save="handleSave" @publish="() => handleSave(false)" @archive="() => {}" @delete="showDeleteDialog = true" />
    <ConfirmDialog :open="showDeleteDialog" title="Hapus Download" message="Apakah Anda yakin ingin menghapus file ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
