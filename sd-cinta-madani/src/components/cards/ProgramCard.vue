<script setup lang="ts">
interface Props {
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  icon?: string;
  featured?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <router-link
    :to="'/program/' + slug"
    class="block"
    @click="emit('click')"
  >
    <article
      :class="[
        'rounded-[var(--radius-md)] bg-[var(--surface)] overflow-hidden transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
        featured ? 'ring-2 ring-[var(--accent)]' : 'border border-[var(--line)]',
      ]"
    >
      <div class="relative h-44 overflow-hidden">
        <span
          v-if="featured"
          class="absolute top-3 right-3 bg-[var(--accent)] text-white text-xs font-semibold px-2 py-0.5 rounded-full"
        >
          Unggulan
        </span>
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="title"
          class="w-full h-full object-cover"
        />
        <div
          v-else-if="icon"
          class="flex items-center justify-center h-full bg-[var(--surface-soft)] text-4xl"
        >
          {{ icon }}
        </div>
        <div
          v-else
          class="bg-gradient-to-br from-[var(--surface-soft)] to-[var(--primary)] w-full h-full"
        />
      </div>
      <div class="p-5">
        <h2 class="text-base font-bold text-[var(--text)]">
          {{ title }}
        </h2>
        <p
          v-if="excerpt"
          class="text-sm text-[var(--muted)] mt-1 line-clamp-2"
        >
          {{ excerpt }}
        </p>
        <span class="text-xs font-semibold text-[var(--primary)] mt-3 inline-block">
          Lihat Program →
        </span>
      </div>
    </article>
  </router-link>
</template>
