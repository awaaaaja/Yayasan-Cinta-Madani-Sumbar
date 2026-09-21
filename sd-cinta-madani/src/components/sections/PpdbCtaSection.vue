<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { getSectionContent } from "@/services/homepage.service";
import AnimatedButton from "@/components/ui/AnimatedButton.vue";

interface PpdbCtaContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  cta_label?: string;
  cta_url?: string;
}

const content = ref<PpdbCtaContent | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const { element: sectionEl, isVisible } = useScrollReveal();

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    content.value = await getSectionContent<PpdbCtaContent>("ppdb_cta");
  } catch {
    content.value = null;
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <section
    :ref="(el) => { sectionEl = el as HTMLElement }"
    id="ppdb"
    class="section-pad bg-background"
  >
    <div class="container-site">
      <!-- Loading -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-[280px] bg-surface-soft rounded-[20px]" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-body text-muted mb-4">{{ error }}</p>
        <button class="h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)]" @click="fetchData">
          Coba Lagi
        </button>
      </div>

      <!-- CTA Banner -->
      <div
        class="relative bg-primary rounded-[20px] overflow-hidden"
        :style="{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)',
          transition: 'all 700ms var(--ease-out)',
        }"
      >
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-[0.03]">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="cta-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#cta-pattern)" />
          </svg>
        </div>

        <div class="relative z-10 px-8 md:px-16 py-12 md:py-16 lg:py-20">
          <p class="text-eyebrow text-accent mb-4">
            {{ content?.eyebrow || "PPDB 2026/2027" }}
          </p>
          <h2 class="text-display text-cream-100 max-w-[600px] mb-4">
            {{ content?.heading || "Daftarkan Putra-Putri Terbaik ke SD Cinta Madani." }}
          </h2>
          <p v-if="content?.description" class="text-body-lg text-cream-100/60 max-w-[480px] mb-8">
            {{ content.description }}
          </p>

          <AnimatedButton
            :to="content?.cta_url || '/ppdb'"
            variant="accent"
            size="lg"
          >
            {{ content?.cta_label || 'Daftar PPDB Sekarang' }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </AnimatedButton>
        </div>

        <!-- Decorative circles -->
        <div class="absolute top-0 right-0 w-1/3 h-full opacity-5 hidden md:block">
          <div class="absolute top-12 right-12 w-56 h-56 rounded-full border-2 border-cream-100" />
          <div class="absolute bottom-12 right-40 w-32 h-32 rounded-full border border-accent" />
        </div>
      </div>
    </div>
  </section>
</template>
