import { onUnmounted, watch, nextTick } from "vue";

export function useFocusTrap(
  isOpen: { value: boolean },
  containerRef: { value: HTMLElement | null }
) {
  let previouslyFocused: HTMLElement | null = null;

  function getFocusableElements(): HTMLElement[] {
    if (!containerRef.value) return [];
    return Array.from(
      containerRef.value.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== "Tab" || !containerRef.value) return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  watch(isOpen, async (open) => {
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      await nextTick();
      const focusable = getFocusableElements();
      if (focusable.length > 0) focusable[0].focus();
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeydown);
      previouslyFocused?.focus();
    }
  });

  onUnmounted(() => {
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeydown);
  });
}
