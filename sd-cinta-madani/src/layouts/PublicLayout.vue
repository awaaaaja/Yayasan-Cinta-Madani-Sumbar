<script setup lang="ts">
import { RouterView } from "vue-router";
import PublicNavbar from "@/components/layout/PublicNavbar.vue";
import SiteFooter from "@/components/layout/SiteFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:bg-[var(--color-forest)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] focus:ring-offset-2">
      Lewati navigasi
    </a>
    <PublicNavbar />
    <RouterView id="main-content" class="flex-1" />
    <SiteFooter />
  </div>
</template>
