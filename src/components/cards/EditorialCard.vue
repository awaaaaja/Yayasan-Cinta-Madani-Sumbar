<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

withDefaults(defineProps<Props>(), {
  description: '',
  imageUrl: '',
  icon: '',
  ctaLabel: 'Selengkapnya',
  ctaUrl: '',
});

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <router-link
    v-if="ctaUrl"
    :to="ctaUrl"
    custom
    v-slot="{ navigate }"
  >
    <article
      role="link"
      tabindex="0"
      class="rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-6 flex flex-col cursor-pointer hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      @click="emit('click'); navigate($event)"
      @keydown.enter="emit('click')"
    >
      <span
        v-if="icon"
        class="text-3xl mb-3"
      >
        {{ icon }}
      </span>
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="title"
        class="rounded-[var(--radius-sm)] aspect-video object-cover mb-4"
      />
      <h2 class="text-xl font-bold text-[var(--text)]">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="text-sm text-[var(--muted)] mt-2 line-clamp-3 flex-1"
      >
        {{ description }}
      </p>
      <span class="mt-4 text-sm font-semibold text-[var(--primary)]">
        {{ ctaLabel }} →
      </span>
    </article>
  </router-link>
  <article
    v-else
    class="rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-6 flex flex-col cursor-default transition-shadow"
  >
    <span
      v-if="icon"
      class="text-3xl mb-3"
    >
      {{ icon }}
    </span>
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="title"
      class="rounded-[var(--radius-sm)] aspect-video object-cover mb-4"
    />
    <h2 class="text-xl font-bold text-[var(--text)]">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="text-sm text-[var(--muted)] mt-2 line-clamp-3 flex-1"
    >
      {{ description }}
    </p>
    <span
      v-if="ctaLabel"
      class="mt-4 text-sm font-semibold text-[var(--primary)]"
    >
      {{ ctaLabel }}
    </span>
  </article>
</template>
