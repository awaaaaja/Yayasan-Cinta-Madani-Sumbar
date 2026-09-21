<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getFacilityById, createFacility, updateFacility, deleteFacility } from '@/services/admin/facilities.admin.service';
import { listUnits } from '@/services/admin/units.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { EducationUnit } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Fasilitas' : 'Tambah Fasilitas';

const form = ref({
  name: '', description: '', icon: '', image_url: null as string | null, sort_order: 0, unit_id: null as string | null,
});

const units = ref<EducationUnit[]>([]);
const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);

const { errors, validate, clearErrors } = useFormValidation({ name: [required('Nama')] });
const { showError } = useErrorToast();
const saveError = ref('');

const originalForm = ref({});
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
      const data = await getFacilityById(route.params.id as string);
      form.value = { name: data.name, description: data.description || '', icon: data.icon || '', image_url: data.image_url, sort_order: data.sort_order, unit_id: data.unit_id };
      originalForm.value = { ...form.value };
    } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
  }
});

async function handleSave() {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    const payload = { ...form.value, unit_id: form.value.unit_id ?? undefined };
    if (isEdit.value) { await updateFacility(route.params.id as string, payload); }
    else { const created = await createFacility(payload); router.replace(`/admin/fasilitas/${created.id}/edit`); }
  } catch (e: unknown) { saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan.'; } finally { saving.value = false; }
}

async function handleDelete() {
  saving.value = true;
  try { await deleteFacility(route.params.id as string); showDeleteDialog.value = false; router.push('/admin/fasilitas'); } catch (e) { console.error(e); showError('Gagal menghapus'); } finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-700">{{ saveError }}</div>
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Nama Fasilitas" required :error="errors.name">
            <input v-model="form.name" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Perpustakaan / Lab Komputer / dll" />
          </FormField>
          <FormField label="Deskripsi">
            <textarea v-model="form.description" rows="3" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Deskripsi fasilitas" />
          </FormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Ikon (emoji)">
              <input v-model="form.icon" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="📚 / 🖥️ / 🏀" />
            </FormField>
            <FormField label="Urutan Tampil">
              <input v-model.number="form.sort_order" type="number" min="0" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
          </div>
        </div>
        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
            <h3 class="font-semibold text-[var(--color-bark)]">Gambar</h3>
            <MediaPicker :model-value="form.image_url ?? ''" bucket="site-assets" folder="facilities" @update:model-value="form.image_url = $event || null" @remove="form.image_url = null" />
          </div>
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

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Fasilitas" message="Apakah Anda yakin ingin menghapus fasilitas ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
