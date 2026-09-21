import { ref, onMounted, onUnmounted } from "vue";

export function useScrollReveal(options?: IntersectionObserverInit) {
  const element = ref<HTMLElement | null>(null);
  const isVisible = ref(false);

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!element.value) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      isVisible.value = true;
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element.value);
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { element, isVisible };
}
