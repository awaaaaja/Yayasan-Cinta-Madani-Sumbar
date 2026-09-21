<script setup lang="ts">
defineProps<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  class?: string;
}>();
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading || 'lazy'"
    :class="['object-cover', $attrs.class]"
  />
</template>
