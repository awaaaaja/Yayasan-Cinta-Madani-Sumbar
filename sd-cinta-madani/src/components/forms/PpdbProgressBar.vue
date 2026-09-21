<script setup lang="ts">
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";

const store = usePpdbWizardStore();
</script>

<template>
  <div class="mb-8 md:mb-12">
    <div class="flex items-center justify-between mb-4">
      <span class="text-small text-muted">Langkah {{ store.currentStep }} dari {{ store.totalSteps }}</span>
      <span class="text-small font-medium text-primary">{{ store.stepLabels[store.currentStep - 1] }}</span>
    </div>
    <div class="h-2 bg-sand rounded-full overflow-hidden">
      <div
        class="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${store.progress}%` }"
      />
    </div>
    <div class="flex justify-between mt-3">
      <button
        v-for="(label, i) in store.stepLabels"
        :key="i"
        class="text-xs transition-colors duration-300 hidden sm:block"
        :class="[
          i + 1 === store.currentStep ? 'text-primary font-semibold' :
          i + 1 < store.currentStep ? 'text-primary/70' : 'text-muted'
        ]"
        @click="i + 1 < store.currentStep ? store.setStep(i + 1) : null"
        :disabled="i + 1 > store.currentStep"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>
