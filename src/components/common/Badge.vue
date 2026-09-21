<script setup lang="ts">
defineProps<{
  variant?: "default" | "success" | "warning" | "info" | "neutral";
}>();
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full text-small font-medium',
      variant === 'success' && 'bg-green-100 text-green-700',
      variant === 'warning' && 'bg-amber-100 text-amber-700',
      variant === 'info' && 'bg-blue-100 text-blue-700',
      variant === 'neutral' && 'bg-sand-100 text-text-700',
      (!variant || variant === 'default') && 'bg-green-100 text-green-700',
    ]"
  >
    <slot />
  </span>
</template>
