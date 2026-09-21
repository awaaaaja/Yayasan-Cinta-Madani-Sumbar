import { ref } from "vue";

const toasts = ref<{ id: number; message: string; type: "error" | "success" }[]>([]);
let nextId = 0;

export function useErrorToast() {
  function showError(message: string) {
    const id = nextId++;
    toasts.value.push({ id, message, type: "error" });
    setTimeout(() => dismiss(id), 5000);
  }

  function showSuccess(message: string) {
    const id = nextId++;
    toasts.value.push({ id, message, type: "success" });
    setTimeout(() => dismiss(id), 3000);
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { toasts, showError, showSuccess, dismiss };
}
