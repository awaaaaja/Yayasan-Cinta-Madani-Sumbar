<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import SlugInput from '@/components/admin/SlugInput.vue';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import RichTextEditor from '@/components/admin/RichTextEditor.vue';
import SaveBar from '@/components/admin/SaveBar.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getEventById, createEvent, updateEvent, deleteEvent, publishEvent, archiveEvent } from '@/services/admin/events.admin.service';
import { listUnits } from '@/services/admin/units.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { Event, EducationUnit } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Event' : 'Tambah Event';

const form = ref<Partial<Event>>({
  title: '', slug: '', description: '', cover_image_url: null, event_date: '', end_date: '', location: '', registration_url: '', status: 'draft', unit_id: null,
});

const units = ref<EducationUnit[]>([]);
const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);
const originalStatus = ref('draft');

const { errors, validate, clearErrors } = useFormValidation({ title: [required('Judul')], slug: [required('Slug')], event_date: [required('Tanggal Mulai')] });
const { showError } = useErrorToast();
const saveError = ref('');

const originalForm = ref<Partial<Event>>({});
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
      const data = await getEventById(route.params.id as string);
      form.value = { ...data };
      originalForm.value = { ...data };
      originalStatus.value = data.status;
    } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
  }
});

async function handleSave(draft: boolean) {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (draft) form.value.status = 'draft';
    if (isEdit.value) { await updateEvent(route.params.id as string, form.value); }
    else { const created = await createEvent(form.value); router.replace(`/admin/events/${created.id}/edit`); }
  } catch (e: unknown) { saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan data.'; } finally { saving.value = false; }
}

async function handlePublish() {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (isEdit.value) { await publishEvent(route.params.id as string); }
    else { form.value.status = 'published'; const created = await createEvent(form.value); router.replace(`/admin/events/${created.id}/edit`); }
    router.push('/admin/events');
  } catch (e: unknown) { saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan saat mempublikasikan data.'; } finally { saving.value = false; }
}

async function handleArchive() {
  saving.value = true;
  try { await archiveEvent(route.params.id as string); router.push('/admin/events'); } catch (e) { console.error(e); showError('Gagal mengarsipkan data'); } finally { saving.value = false; }
}

async function handleDelete() {
  saving.value = true;
  try { await deleteEvent(route.params.id as string); showDeleteDialog.value = false; router.push('/admin/events'); } catch (e) { console.error(e); showError('Gagal menghapus data'); } finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-700">{{ saveError }}</div>
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Judul Event" required :error="errors.title">
            <input v-model="form.title" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Judul event" />
          </FormField>
          <SlugInput v-model="form.slug!" :source="form.title || ''" table="events" :exclude-id="isEdit ? (route.params.id as string) : undefined" />
          <FormField label="Deskripsi">
            <RichTextEditor v-model="form.description!" placeholder="Deskripsi event..." />
          </FormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Tanggal Mulai" required :error="errors.event_date">
              <input v-model="form.event_date" type="datetime-local" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="Tanggal Selesai">
              <input v-model="form.end_date!" type="datetime-local" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
          </div>
          <FormField label="Lokasi">
            <input v-model="form.location!" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Lokasi event" />
          </FormField>
          <FormField label="URL Pendaftaran">
            <input v-model="form.registration_url!" type="url" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="https://..." />
          </FormField>
        </div>
        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
            <h3 class="font-semibold text-[var(--color-bark)]">Gambar Sampul</h3>
            <MediaPicker v-model="form.cover_image_url!" bucket="site-assets" folder="events" />
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
    <SaveBar :loading="saving" :has-unsaved-changes="hasUnsavedChanges" :status="isEdit ? (originalStatus || 'draft') : 'draft'" @save="handleSave" @publish="handlePublish" @archive="handleArchive" @delete="showDeleteDialog = true" />
    <ConfirmDialog :open="showDeleteDialog" title="Hapus Event" message="Apakah Anda yakin ingin menghapus event ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
