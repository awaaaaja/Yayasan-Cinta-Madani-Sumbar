<script setup lang="ts">
import { ref } from 'vue';
import ConfirmDialog from './ConfirmDialog.vue';

defineProps<{
  loading: boolean;
  hasUnsavedChanges: boolean;
  status: string;
}>();

const emit = defineEmits<{
  save: [draft: boolean];
  publish: [];
  archive: [];
  delete: [];
}>();

const showDeleteConfirm = ref(false);
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-sand)] bg-white shadow-lg"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
      <div class="flex items-center gap-3">
        <span
          v-if="hasUnsavedChanges"
          class="inline-flex items-center gap-1.5 text-small text-[var(--color-gold)]"
        >
          <span class="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
          Belum disimpan
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="rounded-lg border border-red-200 px-4 py-2 text-small font-medium text-red-600 hover:bg-red-50"
          @click="showDeleteConfirm = true"
        >
          Hapus
        </button>

        <template v-if="status === 'draft'">
          <button
            :disabled="loading"
            class="rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)] disabled:opacity-50"
            @click="emit('save', true)"
          >
            Simpan Draft
          </button>
          <button
            :disabled="loading"
            class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50"
            @click="emit('publish')"
          >
            Terbitkan
          </button>
        </template>

        <template v-else-if="status === 'published'">
          <button
            :disabled="loading"
            class="rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)] disabled:opacity-50"
            @click="emit('save', false)"
          >
            Simpan
          </button>
          <button
            :disabled="loading"
            class="rounded-lg border border-amber-300 bg-white px-4 py-2 text-small font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
            @click="emit('archive')"
          >
            Arsipkan
          </button>
        </template>

        <template v-else-if="status === 'archived'">
          <button
            :disabled="loading"
            class="rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)] disabled:opacity-50"
            @click="emit('save', false)"
          >
            Simpan
          </button>
          <button
            :disabled="loading"
            class="rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)] disabled:opacity-50"
            @click="emit('save', true)"
          >
            Kembali ke Draft
          </button>
        </template>
      </div>
    </div>

    <ConfirmDialog
      :open="showDeleteConfirm"
      title="Hapus Item"
      message="Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan."
      confirm-label="Hapus"
      confirm-variant="danger"
      @confirm="emit('delete'); showDeleteConfirm = false"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
