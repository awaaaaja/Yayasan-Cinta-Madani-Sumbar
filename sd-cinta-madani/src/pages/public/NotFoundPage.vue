<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center px-6">
      <p class="text-display text-primary mb-4">404</p>
      <h1 class="text-h2 text-text-950 mb-4">Halaman Tidak Ditemukan</h1>
      <p class="text-body text-muted mb-8 max-w-md mx-auto">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)] hover:bg-green-600 transition-colors"
      >
        Kembali ke Beranda
      </RouterLink>
    </div>
  </div>
</template>
