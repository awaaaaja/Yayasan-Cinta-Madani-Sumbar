<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSiteSettings, getNavigationItems } from '@/services/settings.service'

const schoolName = ref('')
const tagline = ref('')
const footerDesc = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const socialLinks = ref<{ platform: string; url: string }[]>([])
const quickLinks = ref<{ label: string; url: string }[]>([])

onMounted(async () => {
  const [data, navItems] = await Promise.all([getSiteSettings(), getNavigationItems()])
  if (data) {
    schoolName.value = data.school_name ?? ''
    tagline.value = data.tagline ?? ''
    footerDesc.value = data.footer_content?.description ?? ''
    email.value = data.email ?? ''
    phone.value = data.phone ?? ''
    address.value = data.address ?? ''
    socialLinks.value = Object.entries(data.social_links ?? {})
      .map(([platform, url]) => ({ platform, url: url as string }))
      .filter(l => l.url)
  }
  if (navItems?.length) {
    quickLinks.value = navItems.map(n => ({ label: n.label, url: n.url }))
  }
})
</script>

<template>
  <footer class="bg-forest-950 text-cream-100">
    <div class="container-site py-16 md:py-20">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <!-- Brand -->
        <div class="lg:col-span-4">
          <h2 class="text-h3 text-cream-100 mb-4">{{ schoolName || 'Yayasan Cinta Madani' }}</h2>
          <p class="text-body text-cream-100/50 max-w-[320px] mb-6">
            {{ tagline || 'Pendidikan yang Membumi dan Menyentuh Hati.' }}
          </p>
          <div v-if="socialLinks.length" class="flex gap-3">
            <a
              v-for="link in socialLinks"
              :key="link.platform"
              :href="link.url"
              target="_blank"
              rel="noopener"
              :aria-label="link.platform"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-cream-100/60 text-xs font-semibold transition-all duration-300 hover:bg-white/10 hover:text-cream-100"
            >
              {{ link.platform.slice(0, 2).toUpperCase() }}
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div class="lg:col-span-2 lg:col-start-6">
          <h3 class="text-caption text-cream-100/40 uppercase tracking-wider mb-4">Navigasi</h3>
          <nav class="flex flex-col space-y-1">
            <router-link
              v-for="link in quickLinks"
              :key="link.url"
              :to="link.url"
              class="flex min-h-[40px] items-center text-sm text-cream-100/60 transition-colors duration-300 hover:text-cream-100"
            >
              {{ link.label }}
            </router-link>
          </nav>
        </div>

        <!-- Contact -->
        <div class="lg:col-span-3">
          <h3 class="text-caption text-cream-100/40 uppercase tracking-wider mb-4">Kontak</h3>
          <div class="space-y-3">
            <a v-if="phone" :href="`tel:${phone}`" class="flex items-center gap-3 text-sm text-cream-100/60 transition-colors duration-300 hover:text-cream-100 min-h-[40px]">
              <svg class="h-4 w-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {{ phone }}
            </a>
            <a v-if="email" :href="`mailto:${email}`" class="flex items-center gap-3 text-sm text-cream-100/60 transition-colors duration-300 hover:text-cream-100 min-h-[40px]">
              <svg class="h-4 w-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
              </svg>
              {{ email }}
            </a>
            <p v-if="address" class="text-sm text-cream-100/40 leading-relaxed">{{ address }}</p>
          </div>
        </div>

        <!-- PPDB CTA -->
        <div class="lg:col-span-3">
          <h3 class="text-caption text-cream-100/40 uppercase tracking-wider mb-4">PPDB</h3>
          <p class="text-sm text-cream-100/50 mb-4">{{ footerDesc || 'Bergabunglah bersama kami dan mulai perjalanan pendidikan yang bermakna.' }}</p>
          <router-link
            to="/ppdb"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary-dark text-sm font-semibold rounded-[var(--radius-sm)] transition-all duration-300 hover:bg-accent-light hover:shadow-md"
          >
            Daftar Sekarang
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </router-link>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
        <p class="text-xs text-cream-100/30">&copy; {{ new Date().getFullYear() }} {{ schoolName }}. All rights reserved.</p>
        <div class="flex gap-6">
          <router-link to="/privacy-policy" class="text-xs text-cream-100/30 transition-colors duration-300 hover:text-cream-100/60">
            Kebijakan Privasi
          </router-link>
          <router-link to="/terms" class="text-xs text-cream-100/30 transition-colors duration-300 hover:text-cream-100/60">
            Syarat &amp; Ketentuan
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
