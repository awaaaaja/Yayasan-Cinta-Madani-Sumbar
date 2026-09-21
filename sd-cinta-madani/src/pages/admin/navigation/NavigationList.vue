<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { listNavigationItems, createNavigationItem, updateNavigationItem, deleteNavigationItem } from '@/services/admin/navigation.admin.service';
import { useErrorToast } from '@/composables/useErrorToast';
import type { NavigationItem } from '@/types';

document.title = 'Manajemen Navigasi';

const items = ref<NavigationItem[]>([]);
const loading = ref(true);
const saving = ref(false);
const deleteId = ref<string | null>(null);
const showDeleteDialog = ref(false);
const showForm = ref(false);
const editingItem = ref<Partial<NavigationItem>>({});
const { showError } = useErrorToast();

const defaultItem: Partial<NavigationItem> = {
  label: '',
  url: '',
  sort_order: 0,
  is_visible: true,
};

function openCreate() {
  editingItem.value = { ...defaultItem, sort_order: items.value.length + 1 };
  showForm.value = true;
}

function openEdit(item: NavigationItem) {
  editingItem.value = { ...item };
  showForm.value = true;
}

function confirmDelete(id: string) {
  deleteId.value = id;
  showDeleteDialog.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    if (editingItem.value.id) {
      await updateNavigationItem(editingItem.value.id, editingItem.value);
    } else {
      await createNavigationItem(editingItem.value);
    }
    showForm.value = false;
    fetchItems();
  } catch (e) { console.error(e); showError('Gagal menyimpan data'); } finally { saving.value = false; }
}

async function handleDelete() {
  if (!deleteId.value) return;
  try {
    await deleteNavigationItem(deleteId.value);
    showDeleteDialog.value = false;
    deleteId.value = null;
    fetchItems();
  } catch (e) { console.error(e); showError('Gagal menghapus data'); }
}

async function fetchItems() {
  loading.value = true;
  try {
    const result = await listNavigationItems();
    items.value = result.data;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

onMounted(fetchItems);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">Navigasi</h1>
      <button class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)]" @click="openCreate">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Tambah Item
      </button>
    </div>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <div v-else-if="items.length === 0" class="py-12 text-center text-[var(--color-moss)]">Belum ada item navigasi</div>

    <div v-else class="rounded-xl border border-[var(--color-sand)] bg-white">
      <ul class="divide-y divide-[var(--color-sand)]">
        <li v-for="item in items" :key="item.id" class="flex items-center justify-between px-4 py-3">
          <div class="min-w-0 flex-1">
            <p class="truncate text-body font-medium text-[var(--color-bark)]">{{ item.label }}</p>
            <p class="text-xs text-[var(--color-moss)]">{{ item.url }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', item.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
              {{ item.is_visible ? 'Visible' : 'Hidden' }}
            </span>
            <span class="text-xs text-[var(--color-moss)]">Order: {{ item.sort_order }}</span>
            <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="openEdit(item)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button class="rounded p-1.5 text-red-500 hover:bg-red-50" @click="confirmDelete(item.id)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 class="mb-4 text-lg font-semibold text-[var(--color-bark)]">
          {{ editingItem.id ? 'Edit Item' : 'Tambah Item' }}
        </h2>
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-small font-semibold text-[var(--color-bark)]">Label</label>
            <input v-model="editingItem.label" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Beranda" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-small font-semibold text-[var(--color-bark)]">URL</label>
            <input v-model="editingItem.url" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="/" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-small font-semibold text-[var(--color-bark)]">Urutan</label>
            <input v-model.number="editingItem.sort_order" type="number" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </div>
          <label class="flex items-center gap-2">
            <input v-model="editingItem.is_visible" type="checkbox" class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)] focus:ring-[var(--color-moss)]" />
            <span class="text-body text-[var(--color-bark)]">Tampilkan di navigasi</span>
          </label>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button class="rounded-lg border border-[var(--color-sand)] px-4 py-2 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)]" @click="showForm = false">Batal</button>
          <button :disabled="saving" class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="handleSave">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Item" message="Apakah Anda yakin ingin menghapus item navigasi ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
