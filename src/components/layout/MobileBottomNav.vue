<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
  { label: "Beranda", url: "/", icon: "home" },
  { label: "Tentang", url: "/tentang", icon: "info" },
  { label: "Program", url: "/program", icon: "book" },
  { label: "Berita", url: "/berita", icon: "news" },
  { label: "Menu", url: "__menu__", icon: "menu" },
];

function isActive(url: string): boolean {
  if (url === "/") return route.path === "/";
  return route.path.startsWith(url);
}

function emitMenuToggle() {
  window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/95 backdrop-blur-md border-t border-line-light safe-area-bottom"
    role="navigation"
    aria-label="Navigasi mobile"
  >
    <div class="flex items-center justify-around h-16">
      <template v-for="item in navItems" :key="item.url">
        <!-- Menu button (triggers MobileMenu) -->
        <button
          v-if="item.url === '__menu__'"
          class="flex flex-col items-center justify-center gap-0.5 w-16 h-full text-muted transition-colors duration-200 active:text-primary"
          aria-label="Buka menu"
          @click="emitMenuToggle"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="text-[10px] font-medium leading-none">Menu</span>
        </button>

        <!-- Regular nav links -->
        <router-link
          v-else
          :to="item.url"
          class="flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors duration-200"
          :class="isActive(item.url) ? 'text-primary' : 'text-muted active:text-primary'"
        >
          <!-- Home -->
          <svg v-if="item.icon === 'home'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
          </svg>
          <!-- Info -->
          <svg v-else-if="item.icon === 'info'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <!-- Book -->
          <svg v-else-if="item.icon === 'book'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <!-- News -->
          <svg v-else-if="item.icon === 'news'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
          <!-- Active indicator dot -->
          <div
            v-if="isActive(item.url)"
            class="w-1 h-1 rounded-full bg-primary mt-0.5"
          />
        </router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
