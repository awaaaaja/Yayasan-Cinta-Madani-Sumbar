<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/components/admin/DataTable.vue';
import MobileDataCard from '@/components/admin/MobileDataCard.vue';
import { listPages } from '@/services/admin/pages.admin.service';
import type { Page } from '@/types';

document.title = 'Manajemen Halaman';

const router = useRouter();
const items = ref<Page[]>([]);
const loading = ref(true);
const page_num = ref(1);
const totalPages = ref(1);
const pageSize = 10;

const columns = [
  { key: 'title', label: 'Judul', sortable: true },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
];

const mobileFields = [
  { key: 'slug', label: 'Slug' },
];

async function fetchItems() {
  loading.value = true;
  try {
    const result = await listPages({ page: page_num.value, pageSize });
    items.value = result.data;
    totalPages.value = result.totalPages;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function goToPage(p: number) { page_num.value = p; fetchItems(); }
function handleRowClick(row: Record<string, unknown>) { router.push(`/admin/pages/${row.id}`); }

onMounted(fetchItems);
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-[var(--color-bark)]">Halaman</h1>

    <div class="hidden rounded-xl border border-[var(--color-sand)] bg-white lg:block">
      <DataTable :columns="columns" :rows="items" :loading="loading" empty-message="Belum ada halaman" :selected-keys="[]" @row-click="handleRowClick">
        <template #cell-status="{ value }">
          <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', value === 'published' ? 'bg-green-100 text-green-700' : value === 'archived' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600']">{{ value }}</span>
        </template>
        <template #actions="{ row }">
          <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click.stop="router.push(`/admin/pages/${row.id}`)">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
        </template>
      </DataTable>
    </div>

    <div class="space-y-3 lg:hidden">
      <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
      <div v-else-if="items.length === 0" class="py-12 text-center text-[var(--color-moss)]">Belum ada halaman</div>
      <MobileDataCard v-for="item in items" :key="item.id" :item="item" :fields="mobileFields" status-field="status" @click="router.push(`/admin/pages/${item.id}`)" @edit="router.push(`/admin/pages/${item.id}`)" />
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button :disabled="page_num <= 1" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page_num - 1)">Sebelumnya</button>
      <span class="text-small text-[var(--color-moss)]">{{ page_num }} / {{ totalPages }}</span>
      <button :disabled="page_num >= totalPages" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page_num + 1)">Selanjutnya</button>
    </div>
  </div>
</template>
