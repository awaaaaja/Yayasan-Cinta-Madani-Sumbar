<script setup lang="ts">
import { ref } from 'vue';

interface User {
  full_name: string;
  avatar_url?: string;
  role: string;
}

defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  toggleSidebar: [];
  logout: [];
}>();

const showDropdown = ref(false);

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
</script>

<template>
  <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--color-sand)] bg-white px-4 lg:px-6">
    <div class="flex items-center gap-3">
      <button
        class="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-moss)] hover:bg-[var(--color-cream)] lg:hidden"
        @click="emit('toggleSidebar')"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <slot name="title" />
    </div>

    <div class="relative">
      <button
        class="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--color-cream)]"
        @click="showDropdown = !showDropdown"
      >
        <img
          v-if="user.avatar_url"
          :src="user.avatar_url"
          :alt="user.full_name"
          class="h-8 w-8 rounded-full object-cover"
        />
        <div
          v-else
          class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-forest)] text-xs font-bold text-white"
        >
          {{ getInitials(user.full_name) }}
        </div>
        <div class="hidden text-left sm:block">
          <p class="text-small font-medium text-[var(--color-bark)]">{{ user.full_name }}</p>
          <p class="text-xs text-[var(--color-moss)]">{{ user.role }}</p>
        </div>
        <svg class="h-4 w-4 text-[var(--color-moss)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        v-if="showDropdown"
        class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[var(--color-sand)] bg-white py-1 shadow-lg"
      >
        <div class="border-b border-[var(--color-sand)] px-4 py-2">
          <p class="text-small font-medium text-[var(--color-bark)]">{{ user.full_name }}</p>
          <span class="inline-block rounded-full bg-[var(--color-forest)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-forest)]">
            {{ user.role }}
          </span>
        </div>
        <button
          class="flex w-full items-center gap-2 px-4 py-2 text-left text-small text-red-600 hover:bg-red-50"
          @click="emit('logout')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </div>
  </header>

  <div v-if="showDropdown" class="fixed inset-0 z-30" @click="showDropdown = false" />
</template>
