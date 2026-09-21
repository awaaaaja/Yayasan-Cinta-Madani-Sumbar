<script setup lang="ts">
import { ref, onMounted } from 'vue';
;
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { listMessages, deleteMessage, markAsRead, markAsReplied, archiveMessage } from '@/services/admin/contacts.admin.service';
import type { ContactMessage } from '@/types';

document.title = 'Pesan Kontak';

;
const items = ref<ContactMessage[]>([]);
const loading = ref(true);
const statusFilter = ref('');
const page = ref(1);
const totalPages = ref(1);
const pageSize = 10;
const deleteId = ref<string | null>(null);
const showDeleteDialog = ref(false);
const selectedMessage = ref<ContactMessage | null>(null);

async function fetchItems() {
  loading.value = true;
  try {
    const result = await listMessages({ page: page.value, pageSize, status: statusFilter.value || undefined });
    items.value = result.data;
    totalPages.value = result.totalPages;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function onStatusFilter(value: string) { statusFilter.value = value; page.value = 1; fetchItems(); }
function goToPage(p: number) { page.value = p; fetchItems(); }

async function viewMessage(msg: ContactMessage) {
  selectedMessage.value = msg;
  if (msg.status === 'unread') {
    await markAsRead(msg.id);
    msg.status = 'read';
  }
}

async function handleMarkReplied(id: string) {
  try { await markAsReplied(id); selectedMessage.value = null; fetchItems(); } catch (e) { console.error(e); }
}

async function handleArchive(id: string) {
  try { await archiveMessage(id); selectedMessage.value = null; fetchItems(); } catch (e) { console.error(e); }
}

function confirmDelete(id: string) { deleteId.value = id; showDeleteDialog.value = true; }

async function handleDelete() {
  if (!deleteId.value) return;
  try { await deleteMessage(deleteId.value); showDeleteDialog.value = false; deleteId.value = null; selectedMessage.value = null; fetchItems(); } catch (e) { console.error(e); }
}

onMounted(fetchItems);
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-[var(--color-bark)]">Pesan Kontak</h1>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" @change="onStatusFilter(($event.target as HTMLSelectElement).value)">
        <option value="">Semua Status</option>
        <option value="unread">Belum Dibaca</option>
        <option value="read">Dibaca</option>
        <option value="replied">Dibalas</option>
        <option value="archived">Diarsipkan</option>
      </select>
    </div>

    <div v-if="selectedMessage" class="rounded-xl border border-[var(--color-sand)] bg-white p-6 space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-lg font-bold text-[var(--color-bark)]">{{ selectedMessage.subject }}</h2>
          <p class="text-small text-[var(--color-moss)]">{{ selectedMessage.name }} &lt;{{ selectedMessage.email }}&gt;</p>
          <p class="text-xs text-[var(--color-moss)]">{{ new Date(selectedMessage.created_at).toLocaleString('id-ID') }}</p>
        </div>
        <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="selectedMessage = null">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <p v-if="selectedMessage.phone" class="text-small text-[var(--color-bark)]">Telepon: {{ selectedMessage.phone }}</p>
      <div class="whitespace-pre-wrap text-body text-[var(--color-bark)] border-t border-[var(--color-sand)] pt-4">{{ selectedMessage.message }}</div>
      <div class="flex gap-2 border-t border-[var(--color-sand)] pt-4">
        <a v-if="selectedMessage.email" :href="`mailto:${selectedMessage.email}`" class="inline-flex items-center gap-1 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)]">
          Balas Email
        </a>
        <button class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)]" @click="handleMarkReplied(selectedMessage.id)">Tandai Dibalas</button>
        <button class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)]" @click="handleArchive(selectedMessage.id)">Arsipkan</button>
        <button class="rounded-lg border border-red-200 bg-white px-3 py-2 text-small font-medium text-red-600 hover:bg-red-50" @click="confirmDelete(selectedMessage.id)">Hapus</button>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
      <div v-else-if="items.length === 0" class="py-12 text-center text-[var(--color-moss)]">Tidak ada pesan</div>
      <div
        v-for="msg in items"
        :key="msg.id"
        :class="['rounded-xl border bg-white p-4 cursor-pointer transition-colors', msg.status === 'unread' ? 'border-[var(--color-forest)] bg-[var(--color-cream)]/30' : 'border-[var(--color-sand)] hover:bg-[var(--color-cream)]/50']"
        @click="viewMessage(msg)"
      >
        <div class="flex items-start justify-between">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', msg.status === 'unread' ? 'bg-[var(--color-forest)] text-white' : msg.status === 'read' ? 'bg-gray-100 text-gray-600' : msg.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700']">{{ msg.status }}</span>
              <h3 class="font-semibold text-[var(--color-bark)] truncate">{{ msg.subject }}</h3>
            </div>
            <p class="mt-1 text-small text-[var(--color-moss)]">{{ msg.name }} &lt;{{ msg.email }}&gt;</p>
            <p class="mt-1 text-small text-[var(--color-bark)]/70 truncate">{{ msg.message }}</p>
          </div>
          <span class="ml-4 shrink-0 text-xs text-[var(--color-moss)]">{{ new Date(msg.created_at).toLocaleDateString('id-ID') }}</span>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1 && !selectedMessage" class="flex items-center justify-center gap-2">
      <button :disabled="page <= 1" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page - 1)">Sebelumnya</button>
      <span class="text-small text-[var(--color-moss)]">{{ page }} / {{ totalPages }}</span>
      <button :disabled="page >= totalPages" class="rounded-lg border border-[var(--color-sand)] px-3 py-1.5 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)] disabled:opacity-50" @click="goToPage(page + 1)">Selanjutnya</button>
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Pesan" message="Apakah Anda yakin ingin menghapus pesan ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
