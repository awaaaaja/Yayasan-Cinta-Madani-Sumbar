<script setup lang="ts">
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";
import FormField from "@/components/admin/FormField.vue";

const store = usePpdbWizardStore();
const s = store.student;
const p = store.parent;
const sc = store.school;
const d = store.documents;

function genderLabel(g: string) {
  return g === "L" ? "Laki-laki" : g === "P" ? "Perempuan" : "-";
}

function docStatus(file: File | null, required: boolean) {
  if (file) return { text: file.name, ok: true };
  return { text: required ? "Belum diupload" : "Tidak diupload", ok: false };
}

const docs = [
  { key: "birth_certificate" as const, label: "Akte Kelahiran", required: true },
  { key: "family_card" as const, label: "Kartu Keluarga", required: true },
  { key: "student_photo" as const, label: "Foto Siswa", required: true },
  { key: "diploma" as const, label: "Ijazah", required: false },
];
</script>

<template>
  <div class="space-y-5">
    <h3 class="text-h3 text-text">Review Data</h3>
    <p class="text-small text-muted">Pastikan semua data sudah benar sebelum mengirim.</p>

    <!-- Data Siswa -->
    <div class="bg-surface rounded-[16px] p-5 md:p-6">
      <h4 class="text-body font-semibold text-text mb-3">Data Siswa</h4>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-small">
        <div><dt class="text-muted">NIK</dt><dd class="text-text font-mono">{{ s.nik || "-" }}</dd></div>
        <div><dt class="text-muted">NISN</dt><dd class="text-text font-mono">{{ s.nisn || "-" }}</dd></div>
        <div><dt class="text-muted">Nama</dt><dd class="text-text">{{ s.full_name || "-" }}</dd></div>
        <div><dt class="text-muted">Lahir</dt><dd class="text-text">{{ s.birth_place }}, {{ s.birth_date }}</dd></div>
        <div><dt class="text-muted">Gender</dt><dd class="text-text">{{ genderLabel(s.gender) }}</dd></div>
        <div><dt class="text-muted">Agama</dt><dd class="text-text">{{ s.religion || "-" }}</dd></div>
        <div class="sm:col-span-2"><dt class="text-muted">Alamat</dt><dd class="text-text">{{ s.address || "-" }}</dd></div>
      </dl>
    </div>

    <!-- Data Orang Tua -->
    <div class="bg-surface rounded-[16px] p-5 md:p-6">
      <h4 class="text-body font-semibold text-text mb-3">Data Orang Tua</h4>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-small">
        <div><dt class="text-muted">Ayah</dt><dd class="text-text">{{ p.father_name || "-" }}</dd></div>
        <div><dt class="text-muted">Ibu</dt><dd class="text-text">{{ p.mother_name || "-" }}</dd></div>
        <div v-if="p.guardian_name"><dt class="text-muted">Wali</dt><dd class="text-text">{{ p.guardian_name }}</dd></div>
      </dl>
    </div>

    <!-- Asal Sekolah -->
    <div class="bg-surface rounded-[16px] p-5 md:p-6">
      <h4 class="text-body font-semibold text-text mb-3">Asal Sekolah</h4>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-small">
        <div><dt class="text-muted">Sekolah</dt><dd class="text-text">{{ sc.previous_school || "-" }}</dd></div>
        <div><dt class="text-muted">NPSN</dt><dd class="text-text font-mono">{{ sc.previous_school_npsn || "-" }}</dd></div>
        <div><dt class="text-muted">Tahun Lulus</dt><dd class="text-text">{{ sc.graduation_year || "-" }}</dd></div>
      </dl>
    </div>

    <!-- Dokumen -->
    <div class="bg-surface rounded-[16px] p-5 md:p-6">
      <h4 class="text-body font-semibold text-text mb-3">Dokumen</h4>
      <ul class="text-small space-y-1.5">
        <li v-for="doc in docs" :key="doc.key" class="flex items-center gap-2">
          <span :class="docStatus(d[doc.key], doc.required).ok ? 'text-primary' : 'text-muted'">
            {{ doc.label }}: {{ docStatus(d[doc.key], doc.required).text }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Pernyataan -->
    <FormField label="" :error="store.errors.agreement">
      <label class="flex items-start gap-3 cursor-pointer">
        <input v-model="store.agreement" type="checkbox" class="w-5 h-5 mt-0.5 rounded border-[var(--color-sand)] text-primary focus:ring-primary" />
        <span class="text-small text-muted">Saya menyatakan bahwa data yang diisi adalah benar dan bertanggung jawab atas kebenarannya.</span>
      </label>
    </FormField>
  </div>
</template>
