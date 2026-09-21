<script setup lang="ts">
import { ref } from 'vue';
import MediaPicker from './MediaPicker.vue';

interface SeoValue {
  title: string;
  description: string;
  ogImage: string;
}

defineProps<{
  modelValue: SeoValue;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: SeoValue];
}>();

const isOpen = ref(false);
</script>

<template>
  <div class="rounded-xl border border-[var(--color-sand)]">
    <button
      class="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-[var(--color-bark)] hover:bg-[var(--color-cream)]/50"
      @click="isOpen = !isOpen"
    >
      <span>SEO & Meta</span>
      <svg
        :class="['h-5 w-5 transition-transform', isOpen && 'rotate-180']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-show="isOpen" class="space-y-4 border-t border-[var(--color-sand)] px-4 py-4">
      <div class="space-y-1.5">
        <label class="block text-small font-semibold text-[var(--color-bark)]">SEO Title</label>
        <input
          type="text"
          :value="modelValue.title"
          placeholder="Judul untuk mesin pencari"
          maxlength="60"
          class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
          @input="emit('update:modelValue', { ...modelValue, title: ($event.target as HTMLInputElement).value })"
        />
        <p class="text-xs text-[var(--color-moss)]">{{ modelValue.title.length }}/60 karakter</p>
      </div>

      <div class="space-y-1.5">
        <label class="block text-small font-semibold text-[var(--color-bark)]">SEO Description</label>
        <textarea
          :value="modelValue.description"
          placeholder="Deskripsi untuk mesin pencari"
          maxlength="160"
          rows="3"
          class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
          @input="emit('update:modelValue', { ...modelValue, description: ($event.target as HTMLTextAreaElement).value })"
        />
        <p class="text-xs text-[var(--color-moss)]">{{ modelValue.description.length }}/160 karakter</p>
      </div>

      <div class="space-y-1.5">
        <label class="block text-small font-semibold text-[var(--color-bark)]">OG Image</label>
        <MediaPicker
          :model-value="modelValue.ogImage"
          bucket="media"
          folder="og"
          @update:model-value="emit('update:modelValue', { ...modelValue, ogImage: $event })"
          @remove="emit('update:modelValue', { ...modelValue, ogImage: '' })"
        />
      </div>
    </div>
  </div>
</template>
