<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "accent" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    to?: string;
    href?: string;
    icon?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    icon: false,
  }
);

const variants = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md",
  secondary: "bg-surface text-text border border-line hover:bg-surface-soft hover:border-primary/20",
  accent: "bg-accent text-white hover:bg-accent-light shadow-sm hover:shadow-md",
  ghost: "bg-transparent text-text hover:bg-surface-soft",
  outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white",
};

const sizes = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-sm gap-2",
  lg: "px-8 py-4 text-base gap-2.5",
};
</script>

<template>
  <component
    :is="to ? 'RouterLink' : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    class="group inline-flex items-center justify-center font-semibold rounded-[var(--radius-sm)] transition-all duration-300 ease-out cursor-pointer select-none whitespace-nowrap"
    :class="[variants[variant], sizes[size], icon && '!px-3']"
  >
    <slot />
  </component>
</template>
