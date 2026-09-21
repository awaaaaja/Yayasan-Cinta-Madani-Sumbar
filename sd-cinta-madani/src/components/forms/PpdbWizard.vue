<script setup lang="ts">
import { watch } from "vue";
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";
import PpdbProgressBar from "./PpdbProgressBar.vue";
import PpdbStepSiswa from "./PpdbStepSiswa.vue";
import PpdbStepOrangTua from "./PpdbStepOrangTua.vue";
import PpdbStepSekolah from "./PpdbStepSekolah.vue";
import PpdbStepDokumen from "./PpdbStepDokumen.vue";
import PpdbStepReview from "./PpdbStepReview.vue";

const store = usePpdbWizardStore();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

function handleNext() {
  store.validateStep(store.currentStep);
  if (store.canProceed) {
    store.nextStep();
    scrollToTop();
  }
}

function handlePrev() {
  store.prevStep();
  scrollToTop();
}

async function handleSubmit() {
  store.validateStep(5);
  if (!store.canProceed) return;
  emit("submit");
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Focus management: move focus to step heading on step change
watch(() => store.currentStep, () => {
  requestAnimationFrame(() => {
    const heading = document.querySelector("[data-step-heading]");
    if (heading instanceof HTMLElement) heading.focus();
  });
});
</script>

<template>
  <div>
    <PpdbProgressBar />

    <!-- Error summary -->
    <div
      v-if="Object.keys(store.errors).length > 0"
      class="mb-6 p-4 bg-red-50 border border-red-200 rounded-[12px]"
      role="alert"
      aria-live="polite"
    >
      <p class="text-small font-medium text-red-800 mb-1">Mohon perbaiki error berikut:</p>
      <ul class="text-small text-red-700 list-disc list-inside space-y-0.5">
        <li v-for="(msg, key) in store.errors" :key="key">{{ msg }}</li>
      </ul>
    </div>

    <!-- Submit error -->
    <div
      v-if="store.submitError"
      class="mb-6 p-4 bg-red-50 border border-red-200 rounded-[12px]"
      role="alert"
    >
      <p class="text-small text-red-700">{{ store.submitError }}</p>
    </div>

    <!-- Step content -->
    <div class="bg-white rounded-[20px] p-5 md:p-8 border border-line-light">
      <div data-step-heading tabindex="-1" class="outline-none">
        <PpdbStepSiswa v-show="store.currentStep === 1" />
        <PpdbStepOrangTua v-show="store.currentStep === 2" />
        <PpdbStepSekolah v-show="store.currentStep === 3" />
        <PpdbStepDokumen v-show="store.currentStep === 4" />
        <PpdbStepReview v-show="store.currentStep === 5" />
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-6 pt-6 border-t border-line">
      <button
        v-if="store.currentStep > 1"
        class="h-12 px-6 border border-line rounded-[var(--radius-sm)] text-body font-medium text-text hover:bg-surface transition-colors"
        @click="handlePrev"
      >
        Kembali
      </button>
      <div v-else />

      <button
        v-if="store.currentStep < store.totalSteps"
        class="h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)] hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleNext"
      >
        Selanjutnya
      </button>
      <button
        v-else
        class="h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)] hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="store.isSubmitting"
        @click="handleSubmit"
      >
        {{ store.isSubmitting ? "Mengirim..." : "Kirim Pendaftaran" }}
      </button>
    </div>
  </div>
</template>
