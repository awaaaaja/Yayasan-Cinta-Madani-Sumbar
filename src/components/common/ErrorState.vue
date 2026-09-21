<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="w-16 h-16 mb-6 rounded-full bg-red-50 flex items-center justify-center">
      <svg
        class="w-8 h-8 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </div>
    <h3 class="text-h4 text-text-950 mb-2">
      {{ title || 'Terjadi kesalahan' }}
    </h3>
    <p class="text-body text-text-500 max-w-md mb-6">
      {{ message || 'Gagal memuat data. Silakan coba lagi.' }}
    </p>
    <button
      v-if="onRetry"
      class="h-12 px-6 bg-green-700 text-white font-semibold rounded-[10px] hover:bg-green-600 transition-colors duration-[var(--motion-fast)]"
      @click="onRetry"
    >
      Coba Lagi
    </button>
  </div>
</template>
