<script setup lang="ts">
interface Props {
  name: string;
  slug: string;
  shortDescription?: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <router-link
    :to="'/unit-pendidikan/' + slug"
    class="block"
    @click="emit('click')"
  >
    <article
      class="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
    >
      <div class="relative h-48 overflow-hidden">
        <img
          v-if="heroImageUrl"
          :src="heroImageUrl"
          :alt="name"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          v-else
          class="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]"
        />
        <img
          v-if="logoUrl"
          :src="logoUrl"
          :alt="name"
          class="absolute bottom-3 left-3 w-12 h-12 rounded-full bg-[var(--surface)] p-1 shadow-sm object-contain"
        />
      </div>
      <div class="p-5">
        <h2 class="text-base font-bold text-[var(--text)]">
          {{ name }}
        </h2>
        <p
          v-if="shortDescription"
          class="text-sm text-[var(--muted)] mt-1 line-clamp-2"
        >
          {{ shortDescription }}
        </p>
        <span class="text-xs font-semibold text-[var(--primary)] mt-3 inline-block">
          Selengkapnya →
        </span>
      </div>
    </article>
  </router-link>
</template>
