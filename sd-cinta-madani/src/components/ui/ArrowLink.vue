<script setup lang="ts">
defineProps<{
  to?: string;
  label?: string;
  white?: boolean;
}>();
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    class="group inline-flex items-center gap-2 font-semibold text-sm transition-colors duration-300"
    :class="white ? 'text-cream-100 hover:text-accent' : 'text-primary hover:text-primary-dark'"
  >
    <span>{{ label || 'Selengkapnya' }}</span>
    <svg
      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </component>
</template>
