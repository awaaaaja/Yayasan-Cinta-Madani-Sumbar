<script setup lang="ts">
defineProps<{
  as?: string;
  padding?: string;
}>();
</script>

<template>
  <component
    :is="as || 'section'"
    :class="[
      'py-[72px] md:py-[96px] lg:py-[120px]',
      padding,
    ]"
  >
    <div class="container-site">
      <slot />
    </div>
  </component>
</template>
