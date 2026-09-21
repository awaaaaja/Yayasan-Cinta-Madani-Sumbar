<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  disabled?: boolean;
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)]',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Size
      size === 'sm' && 'h-10 px-5 text-small',
      size === 'lg' && 'h-14 px-8 text-body-large',
      (!size || size === 'md') && 'h-12 px-6 text-body',
      // Variant
      variant === 'secondary' && 'bg-transparent border-2 border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-cream-100',
      variant === 'ghost' && 'bg-transparent text-forest-900 hover:bg-green-100',
      (!variant || variant === 'primary') && 'bg-green-700 text-white hover:bg-green-600 active:bg-forest-800',
    ]"
    @click="(e: MouseEvent) => $emit('click', e)"
  >
    <slot />
  </component>
</template>
