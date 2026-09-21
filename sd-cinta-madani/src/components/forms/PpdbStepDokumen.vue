<script setup lang="ts">
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";
import FormField from "@/components/admin/FormField.vue";

const store = usePpdbWizardStore();
const d = store.documents;

function onFile(key: keyof typeof d, event: Event) {
  const input = event.target as HTMLInputElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (d as any)[key] = input.files?.[0] || null;
  store.validateStep(4);
}

function fileLabel(file: File | null) {
  return file ? file.name : "";
}

const inputClass = "w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2.5 text-body text-[var(--color-bark)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer file:text-sm";
</script>

<template>
  <div class="space-y-5">
    <h3 class="text-h3 text-text">Upload Dokumen</h3>
    <p class="text-small text-muted">Format: JPG, PNG, atau PDF. Akte & KK maks 2MB, foto maks 1MB.</p>

    <FormField label="Akte Kelahiran" required :error="store.errors.birth_certificate">
      <input type="file" accept=".jpg,.jpeg,.png,.pdf" :class="inputClass" @change="onFile('birth_certificate', $event)" />
      <span v-if="d.birth_certificate" class="text-small text-primary mt-1 block">{{ fileLabel(d.birth_certificate) }}</span>
    </FormField>

    <FormField label="Kartu Keluarga" required :error="store.errors.family_card">
      <input type="file" accept=".jpg,.jpeg,.png,.pdf" :class="inputClass" @change="onFile('family_card', $event)" />
      <span v-if="d.family_card" class="text-small text-primary mt-1 block">{{ fileLabel(d.family_card) }}</span>
    </FormField>

    <FormField label="Foto Siswa" required :error="store.errors.student_photo">
      <input type="file" accept=".jpg,.jpeg,.png" :class="inputClass" @change="onFile('student_photo', $event)" />
      <span v-if="d.student_photo" class="text-small text-primary mt-1 block">{{ fileLabel(d.student_photo) }}</span>
    </FormField>

    <FormField label="Ijazah / Surat Keterangan Lulus" :error="store.errors.diploma">
      <input type="file" accept=".jpg,.jpeg,.png,.pdf" :class="inputClass" @change="onFile('diploma', $event)" />
      <span v-if="d.diploma" class="text-small text-primary mt-1 block">{{ fileLabel(d.diploma) }}</span>
    </FormField>
  </div>
</template>
