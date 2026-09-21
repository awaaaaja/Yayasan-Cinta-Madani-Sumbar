<script setup lang="ts">
import { RouterView } from "vue-router";
import PublicNavbar from "@/components/layout/PublicNavbar.vue";
import SiteFooter from "@/components/layout/SiteFooter.vue";
import MobileBottomNav from "@/components/layout/MobileBottomNav.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <PublicNavbar />
    <RouterView class="flex-1 pb-16 md:pb-0" />
    <SiteFooter />
    <MobileBottomNav />
  </div>
</template>
