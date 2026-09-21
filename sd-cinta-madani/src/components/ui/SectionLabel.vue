<script setup lang="ts">
defineProps<{
  label: string;
  index?: string;
}>();
</script>

<template>
  <div class="flex items-center gap-3 mb-4">
    <span v-if="index" class="text-eyebrow text-primary font-semibold tabular-nums">
      {{ index }}
    </span>
    <span class="h-px w-8 bg-primary/30" />
    <span class="text-eyebrow text-muted">
      {{ label }}
    </span>
  </div>
</template>
