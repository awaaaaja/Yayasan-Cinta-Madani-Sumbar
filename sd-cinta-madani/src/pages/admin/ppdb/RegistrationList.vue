<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/components/admin/DataTable.vue';
import { listRegistrations, listPeriods } from '@/services/admin/ppdb-registrations.admin.service';
import type { PpdbRegistration, PpdbPeriod } from '@/services/admin/ppdb-registrations.admin.service';

document.title = 'Registrasi PPDB';

const router = useRouter();
const items = ref<PpdbRegistration[]>([]);
const periods = ref<PpdbPeriod[]>([]);
const loading = ref(true);
const search = ref('');
const statusFilter = ref('');
const periodFilter = ref('');
const page = ref(1);
const totalPages = ref(1);
const pageSize = 10;

const columns = [
  { key: 'status', label: 'Status' },
  { key: 'full_name', label: 'Nama Siswa', sortable: true },
  { key: 'nik', label: 'NIK' },
  { key: 'previous_school', label: 'Sekolah Asal' },
  { key: 'created_at', label: 'Tanggal', sortable: true },
];

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
];

const debounceTimer = ref<ReturnType<typeof setTimeout>>();

function onSearch(value: string) {
  search.value = value;
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => { page.value = 1; fetchData(); }, 300);
}

function onStatusFilter(value: string) { statusFilter.value = value; page.value = 1; fetchData(); }
function onPeriodFilter(value: string) { periodFilter.value = value; page.value = 1; fetchData(); }

async function fetchData() {
  loading.value = true;
  try {
    const [result, p] = await Promise.all([
      listRegistrations({
        page: page.value, pageSize,
        search: search.value,
        status: statusFilter.value || undefined,
        periodId: periodFilter.value || undefined,
      }),
      periods.value.length ? Promise.resolve(periods.value) : listPeriods(),
    ]);
    items.value = result.data;
    totalPages.value = result.totalPages;
    if (!periods.value.length) periods.value = p;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function goToPage(p: number) { page.value = p; fetchData(); }
function handleRowClick(row: Record<string, unknown>) { router.push(`/admin/registrations/${row.id}`); }

function rowBg(status: string) {
  switch (status) {
    case 'pending': return 'bg-yellow-50/60';
    case 'verified': return 'bg-blue-50/60';
    case 'accepted': return 'bg-emerald-50/60';
    case 'rejected': return 'bg-red-50/60';
    default: return '';
  }
}

function statusBadge(status: string) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'verified': return 'bg-blue-100 text-blue-700';
    case 'accepted': return 'bg-emerald-100 text-emerald-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-500';
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'pending': return 'Pending';
    case 'verified': return 'Verified';
    case 'accepted': return 'Diterima';
    case 'rejected': return 'Ditolak';
    default: return status;
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(fetchData);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">Registrasi PPDB</h1>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-moss)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          type="text"
          placeholder="Cari nama / NIK..."
          class="w-full rounded-lg border border-[var(--color-sand)] bg-white py-2 pl-10 pr-4 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
          @input="onSearch(($event.target as HTMLInputElement).value)"
        />
      </div>
      <select
        class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        @change="onPeriodFilter(($event.target as HTMLSelectElement).value)"
      >
        <option value="">Semua Periode</option>
        <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.title }} ({{ p.academic_year }})</option>
      </select>
      <select
        class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        @change="onStatusFilter(($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <!-- Desktop table -->
    <div class="hidden rounded-xl border border-[var(--color-sand)] bg-white lg:block">
      <DataTable :columns="columns" :rows="items" :loading="loading" empty-message="Belum ada registrasi" :selected-keys="[]" @row-click="handleRowClick">
        <template #cell-status="{ row }">
          <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusBadge((row as PpdbRegistration).status)]">
            {{ statusLabel((row as PpdbRegistration).status) }}
          </span>
        </template>
        <template #cell-created_at="{ value }">
          <span class="text-small text-[var(--color-moss)]">{{ formatDate(value as string) }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button
              class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]"
              @click.stop="router.push(`/admin/registrations/${(row as PpdbRegistration).id}`)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Mobile cards -->
    <div class="space-y-3 lg:hidden">
      <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
      <div v-else-if="items.length === 0" class="py-12 text-center text-[var(--color-moss)]">Belum ada registrasi</div>
      <div
        v-for="item in items"
        :key="item.id"
        :class="['cursor-pointer rounded-xl border border-[var(--color-sand)] bg-white p-4 transition-colors hover:bg-[var(--color-cream)]', rowBg(item.status)]"
        @click="router.push(`/admin/registrations/${item.id}`)"
      >
        <div class="mb-2 flex items-center justify-between">
          <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusBadge(item.status)]">
            {{ statusLabel(item.status) }}
          </span>
          <span class="text-xs text-[var(--color-moss)]">{{ formatDate(item.created_at) }}</span>
        </div>
        <p class="font-medium text-[var(--color-bark)]">{{ item.full_name }}</p>
        <p class="text-small text-[var(--color-moss)]">NIK: {{ item.nik }}</p>
        <p class="text-small text-[var(--color-moss)]">{{ item.previous_school }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        :disabled="page <= 1"
        class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50"
        @click="goToPage(page - 1)"
      >Sebelumnya</button>
      <span class="text-small text-[var(--color-moss)]">{{ page }} / {{ totalPages }}</span>
      <button
        :disabled="page >= totalPages"
        class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50"
        @click="goToPage(page + 1)"
      >Selanjutnya</button>
    </div>
  </div>
</template>
