<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getStaffById, createStaff, updateStaff, deleteStaff } from '@/services/admin/staff.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { Staff } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Guru/Staf' : 'Tambah Guru/Staf';

const form = ref<Partial<Staff>>({
  full_name: '', position: '', bio: '', photo_url: null, sort_order: 0, is_visible: true, unit_id: null,
});

const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);

const { errors, validate, clearErrors } = useFormValidation({
  full_name: [required('Nama')],
  position: [required('Posisi')],
});
const { showError } = useErrorToast();
const saveError = ref('');

const originalForm = ref<Partial<Staff>>({});
const hasUnsavedChanges = computed(() => {
  if (!isEdit.value) return true;
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true;
    try {
      const data = await getStaffById(route.params.id as string);
      form.value = { ...data };
      originalForm.value = { ...data };
    } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
  }
});

async function handleSave() {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (isEdit.value) { await updateStaff(route.params.id as string, form.value); }
    else { const created = await createStaff(form.value); router.replace(`/admin/guru-staf/${created.id}/edit`); }
  } catch (e: unknown) { saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan.'; } finally { saving.value = false; }
}

async function handleDelete() {
  saving.value = true;
  try { await deleteStaff(route.params.id as string); showDeleteDialog.value = false; router.push('/admin/guru-staf'); } catch (e) { console.error(e); showError('Gagal menghapus'); } finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-700">{{ saveError }}</div>
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Nama Lengkap" required :error="errors.full_name">
            <input v-model="form.full_name" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Nama lengkap" />
          </FormField>
          <FormField label="Posisi" required :error="errors.position">
            <input v-model="form.position" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Guru Kelas / Guru Agama / Staf Administrasi" />
          </FormField>
          <FormField label="Bio">
            <textarea v-model="form.bio!" rows="3" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Deskripsi singkat (opsional)" />
          </FormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Urutan Tampil">
              <input v-model.number="form.sort_order" type="number" min="0" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="Visibilitas">
              <label class="flex items-center gap-2 pt-2">
                <input v-model="form.is_visible" type="checkbox" class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)] focus:ring-[var(--color-moss)]" />
                <span class="text-body text-[var(--color-bark)]">Tampilkan di website</span>
              </label>
            </FormField>
          </div>
        </div>
        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
            <h3 class="font-semibold text-[var(--color-bark)]">Foto</h3>
            <MediaPicker v-model="form.photo_url!" bucket="site-assets" folder="staff" />
          </div>
        </div>
      </div>
    </template>

    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-sand)] bg-white shadow-lg">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <span v-if="hasUnsavedChanges" class="inline-flex items-center gap-1.5 text-small text-[var(--color-gold)]">
          <span class="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
          Belum disimpan
        </span>
        <div class="flex items-center gap-2 ml-auto">
          <button v-if="isEdit" class="rounded-lg border border-red-200 px-4 py-2 text-small font-medium text-red-600 hover:bg-red-50" @click="showDeleteDialog = true">Hapus</button>
          <button :disabled="saving" class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="handleSave">Simpan</button>
        </div>
      </div>
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Guru/Staf" message="Apakah Anda yakin ingin menghapus data ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
