<script setup lang="ts">
defineProps<{
  href: string;
  label?: string;
}>();
</script>

<template>
  <a
    :href="href"
    class="inline-flex items-center gap-2 text-green-700 font-semibold group"
  >
    <slot>
      {{ label }}
    </slot>
    <span
      class="inline-block transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1"
    >
      &rarr;
    </span>
  </a>
</template>
