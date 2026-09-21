<script setup lang="ts">
interface Props {
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  category?: string;
  publishedAt?: string;
  unitName?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
</script>

<template>
  <router-link
    :to="'/berita/' + slug"
    class="block"
    @click="emit('click')"
  >
    <article
      class="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] overflow-hidden transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
    >
      <div
        class="aspect-video w-full overflow-hidden"
        :class="coverImageUrl ? '' : 'bg-[var(--surface-soft)]'"
      >
        <img
          v-if="coverImageUrl"
          :src="coverImageUrl"
          :alt="title"
          class="object-cover w-full h-full"
        />
      </div>
      <div class="p-5">
        <span
          v-if="category"
          class="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 rounded-full px-2.5 py-0.5"
        >
          {{ category }}
        </span>
        <h2 class="text-base font-bold text-[var(--text)] mt-2 line-clamp-2">
          {{ title }}
        </h2>
        <p
          v-if="excerpt"
          class="text-sm text-[var(--muted)] mt-1.5 line-clamp-2"
        >
          {{ excerpt }}
        </p>
        <div class="flex justify-between items-center mt-3">
          <time
            v-if="publishedAt"
            :datetime="publishedAt"
            class="text-xs text-[var(--muted)]"
          >
            {{ formatDate(publishedAt) }}
          </time>
          <span class="text-xs font-semibold text-[var(--primary)]">
            Baca →
          </span>
        </div>
      </div>
    </article>
  </router-link>
</template>
