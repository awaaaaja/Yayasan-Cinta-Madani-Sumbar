<script setup lang="ts">
defineProps<{
  title: string;
  description?: string | null;
  image?: string | null;
  eyebrow?: string;
}>();
</script>

<template>
  <section class="relative bg-primary-dark overflow-hidden min-h-[280px] md:min-h-[340px] flex items-end">
    <!-- Background Image with gradient -->
    <div v-if="image" class="absolute inset-0 z-0">
      <img
        :src="image"
        alt=""
        class="w-full h-full object-cover opacity-40"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/60 to-transparent" />
    </div>

    <!-- Solid fallback gradient -->
    <div v-else class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light opacity-90" />
    </div>

    <!-- Content -->
    <div class="relative z-10 container-site w-full py-12 md:py-16 lg:py-20">
      <p v-if="eyebrow" class="text-eyebrow text-accent mb-3">
        {{ eyebrow }}
      </p>
      <h1 class="text-h1 md:text-display text-cream-100 max-w-[680px] mb-3 leading-[1.1]">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-body-lg text-cream-100/60 max-w-[520px]"
      >
        {{ description }}
      </p>
    </div>

    <!-- Decorative element -->
    <div class="absolute bottom-0 right-0 w-1/3 h-full opacity-[0.03] hidden lg:block pointer-events-none">
      <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="ph-pattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#ph-pattern)" />
      </svg>
    </div>
  </section>
</template>
