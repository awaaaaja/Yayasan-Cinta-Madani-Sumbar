<script setup lang="ts">
defineProps<{
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}>();
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label || $slots.label" class="block text-small font-semibold text-[var(--color-bark)]">
      <slot name="label">
        {{ label }}
      </slot>
      <span v-if="required" class="ml-0.5 text-red-500">*</span>
    </label>
    <p v-if="hint && !error" class="text-xs text-[var(--color-moss)]">{{ hint }}</p>
    <slot />
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>
