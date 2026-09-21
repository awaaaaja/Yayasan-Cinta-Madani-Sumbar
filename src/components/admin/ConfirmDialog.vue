<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning';
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const confirmBtn = ref<HTMLButtonElement | null>(null);

watch(
  () => props.open,
  async (val) => {
    if (val) {
      await nextTick();
      confirmBtn.value?.focus();
    }
  }
);

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('cancel');
  if (e.key === 'Enter' && props.open) emit('confirm');
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @keydown="onKeydown"
      @click.self="emit('cancel')"
    >
      <div
        class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <h2 class="mb-2 text-lg font-bold text-[var(--color-bark)]">{{ title }}</h2>
        <p class="mb-6 text-body text-[var(--color-moss)]">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button
            class="rounded-lg border border-[var(--color-sand)] px-4 py-2 text-small font-medium text-[var(--color-bark)] hover:bg-[var(--color-cream)]"
            @click="emit('cancel')"
          >
            Batal
          </button>
          <button
            ref="confirmBtn"
            :class="[
              'rounded-lg px-4 py-2 text-small font-medium text-white',
              confirmVariant === 'warning'
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-red-600 hover:bg-red-700',
            ]"
            @click="emit('confirm')"
          >
            {{ confirmLabel || 'Konfirmasi' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
