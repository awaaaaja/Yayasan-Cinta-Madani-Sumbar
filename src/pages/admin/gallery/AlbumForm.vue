<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import SlugInput from '@/components/admin/SlugInput.vue';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import SaveBar from '@/components/admin/SaveBar.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getAlbumById, createAlbum, updateAlbum, deleteAlbum, publishAlbum, archiveAlbum, getAlbumItems, addMediaToAlbum, removeMediaFromAlbum, uploadMedia } from '@/services/admin/gallery.admin.service';
import { useFormValidation, required, validSlug } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { GalleryAlbum } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Album' : 'Tambah Album';

const form = ref<Partial<GalleryAlbum>>({
  title: '', slug: '', description: '', cover_url: null, event_date: '', status: 'draft',
});

const { errors, validate, clearErrors } = useFormValidation({
  title: [required('Judul')],
  slug: [required('Slug'), validSlug()],
});
const { showError } = useErrorToast();
const saveError = ref('');

const albumItems = ref<Array<{ id: string; media_id: string; caption: string | null; media?: { public_url: string } }>>([]);
const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);
const originalStatus = ref('draft');
const uploadLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const originalForm = ref<Partial<GalleryAlbum>>({});
const hasUnsavedChanges = computed(() => {
  if (!isEdit.value) return true;
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true;
    try {
      const data = await getAlbumById(route.params.id as string);
      form.value = { ...data };
      originalForm.value = { ...data };
      originalStatus.value = data.status;
      albumItems.value = await getAlbumItems(data.id) as typeof albumItems.value;
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
    if (isEdit.value) { await updateAlbum(route.params.id as string, form.value); }
    else { const created = await createAlbum(form.value); router.replace(`/admin/gallery/${created.id}/edit`); }
  } catch (e) { saveError.value = 'Gagal menyimpan album. Silakan coba lagi.'; } finally { saving.value = false; }
}

async function handlePublish() {
  saving.value = true;
  try {
    if (isEdit.value) { await publishAlbum(route.params.id as string); }
    else { form.value.status = 'published'; const created = await createAlbum(form.value); router.replace(`/admin/gallery/${created.id}/edit`); }
    router.push('/admin/gallery');
  } catch (e) { console.error(e); showError('Gagal mempublikasikan data'); } finally { saving.value = false; }
}

async function handleArchive() {
  saving.value = true;
  try { await archiveAlbum(route.params.id as string); router.push('/admin/gallery'); } catch (e) { console.error(e); showError('Gagal mengarsipkan data'); } finally { saving.value = false; }
}

async function handleDelete() {
  saving.value = true;
  try { await deleteAlbum(route.params.id as string); showDeleteDialog.value = false; router.push('/admin/gallery'); } catch (e) { console.error(e); showError('Gagal menghapus data'); } finally { saving.value = false; }
}

async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files?.length || !route.params.id) return;
  uploadLoading.value = true;
  try {
    for (const file of Array.from(files)) {
      const media = await uploadMedia(file);
      await addMediaToAlbum(route.params.id as string, media.id);
    }
    albumItems.value = await getAlbumItems(route.params.id as string) as typeof albumItems.value;
  } catch (e) { console.error(e); showError('Gagal mengunggah foto'); } finally {
    if (fileInput.value) fileInput.value.value = '';
  }
}

async function handleRemoveItem(itemId: string) {
  try {
    await removeMediaFromAlbum(itemId);
    albumItems.value = albumItems.value.filter((i) => i.id !== itemId);
  } catch (e) { console.error(e); showError('Gagal menghapus foto'); }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ saveError }}</div>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Judul Album" required :error="errors.title">
            <input v-model="form.title" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Judul album" />
          </FormField>
          <FormField label="Slug" required :error="errors.slug">
            <SlugInput v-model="form.slug!" :source="form.title || ''" table="gallery_albums" :exclude-id="isEdit ? (route.params.id as string) : undefined" />
          </FormField>
          <FormField label="Deskripsi">
            <textarea v-model="form.description!" rows="3" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Deskripsi album" />
          </FormField>
          <FormField label="Tanggal Event">
            <input v-model="form.event_date!" type="date" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </FormField>
        </div>
        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
            <h3 class="font-semibold text-[var(--color-bark)]">Gambar Sampul</h3>
            <MediaPicker v-model="form.cover_url!" bucket="gallery" folder="covers" />
          </div>
        </div>
      </div>

      <div v-if="isEdit" class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-[var(--color-bark)]">Foto Album ({{ albumItems.length }})</h3>
          <div>
            <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onUpload" />
            <button :disabled="uploadLoading" class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="fileInput?.click()">
              <svg v-if="!uploadLoading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ uploadLoading ? 'Mengunggah...' : 'Tambah Foto' }}
            </button>
          </div>
        </div>
        <div v-if="albumItems.length === 0" class="py-8 text-center text-[var(--color-moss)]">Belum ada foto</div>
        <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <div v-for="item in albumItems" :key="item.id" class="group relative">
            <img :src="item.media?.public_url" :alt="item.caption || ''" class="aspect-square w-full rounded-lg object-cover" />
            <button class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity" @click="handleRemoveItem(item.id)">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <SaveBar :loading="saving" :has-unsaved-changes="hasUnsavedChanges" :status="isEdit ? (originalStatus || 'draft') : 'draft'" @save="handleSave" @publish="handlePublish" @archive="handleArchive" @delete="showDeleteDialog = true" />
    <ConfirmDialog :open="showDeleteDialog" title="Hapus Album" message="Apakah Anda yakin ingin menghapus album ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
