<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/components/admin/DataTable.vue';
import MobileDataCard from '@/components/admin/MobileDataCard.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { listPeriods, deletePeriod } from '@/services/admin/ppdb.admin.service';
import type { PpdbPeriod } from '@/types';

document.title = 'Manajemen PPDB';

const router = useRouter();
const items = ref<PpdbPeriod[]>([]);
const loading = ref(true);
const search = ref('');
const statusFilter = ref('');
const page = ref(1);
const totalPages = ref(1);
const pageSize = 10;
const deleteId = ref<string | null>(null);
const showDeleteDialog = ref(false);

const columns = [
  { key: 'unit_id', label: 'Unit' },
  { key: 'academic_year', label: 'Tahun Ajaran' },
  { key: 'status', label: 'Status' },
  { key: 'start_date', label: 'Periode' },
];

const mobileFields = [
  { key: 'academic_year', label: 'Tahun Ajaran' },
  { key: 'start_date', label: 'Mulai', type: 'date' as const },
];

const debounceTimer = ref<ReturnType<typeof setTimeout>>();

function onSearch(value: string) {
  search.value = value;
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => { page.value = 1; fetchItems(); }, 300);
}

function onStatusFilter(value: string) { statusFilter.value = value; page.value = 1; fetchItems(); }

async function fetchItems() {
  loading.value = true;
  try {
    const result = await listPeriods({ page: page.value, pageSize, search: search.value, status: statusFilter.value });
    items.value = result.data;
    totalPages.value = result.totalPages;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function goToPage(p: number) { page.value = p; fetchItems(); }
function handleRowClick(row: Record<string, unknown>) { router.push(`/admin/ppdb/${row.id}/edit`); }
function confirmDelete(id: string) { deleteId.value = id; showDeleteDialog.value = true; }

async function handleDelete() {
  if (!deleteId.value) return;
  try { await deletePeriod(deleteId.value); showDeleteDialog.value = false; deleteId.value = null; fetchItems(); } catch (e) { console.error(e); }
}

onMounted(fetchItems);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">PPDB</h1>
      <button class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)]" @click="router.push('/admin/ppdb/create')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Tambah Periode
      </button>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-moss)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" placeholder="Cari periode PPDB..." class="w-full rounded-lg border border-[var(--color-sand)] bg-white py-2 pl-10 pr-4 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" @input="onSearch(($event.target as HTMLInputElement).value)" />
      </div>
      <select class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" @change="onStatusFilter(($event.target as HTMLSelectElement).value)">
        <option value="">Semua Status</option>
        <option value="coming_soon">Coming Soon</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
    </div>

    <div class="hidden rounded-xl border border-[var(--color-sand)] bg-white lg:block">
      <DataTable :columns="columns" :rows="items" :loading="loading" empty-message="Belum ada periode PPDB" :selected-keys="[]" @row-click="handleRowClick">
        <template #cell-unit_id="{ value, row }">
          {{ (row as PpdbPeriod & { unit?: { name: string } }).unit?.name || value }}
        </template>
        <template #cell-start_date="{ value, row }">
          {{ value ? `${new Date(String(value)).toLocaleDateString('id-ID')} - ${new Date(String((row as PpdbPeriod).end_date)).toLocaleDateString('id-ID')}` : '-' }}
        </template>
        <template #cell-status="{ value }">
          <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', value === 'open' ? 'bg-green-100 text-green-700' : value === 'coming_soon' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600']">{{ value }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click.stop="router.push(`/admin/ppdb/${row.id}/edit`)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button class="rounded p-1.5 text-red-500 hover:bg-red-50" @click.stop="confirmDelete(row.id as string)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <div class="space-y-3 lg:hidden">
      <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
      <div v-else-if="items.length === 0" class="py-12 text-center text-[var(--color-moss)]">Belum ada periode PPDB</div>
      <MobileDataCard v-for="item in items" :key="item.id" :item="item" :fields="mobileFields" status-field="status" @click="router.push(`/admin/ppdb/${item.id}/edit`)" @edit="router.push(`/admin/ppdb/${item.id}/edit`)" @delete="confirmDelete(item.id)" />
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button :disabled="page <= 1" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page - 1)">Sebelumnya</button>
      <span class="text-small text-[var(--color-moss)]">{{ page }} / {{ totalPages }}</span>
      <button :disabled="page >= totalPages" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page + 1)">Selanjutnya</button>
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Periode PPDB" message="Apakah Anda yakin ingin menghapus periode PPDB ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
