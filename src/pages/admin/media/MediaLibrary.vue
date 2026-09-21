<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { listMedia, uploadMedia, deleteMedia, updateMedia } from '@/services/admin/media.admin.service';
import type { MediaItem } from '@/types';

document.title = 'Pustaka Media';

const items = ref<MediaItem[]>([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const pageSize = 20;
const search = ref('');
const uploadLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const deleteId = ref<string | null>(null);
const showDeleteDialog = ref(false);
const showDetail = ref(false);
const detailItem = ref<MediaItem | null>(null);
const detailAltText = ref('');
const detailCaption = ref('');
const savingDetail = ref(false);
const uploadBucket = ref('site-assets');
const uploadFolder = ref('');
const copiedUrl = ref('');

const folders = [
  { value: '', label: 'Semua Folder' },
  { value: 'uploads', label: 'Uploads' },
  { value: 'news', label: 'Berita' },
  { value: 'logos', label: 'Logo' },
  { value: 'og', label: 'OG Image' },
  { value: 'gallery', label: 'Galeri' },
  { value: 'avatars', label: 'Avatar' },
];

const buckets = [
  { value: 'site-assets', label: 'Site Assets' },
  { value: 'news', label: 'News' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'unit-assets', label: 'Unit Assets' },
  { value: 'documents', label: 'Documents' },
  { value: 'avatars', label: 'Avatars' },
];

const debounceTimer = ref<ReturnType<typeof setTimeout>>();

function onSearch(value: string) {
  search.value = value;
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => { page.value = 1; fetchItems(); }, 300);
}

function onFolderFilter(value: string) {
  uploadFolder.value = value;
  page.value = 1;
  fetchItems();
}

async function fetchItems() {
  loading.value = true;
  try {
    const result = await listMedia({ page: page.value, pageSize, folder: uploadFolder.value || undefined });
    items.value = result.data;
    totalPages.value = result.totalPages;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function goToPage(p: number) { page.value = p; fetchItems(); }

async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files?.length) return;
  uploadLoading.value = true;
  try {
    for (const file of Array.from(files)) {
      await uploadMedia(file, uploadBucket.value, uploadFolder.value || 'uploads');
    }
    fetchItems();
  } catch (e) { console.error(e); } finally {
    uploadLoading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
}

function openDetail(item: MediaItem) {
  detailItem.value = item;
  detailAltText.value = item.alt_text || '';
  detailCaption.value = item.caption || '';
  showDetail.value = true;
}

async function saveDetail() {
  if (!detailItem.value) return;
  savingDetail.value = true;
  try {
    await updateMedia(detailItem.value.id, {
      alt_text: detailAltText.value || null,
      caption: detailCaption.value || null,
    });
    showDetail.value = false;
    fetchItems();
  } catch (e) { console.error(e); } finally { savingDetail.value = false; }
}

function confirmDelete(id: string) { deleteId.value = id; showDeleteDialog.value = true; }

async function handleDelete() {
  if (!deleteId.value) return;
  try { await deleteMedia(deleteId.value); showDeleteDialog.value = false; deleteId.value = null; fetchItems(); } catch (e) { console.error(e); }
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url);
  copiedUrl.value = url;
  setTimeout(() => { copiedUrl.value = ''; }, 2000);
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mime: string): boolean {
  return mime.startsWith('image/');
}

const displayItems = computed(() => {
  if (!search.value) return items.value;
  return items.value.filter((i) => i.file_name.toLowerCase().includes(search.value.toLowerCase()));
});

onMounted(fetchItems);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">Pustaka Media</h1>
      <div class="flex items-center gap-2">
        <select v-model="uploadBucket" class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)]">
          <option v-for="b in buckets" :key="b.value" :value="b.value">{{ b.label }}</option>
        </select>
        <input ref="fileInput" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" multiple class="hidden" @change="onUpload" />
        <button :disabled="uploadLoading" class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="fileInput?.click()">
          {{ uploadLoading ? 'Mengunggah...' : 'Unggah' }}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-moss)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" placeholder="Cari file..." class="w-full rounded-lg border border-[var(--color-sand)] bg-white py-2 pl-10 pr-4 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" @input="onSearch(($event.target as HTMLInputElement).value)" />
      </div>
      <select class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" @change="onFolderFilter(($event.target as HTMLSelectElement).value)">
        <option v-for="f in folders" :key="f.value" :value="f.value">{{ f.label }}</option>
      </select>
    </div>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <div v-else-if="displayItems.length === 0" class="py-12 text-center text-[var(--color-moss)]">Tidak ada media</div>

    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <div v-for="item in displayItems" :key="item.id" class="group relative overflow-hidden rounded-xl border border-[var(--color-sand)] bg-white">
        <img v-if="isImage(item.mime_type)" :src="item.public_url" :alt="item.alt_text || item.file_name" class="aspect-square w-full object-cover" />
        <div v-else class="flex aspect-square w-full items-center justify-center bg-[var(--color-cream)]">
          <svg class="h-12 w-12 text-[var(--color-moss)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
          <button class="rounded bg-white/90 px-2 py-1 text-xs font-medium text-[var(--color-bark)] hover:bg-white" @click="openDetail(item)">Detail</button>
          <button class="rounded bg-white/90 px-2 py-1 text-xs font-medium text-[var(--color-bark)] hover:bg-white" @click="copyUrl(item.public_url)">
            {{ copiedUrl === item.public_url ? 'Tersalin!' : 'Salin URL' }}
          </button>
          <button class="rounded bg-red-500/90 px-2 py-1 text-xs font-medium text-white hover:bg-red-500" @click="confirmDelete(item.id)">Hapus</button>
        </div>
        <div class="p-2">
          <p class="truncate text-xs text-[var(--color-bark)]">{{ item.file_name }}</p>
          <p class="text-xs text-[var(--color-moss)]">{{ formatSize(item.file_size) }}</p>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button :disabled="page <= 1" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page - 1)">Sebelumnya</button>
      <span class="text-small text-[var(--color-moss)]">{{ page }} / {{ totalPages }}</span>
      <button :disabled="page >= totalPages" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page + 1)">Selanjutnya</button>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail && detailItem" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div class="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-[var(--color-sand)] px-6 py-4">
          <h2 class="text-lg font-semibold text-[var(--color-bark)]">Detail Media</h2>
          <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="showDetail = false">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div v-if="isImage(detailItem.mime_type)" class="rounded-lg overflow-hidden border border-[var(--color-sand)]">
            <img :src="detailItem.public_url" :alt="detailItem.alt_text || detailItem.file_name" class="w-full object-contain max-h-64" />
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div><span class="text-[var(--color-moss)]">File:</span> <span class="text-[var(--color-bark)]">{{ detailItem.file_name }}</span></div>
            <div><span class="text-[var(--color-moss)]">Ukuran:</span> <span class="text-[var(--color-bark)]">{{ formatSize(detailItem.file_size) }}</span></div>
            <div><span class="text-[var(--color-moss)]">Tipe:</span> <span class="text-[var(--color-bark)]">{{ detailItem.mime_type }}</span></div>
            <div><span class="text-[var(--color-moss)]">Folder:</span> <span class="text-[var(--color-bark)]">{{ detailItem.folder || '-' }}</span></div>
          </div>
          <div class="space-y-1.5">
            <label class="block text-small font-semibold text-[var(--color-bark)]">Alt Text</label>
            <input v-model="detailAltText" type="text" placeholder="Deskripsi gambar untuk aksesibilitas" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-small font-semibold text-[var(--color-bark)]">Caption</label>
            <textarea v-model="detailCaption" rows="2" placeholder="Keterangan singkat" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-small font-semibold text-[var(--color-bark)]">URL</label>
            <div class="flex gap-2">
              <input type="text" :value="detailItem.public_url" readonly class="flex-1 rounded-lg border border-[var(--color-sand)] bg-[var(--color-cream)] px-3 py-2 text-xs text-[var(--color-moss)]" />
              <button class="rounded-lg border border-[var(--color-sand)] px-3 py-2 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)]" @click="copyUrl(detailItem.public_url)">
                {{ copiedUrl === detailItem.public_url ? 'Tersalin!' : 'Salin' }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-[var(--color-sand)] px-6 py-4">
          <button class="rounded-lg border border-[var(--color-sand)] px-4 py-2 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)]" @click="showDetail = false">Tutup</button>
          <button :disabled="savingDetail" class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="saveDetail">
            {{ savingDetail ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Media" message="Apakah Anda yakin ingin menghapus file media ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
