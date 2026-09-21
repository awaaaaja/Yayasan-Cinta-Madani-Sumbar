<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="w-16 h-16 mb-6 rounded-full bg-sand-100 flex items-center justify-center">
      <svg
        class="w-8 h-8 text-text-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    </div>
    <h3 class="text-h4 text-text-950 mb-2">
      {{ title || 'Belum ada konten' }}
    </h3>
    <p class="text-body text-text-500 max-w-md">
      {{ description || 'Konten akan segera tersedia. Silakan kunjungi kembali nanti.' }}
    </p>
  </div>
</template>
