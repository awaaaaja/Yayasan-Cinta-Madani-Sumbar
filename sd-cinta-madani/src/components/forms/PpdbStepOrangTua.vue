<script setup lang="ts">
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";
import FormField from "@/components/admin/FormField.vue";

const store = usePpdbWizardStore();
const p = store.parent;

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
    <h3 class="text-h3 text-text">Data Orang Tua</h3>

    <FormField label="Nama Ayah" required :error="store.errors.father_name">
      <input v-model="p.father_name" type="text" placeholder="Nama ayah kandung" :class="fieldClass(!!store.errors.father_name)" />
    </FormField>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Pekerjaan Ayah" :error="store.errors.father_occupation">
        <input v-model="p.father_occupation" type="text" placeholder="Pekerjaan" :class="fieldClass(!!store.errors.father_occupation)" />
      </FormField>
      <FormField label="Penghasilan Ayah" :error="store.errors.father_income">
        <input v-model="p.father_income" type="text" placeholder="Per bulan (opsional)" :class="fieldClass(!!store.errors.father_income)" />
      </FormField>
    </div>

    <FormField label="Nama Ibu" required :error="store.errors.mother_name">
      <input v-model="p.mother_name" type="text" placeholder="Nama ibu kandung" :class="fieldClass(!!store.errors.mother_name)" />
    </FormField>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Pekerjaan Ibu" :error="store.errors.mother_occupation">
        <input v-model="p.mother_occupation" type="text" placeholder="Pekerjaan" :class="fieldClass(!!store.errors.mother_occupation)" />
      </FormField>
      <FormField label="Penghasilan Ibu" :error="store.errors.mother_income">
        <input v-model="p.mother_income" type="text" placeholder="Per bulan (opsional)" :class="fieldClass(!!store.errors.mother_income)" />
      </FormField>
    </div>

    <FormField label="Nama Wali" :error="store.errors.guardian_name">
      <input v-model="p.guardian_name" type="text" placeholder="Opsional — jika ada wali" :class="fieldClass(!!store.errors.guardian_name)" />
    </FormField>
  </div>
</template>
