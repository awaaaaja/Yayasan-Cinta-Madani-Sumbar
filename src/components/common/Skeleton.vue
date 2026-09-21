<script setup lang="ts">
defineProps<{
  count?: number;
}>();
</script>

<template>
  <div class="flex flex-col gap-4 animate-pulse">
    <div class="h-4 bg-sand-100 rounded w-1/4" />
    <div class="h-8 bg-sand-100 rounded w-3/4" />
    <div v-if="count" class="flex gap-4">
      <div
        v-for="i in count"
        :key="i"
        class="h-32 bg-sand-100 rounded flex-1"
      />
    </div>
  </div>
</template>
