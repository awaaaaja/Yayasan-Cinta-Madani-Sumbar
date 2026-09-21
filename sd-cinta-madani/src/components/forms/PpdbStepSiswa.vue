<script setup lang="ts">
import { usePpdbWizardStore } from "@/stores/ppdb-wizard";
import FormField from "@/components/admin/FormField.vue";

const store = usePpdbWizardStore();
const s = store.student;

const religions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
const genders = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];

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
    <h3 class="text-h3 text-text">Data Siswa</h3>

    <FormField label="NIK" required :error="store.errors.nik">
      <input v-model="s.nik" type="text" inputmode="numeric" maxlength="16" placeholder="16 digit NIK" :class="fieldClass(!!store.errors.nik)" />
    </FormField>

    <FormField label="NISN" :error="store.errors.nisn">
      <input v-model="s.nisn" type="text" inputmode="numeric" maxlength="10" placeholder="NISN (opsional)" :class="fieldClass(!!store.errors.nisn)" />
    </FormField>

    <FormField label="Nama Lengkap" required :error="store.errors.full_name">
      <input v-model="s.full_name" type="text" placeholder="Nama lengkap sesuai akte" :class="fieldClass(!!store.errors.full_name)" />
    </FormField>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Tempat Lahir" required :error="store.errors.birth_place">
        <input v-model="s.birth_place" type="text" placeholder="Kota/Kabupaten" :class="fieldClass(!!store.errors.birth_place)" />
      </FormField>
      <FormField label="Tanggal Lahir" required :error="store.errors.birth_date">
        <input v-model="s.birth_date" type="date" :class="fieldClass(!!store.errors.birth_date)" />
      </FormField>
    </div>

    <FormField label="Jenis Kelamin" required :error="store.errors.gender">
      <div class="flex gap-4">
        <label v-for="g in genders" :key="g.value" class="flex items-center gap-2 cursor-pointer">
          <input v-model="s.gender" type="radio" :value="g.value" class="w-4 h-4 text-primary" />
          <span class="text-body">{{ g.label }}</span>
        </label>
      </div>
    </FormField>

    <FormField label="Agama" required :error="store.errors.religion">
      <select v-model="s.religion" :class="fieldClass(!!store.errors.religion)">
        <option value="" disabled>Pilih agama</option>
        <option v-for="r in religions" :key="r" :value="r">{{ r }}</option>
      </select>
    </FormField>

    <FormField label="Alamat Lengkap" required :error="store.errors.address">
      <textarea v-model="s.address" rows="2" placeholder="Jalan, nomor rumah" :class="[fieldClass(!!store.errors.address), 'min-h-[80px]'].join(' ')" />
    </FormField>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <FormField label="RT" :error="store.errors.rt">
        <input v-model="s.rt" type="text" placeholder="RT" :class="fieldClass(!!store.errors.rt)" />
      </FormField>
      <FormField label="RW" :error="store.errors.rw">
        <input v-model="s.rw" type="text" placeholder="RW" :class="fieldClass(!!store.errors.rw)" />
      </FormField>
      <FormField label="Kelurahan" :error="store.errors.kelurahan">
        <input v-model="s.kelurahan" type="text" placeholder="Kelurahan" :class="fieldClass(!!store.errors.kelurahan)" />
      </FormField>
      <FormField label="Kecamatan" required :error="store.errors.kecamatan">
        <input v-model="s.kecamatan" type="text" placeholder="Kecamatan" :class="fieldClass(!!store.errors.kecamatan)" />
      </FormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormField label="Kabupaten" required :error="store.errors.kabupaten">
        <input v-model="s.kabupaten" type="text" placeholder="Kabupaten" :class="fieldClass(!!store.errors.kabupaten)" />
      </FormField>
      <FormField label="Provinsi" required :error="store.errors.provinsi">
        <input v-model="s.provinsi" type="text" placeholder="Provinsi" :class="fieldClass(!!store.errors.provinsi)" />
      </FormField>
      <FormField label="Kode Pos" :error="store.errors.kode_pos">
        <input v-model="s.kode_pos" type="text" inputmode="numeric" placeholder="Kode pos" :class="fieldClass(!!store.errors.kode_pos)" />
      </FormField>
    </div>

    <FormField label="No. Telepon/HP" :error="store.errors.phone">
      <input v-model="s.phone" type="tel" placeholder="Nomor telepon yang bisa dihubungi" :class="fieldClass(!!store.errors.phone)" />
    </FormField>
  </div>
</template>
