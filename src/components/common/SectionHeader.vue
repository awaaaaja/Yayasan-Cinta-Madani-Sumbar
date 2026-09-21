<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  align?: "left" | "center";
}>();
</script>

<template>
  <div
    :class="[
      'flex flex-col gap-6 md:gap-8',
      align === 'center' ? 'items-center text-center' : 'items-start text-left',
    ]"
  >
    <span v-if="eyebrow" class="text-eyebrow text-green-700">
      {{ eyebrow }}
    </span>
    <h2 v-if="title" class="text-h2 text-text-950">
      {{ title }}
    </h2>
    <p v-if="description" class="text-body-large text-text-700 max-w-[620px]">
      {{ description }}
    </p>
    <a
      v-if="ctaLabel && ctaUrl"
      :href="ctaUrl"
      class="inline-flex items-center gap-2 text-green-700 font-semibold text-body group"
    >
      {{ ctaLabel }}
      <span
        class="inline-block transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  </div>
</template>
