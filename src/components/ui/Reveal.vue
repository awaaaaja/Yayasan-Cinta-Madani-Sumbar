<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";

const props = withDefaults(
  defineProps<{
    delay?: number;
    duration?: number;
    y?: number;
    x?: number;
    scale?: number;
    clipPath?: boolean;
    once?: boolean;
  }>(),
  {
    delay: 0,
    duration: 600,
    y: 24,
    x: 0,
    scale: 1,
    clipPath: false,
    once: true,
  }
);

const { element, isVisible } = useScrollReveal({ threshold: 0.15 });
void element;

const style = ref({});

function updateStyle() {
  if (isVisible.value) {
    style.value = {
      opacity: 1,
      transform: "translateY(0) translateX(0) scale(1)",
      clipPath: props.clipPath ? "inset(0 0 0 0)" : undefined,
      transition: `opacity ${props.duration}ms var(--ease-out) ${props.delay}ms, transform ${props.duration}ms var(--ease-out) ${props.delay}ms${props.clipPath ? `, clip-path ${props.duration}ms var(--ease-out) ${props.delay}ms` : ""}`,
    };
  } else {
    style.value = {
      opacity: 0,
      transform: `translateY(${props.y}px) translateX(${props.x}px) scale(${props.scale})`,
      clipPath: props.clipPath ? "inset(0 0 100% 0)" : undefined,
      transition: "none",
    };
  }
}

onMounted(updateStyle);
watch(isVisible, updateStyle);
</script>

<template>
  <div ref="element" :style>
    <slot />
  </div>
</template>
