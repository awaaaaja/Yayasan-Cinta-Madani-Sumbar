<script setup lang="ts">
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";
import FormField from "@/components/admin/FormField.vue";

const store = usePpdbWizardStore();
const sc = store.school;

function fieldClass(hasError: boolean) {
  return [
    "w-full rounded-lg border bg-white px-3 py-2.5 text-body text-[var(--color-bark)]",
    "focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20",
    hasError ? "border-red-400" : "border-[var(--color-sand)]",
  ].join(" ");
}
</script>

<template>
  <div class="space-y-5">
    <h3 class="text-h3 text-text">Asal Sekolah</h3>

    <FormField label="Nama Sekolah Asal" required :error="store.errors.previous_school">
      <input v-model="sc.previous_school" type="text" placeholder="Nama sekolah asal" :class="fieldClass(!!store.errors.previous_school)" />
    </FormField>
    <FormField label="NPSN Sekolah Asal" :error="store.errors.previous_school_npsn">
      <input v-model="sc.previous_school_npsn" type="text" inputmode="numeric" placeholder="NPSN (opsional)" :class="fieldClass(!!store.errors.previous_school_npsn)" />
    </FormField>
    <FormField label="Alamat Sekolah Asal" :error="store.errors.previous_school_address">
      <input v-model="sc.previous_school_address" type="text" placeholder="Alamat sekolah" :class="fieldClass(!!store.errors.previous_school_address)" />
    </FormField>
    <FormField label="Tahun Lulus" required :error="store.errors.graduation_year">
      <input v-model="sc.graduation_year" type="number" min="2020" max="2030" placeholder="Contoh: 2025" :class="fieldClass(!!store.errors.graduation_year)" />
    </FormField>
  </div>
</template>
