<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getNavigationItems, getSiteSettings } from '@/services/settings.service'
import MobileMenu from './MobileMenu.vue'

const navItems = ref<{ label: string; url: string }[]>([])
const schoolName = ref('')
const logoUrl = ref('')
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 30
}

function onToggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

onMounted(async () => {
  const [nav, settings] = await Promise.all([
    getNavigationItems(),
    getSiteSettings(),
  ])
  navItems.value = nav
  if (settings) {
    schoolName.value = settings.school_name ?? ''
    logoUrl.value = settings.logo_url ?? ''
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('toggle-mobile-menu', onToggleMobileMenu)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('toggle-mobile-menu', onToggleMobileMenu)
})
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500"
    :class="scrolled
      ? 'bg-surface/80 backdrop-blur-xl shadow-[0_1px_0_0_var(--color-line-light)]'
      : 'bg-transparent'"
  >
    <div class="container-site flex h-16 md:h-18 items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <img v-if="logoUrl" :src="logoUrl" :alt="schoolName" class="h-10 md:h-12 transition-transform duration-300 group-hover:scale-105" />
        <span v-else class="text-lg font-bold transition-colors duration-300" :class="scrolled ? 'text-primary' : 'text-cream-100'">
          {{ schoolName || 'Cinta Madani' }}
        </span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.url"
          :to="item.url"
          :aria-current="$route.path === item.url ? 'page' : undefined"
          class="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300"
          :class="scrolled
            ? ($route.path === item.url ? 'text-primary bg-primary/5' : 'text-text hover:text-primary hover:bg-primary/5')
            : ($route.path === item.url ? 'text-cream-100 bg-white/10' : 'text-cream-100/80 hover:text-cream-100 hover:bg-white/5')"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Desktop CTA -->
      <div class="hidden md:flex items-center gap-3">
        <router-link
          to="/ppdb"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-sm)] transition-all duration-300"
          :class="scrolled
            ? 'bg-primary text-white hover:bg-primary-dark shadow-sm'
            : 'bg-accent text-primary-dark hover:bg-accent-light shadow-sm'"
        >
          PPDB
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </router-link>
      </div>

      <!-- Mobile menu button -->
      <button
        class="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors md:hidden"
        :class="scrolled ? 'hover:bg-surface-soft text-text' : 'hover:bg-white/10 text-cream-100'"
        aria-label="Menu"
        @click="mobileMenuOpen = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <MobileMenu
      :open="mobileMenuOpen"
      :nav-items="navItems"
      @close="mobileMenuOpen = false"
    />
  </header>
</template>
