<script setup lang="ts">
import { useRoute } from 'vue-router';

defineProps<{
  collapsed: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const route = useRoute();

const navItems = [
  { label: 'Dashboard', icon: 'home', to: '/admin' },
  { label: 'Hero Slideshow', icon: 'hero', to: '/admin/hero' },
  { label: 'Tentang Yayasan', icon: 'about', to: '/admin/about' },
  { label: 'Homepage', icon: 'home', to: '/admin/homepage/sections' },
  { label: 'Berita', icon: 'news', to: '/admin/news' },
  { label: 'Program', icon: 'program', to: '/admin/programs' },
  { label: 'Agenda', icon: 'agenda', to: '/admin/events' },
  { label: 'Prestasi', icon: 'achievement', to: '/admin/achievements' },
  { label: 'Galeri', icon: 'gallery', to: '/admin/gallery' },
  { label: 'Guru & Staf', icon: 'about', to: '/admin/guru-staf' },
  { label: 'Fasilitas', icon: 'unit', to: '/admin/fasilitas' },
  { label: 'PPDB', icon: 'ppdb', to: '/admin/ppdb' },
  { label: 'Registrasi PPDB', icon: 'ppdb', to: '/admin/registrations' },
  { label: 'Downloads', icon: 'download', to: '/admin/downloads' },
  { label: 'Kontak', icon: 'contact', to: '/admin/contacts' },
  { label: 'Media', icon: 'media', to: '/admin/media' },
  { label: 'Navigasi', icon: 'agenda', to: '/admin/navigation' },
  { label: 'Halaman', icon: 'pages', to: '/admin/pages' },
  { label: 'Pengguna', icon: 'users', to: '/admin/users' },
  { label: 'Settings', icon: 'settings', to: '/admin/settings' },
];

function isActive(to: string): boolean {
  if (to === '/admin') return route.path === '/admin';
  return route.path.startsWith(to);
}

function iconPath(icon: string): string {
  const paths: Record<string, string> = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
    hero: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    about: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    news: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    unit: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    program: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    agenda: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    achievement: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    gallery: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    ppdb: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    contact: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    media: 'M7 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L7 18V4z',
    pages: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  };
  return paths[icon] || paths.home;
}
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[var(--color-sand)] bg-white transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <div class="flex h-16 items-center justify-between border-b border-[var(--color-sand)] px-4">
      <div v-if="!collapsed" class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-forest)] text-sm font-bold text-white">
          CB
        </div>
        <span class="font-bold text-[var(--color-bark)]">Admin</span>
      </div>
      <button
        class="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-moss)] hover:bg-[var(--color-cream)]"
        @click="emit('toggle')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="collapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-2 py-4">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-small font-medium transition-colors',
          isActive(item.to)
            ? 'bg-[var(--color-forest)]/10 text-[var(--color-forest)]'
            : 'text-[var(--color-moss)] hover:bg-[var(--color-cream)]',
          collapsed && 'justify-center px-2',
        ]"
        :title="collapsed ? item.label : undefined"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath(item.icon)" />
        </svg>
        <span v-if="!collapsed">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>

  <div
    v-if="collapsed"
    class="fixed inset-0 z-20 bg-black/30 lg:hidden"
    @click="emit('toggle')"
  />
</template>
