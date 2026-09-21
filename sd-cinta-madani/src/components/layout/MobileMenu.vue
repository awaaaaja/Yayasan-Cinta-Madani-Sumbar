<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  open: boolean
  navItems: Array<{ label: string; url: string }>
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const menuRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (!menuRef.value) return
  const links = menuRef.value.querySelectorAll<HTMLElement>('a, button')
  if (!links.length) return
  if (e.key === 'Tab') {
    const first = links[0]
    const last = links[links.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeyDown)
      activeIndex.value = props.navItems.findIndex(n => route.path === n.url)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  },
)

onMounted(() => {
  if (props.open) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] bg-forest-950/40 backdrop-blur-sm"
        @click="emit('close')"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="slide">
      <div
        v-if="open"
        ref="menuRef"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        class="fixed inset-y-0 right-0 z-[61] flex w-[320px] max-w-[85vw] flex-col bg-surface shadow-2xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-8 pb-4">
          <div>
            <p class="text-caption text-muted uppercase tracking-wider">Menu</p>
          </div>
          <button
            class="flex h-11 w-11 items-center justify-center rounded-full bg-surface-soft text-muted transition-all duration-300 hover:bg-primary hover:text-cream-100"
            aria-label="Tutup menu"
            @click="emit('close')"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Divider -->
        <div class="mx-6 h-px bg-line" />

        <!-- Nav items -->
        <nav class="flex-1 overflow-y-auto px-6 py-6 space-y-0.5">
          <router-link
            v-for="item in navItems"
            :key="item.url"
            :to="item.url"
            :aria-current="route.path === item.url ? 'page' : undefined"
            class="group flex min-h-[48px] items-center rounded-[12px] px-4 py-3 text-sm font-medium transition-all duration-300"
            :class="
              route.path === item.url
                ? 'bg-primary/5 text-primary'
                : 'text-text-950 hover:bg-cream-100'
            "
            @click="emit('close')"
          >
            <span class="flex-1">{{ item.label }}</span>
            <svg
              class="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-300"
              :class="route.path === item.url ? 'opacity-100 translate-x-0 text-primary' : 'group-hover:opacity-60 group-hover:translate-x-0 text-text-950'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </router-link>
        </nav>

        <!-- Divider -->
        <div class="mx-6 h-px bg-line" />

        <!-- PPDB CTA -->
        <div class="px-6 py-6">
          <router-link
            to="/ppdb"
            class="group flex min-h-[48px] items-center justify-center gap-2 rounded-[12px] bg-accent px-5 py-3 text-sm font-semibold text-forest-950 transition-all duration-300 hover:bg-accent-light hover:shadow-md"
            @click="emit('close')"
          >
            Daftar PPDB
            <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </router-link>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms var(--ease-out);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 350ms var(--ease-out);
}
.slide-leave-active {
  transition: transform 280ms var(--ease-in);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
