<script setup lang="ts">
import { RouterLink } from 'vue-router';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-6 md:mb-8">
    <ol class="flex flex-wrap items-center gap-2 text-small text-text-500">
      <li>
        <RouterLink to="/" class="hover:text-green-700 transition-colors duration-[var(--motion-fast)]">
          Beranda
        </RouterLink>
      </li>
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-2"
      >
        <span class="text-text-500/50">/</span>
        <RouterLink
          v-if="item.href"
          :to="item.href"
          class="hover:text-green-700 transition-colors duration-[var(--motion-fast)]"
        >
          {{ item.label }}
        </RouterLink>
        <span
          v-else
          class="text-text-950 font-medium"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
