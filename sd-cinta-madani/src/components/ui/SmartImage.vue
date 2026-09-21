<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { imagePlaceholders, type PlaceholderKey } from "@/config/images";

const props = withDefaults(
  defineProps<{
    src?: string | null;
    alt?: string;
    fallbackKey?: PlaceholderKey;
    aspect?: string;
    objectPosition?: string;
    loading?: "lazy" | "eager";
    overlay?: boolean;
    hoverScale?: boolean;
    rounded?: string;
  }>(),
  {
    alt: "",
    fallbackKey: "fallback",
    aspect: "4/3",
    objectPosition: "center",
    loading: "lazy",
    overlay: false,
    hoverScale: false,
    rounded: "var(--radius-md)",
  }
);

const imgRef = ref<HTMLImageElement | null>(null);
const hasError = ref(false);
const isLoaded = ref(false);

const resolvedSrc = computed(() => {
  if (hasError.value) return imagePlaceholders[props.fallbackKey];
  const src = props.src || imagePlaceholders[props.fallbackKey];
  // Handle array (e.g., heroSlides) — return first item
  if (Array.isArray(src)) return src[0];
  return src;
});

const aspectStyle = computed(() => ({
  aspectRatio: props.aspect,
}));

function onLoad() {
  isLoaded.value = true;
}

function onError() {
  hasError.value = true;
  isLoaded.value = true;
}

onMounted(() => {
  if (imgRef.value?.complete) {
    isLoaded.value = true;
  }
});
</script>

<template>
  <div
    class="relative overflow-hidden bg-surface-soft"
    :style="{ ...aspectStyle, borderRadius: rounded }"
  >
    <img
      ref="imgRef"
      :src="resolvedSrc"
      :alt="alt"
      :loading="loading"
      class="img-cover transition-transform duration-700"
      :class="[
        hoverScale && 'hover:scale-105',
        isLoaded ? 'opacity-100' : 'opacity-0',
      ]"
      :style="{ objectPosition }"
      @load="onLoad"
      @error="onError"
    />

    <!-- Loading shimmer -->
    <div
      v-if="!isLoaded"
      class="absolute inset-0 animate-pulse bg-gradient-to-r from-surface-soft via-line-light to-surface-soft"
    />

    <!-- Overlay -->
    <div
      v-if="overlay"
      class="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-primary-dark/10 to-transparent"
    />
  </div>
</template>
