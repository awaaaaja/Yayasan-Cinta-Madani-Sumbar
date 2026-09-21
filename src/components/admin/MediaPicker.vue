<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '../../services/supabase';

const props = defineProps<{
  modelValue: string;
  bucket: string;
  folder: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [url: string];
  remove: [];
}>();

const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function openPicker() {
  fileInput.value?.click();
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  isUploading.value = true;
  try {
    const ext = file.name.split('.').pop();
    const path = `${props.folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(props.bucket).upload(path, file, {
      contentType: file.type,
      upsert: true,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(props.bucket).getPublicUrl(path);
    emit('update:modelValue', data.publicUrl);
  } catch (err) {
    console.error('Upload failed:', err);
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
}

function removeImage() {
  emit('remove');
}
</script>

<template>
  <div class="space-y-2">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />

    <div v-if="modelValue" class="relative inline-block">
      <img
        :src="modelValue"
        alt="Preview"
        class="h-32 w-32 rounded-lg border border-[var(--color-sand)] object-cover"
      />
      <button
        type="button"
        class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
        @click="removeImage"
      >
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="flex gap-2">
      <button
        type="button"
        :disabled="isUploading"
        class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)] disabled:opacity-50"
        @click="openPicker"
      >
        <svg v-if="!isUploading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <svg v-else class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ isUploading ? 'Mengunggah...' : 'Pilih Gambar' }}
      </button>
      <button
        v-if="modelValue"
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-small font-medium text-red-600 hover:bg-red-50"
        @click="removeImage"
      >
        Hapus
      </button>
    </div>
  </div>
</template>
