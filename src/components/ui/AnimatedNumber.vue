<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    target: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
  }>(),
  {
    duration: 1800,
    prefix: "",
    suffix: "",
    decimals: 0,
  }
);

const current = ref(0);
let animationFrame: number | null = null;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function animate() {
  const safeTarget = Number(props.target) || 0;
  if (safeTarget === 0 && props.decimals === 0) {
    current.value = 0;
    return;
  }
  const startTime = performance.now();

  function tick(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / props.duration, 1);
    current.value = Math.round(easeOutCubic(progress) * safeTarget * 10 ** props.decimals) / 10 ** props.decimals;
    if (progress < 1) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  animationFrame = requestAnimationFrame(tick);
}

onMounted(() => {
  animate();
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<template>
  <span class="tabular-nums">
    {{ prefix }}{{ current.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) }}{{ suffix }}
  </span>
</template>
