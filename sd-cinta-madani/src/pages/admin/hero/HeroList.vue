<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/components/admin/DataTable.vue';
import MobileDataCard from '@/components/admin/MobileDataCard.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { listHeroSlidesAdmin, deleteHeroSlide, reorderHeroSlides } from '@/services/admin/hero.admin.service';
import type { HeroSlide } from '@/types';

document.title = 'Manajemen Hero Slideshow';

const router = useRouter();
const items = ref<HeroSlide[]>([]);
const loading = ref(true);
const search = ref('');
const deleteId = ref<string | null>(null);
const showDeleteDialog = ref(false);

const columns = [
  { key: 'sort_order', label: 'Urutan', sortable: true },
  { key: 'title', label: 'Judul', sortable: true },
  { key: 'is_active', label: 'Status' },
  { key: 'duration', label: 'Durasi' },
  { key: 'image_position', label: 'Posisi' },
];

const mobileFields = [
  { key: 'is_active', label: 'Status' },
  { key: 'duration', label: 'Durasi' },
];

async function fetchItems() {
  loading.value = true;
  try {
    const result = await listHeroSlidesAdmin({ search: search.value });
    items.value = result.data;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function handleRowClick(row: Record<string, unknown>) {
  router.push(`/admin/hero/${row.id}/edit`);
}

function confirmDelete(id: string) {
  deleteId.value = id;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  if (!deleteId.value) return;
  try {
    await deleteHeroSlide(deleteId.value);
    showDeleteDialog.value = false;
    deleteId.value = null;
    fetchItems();
  } catch (e) { console.error(e); }
}

async function moveUp(index: number) {
  if (index === 0) return;
  const newItems = [...items.value];
  [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
  items.value = newItems;
  await reorderHeroSlides(newItems.map(i => i.id));
}

async function moveDown(index: number) {
  if (index >= items.value.length - 1) return;
  const newItems = [...items.value];
  [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
  items.value = newItems;
  await reorderHeroSlides(newItems.map(i => i.id));
}

onMounted(fetchItems);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">Hero Slideshow</h1>
      <button class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)]" @click="router.push('/admin/hero/create')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Tambah Slide
      </button>
    </div>

    <p class="text-sm text-[var(--color-moss)]">
      Kelola slide hero yang ditampilkan di halaman utama. Slide akan otomatis berganti secara bergantian.
    </p>

    <!-- Desktop Table -->
    <div class="hidden rounded-xl border border-[var(--color-sand)] bg-white lg:block">
      <DataTable :columns="columns" :rows="items" :loading="loading" empty-message="Belum ada slide hero" :selected-keys="[]" @row-click="handleRowClick">
        <template #cell-sort_order="{ value, row }">
          <div class="flex items-center gap-1">
            <button class="rounded p-1 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click.stop="moveUp(items.indexOf(row as HeroSlide))" :disabled="items.indexOf(row as HeroSlide) === 0">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
            </button>
            <button class="rounded p-1 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click.stop="moveDown(items.indexOf(row as HeroSlide))" :disabled="items.indexOf(row as HeroSlide) === items.length - 1">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <span class="ml-1 text-xs text-[var(--color-moss)]">{{ value }}</span>
          </div>
        </template>
        <template #cell-is_active="{ value }">
          <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
            {{ value ? 'Aktif' : 'Nonaktif' }}
          </span>
        </template>
        <template #cell-duration="{ value }">
          <span class="text-xs text-[var(--color-moss)]">{{ (Number(value) / 1000).toFixed(0) }}d</span>
        </template>
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click.stop="router.push(`/admin/hero/${row.id}/edit`)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button class="rounded p-1.5 text-red-500 hover:bg-red-50" @click.stop="confirmDelete(row.id as string)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Mobile Cards -->
    <div class="space-y-3 lg:hidden">
      <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
      <div v-else-if="items.length === 0" class="py-12 text-center text-[var(--color-moss)]">Belum ada slide hero</div>
      <MobileDataCard v-for="item in items" :key="item.id" :item="item" :fields="mobileFields" status-field="is_active" @click="router.push(`/admin/hero/${item.id}/edit`)" @edit="router.push(`/admin/hero/${item.id}/edit`)" @delete="confirmDelete(item.id)" />
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Slide" message="Apakah Anda yakin ingin menghapus slide ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
