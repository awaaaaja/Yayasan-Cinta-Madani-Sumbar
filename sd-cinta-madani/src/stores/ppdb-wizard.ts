import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { submitRegistration as apiSubmit } from "@/services/ppdb.service";
import type { PpdbRegistrationInput } from "@/services/ppdb.service";

export interface StudentData {
  nik: string;
  nisn: string;
  full_name: string;
  birth_place: string;
  birth_date: string;
  gender: "L" | "P" | "";
  religion: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  phone: string;
}

export interface ParentData {
  father_name: string;
  father_occupation: string;
  father_income: string;
  mother_name: string;
  mother_occupation: string;
  mother_income: string;
  guardian_name: string;
}

export interface SchoolData {
  previous_school: string;
  previous_school_npsn: string;
  previous_school_address: string;
  graduation_year: string;
}

export interface DocumentData {
  birth_certificate: File | null;
  family_card: File | null;
  student_photo: File | null;
  diploma: File | null;
}

export interface StepErrors {
  [key: string]: string;
}

const TOTAL_STEPS = 5;
const STEP_LABELS = ["Data Siswa", "Data Orang Tua", "Asal Sekolah", "Dokumen", "Review"];

function createEmptyStudent(): StudentData {
  return { nik: "", nisn: "", full_name: "", birth_place: "", birth_date: "", gender: "", religion: "", address: "", rt: "", rw: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: "", kode_pos: "", phone: "" };
}

function createEmptyParent(): ParentData {
  return { father_name: "", father_occupation: "", father_income: "", mother_name: "", mother_occupation: "", mother_income: "", guardian_name: "" };
}

function createEmptySchool(): SchoolData {
  return { previous_school: "", previous_school_npsn: "", previous_school_address: "", graduation_year: "" };
}

function createEmptyDocuments(): DocumentData {
  return { birth_certificate: null, family_card: null, student_photo: null, diploma: null };
}

export const usePpdbWizardStore = defineStore("ppdb-wizard", () => {
  const currentStep = ref(1);
  const student = ref<StudentData>(createEmptyStudent());
  const parent = ref<ParentData>(createEmptyParent());
  const school = ref<SchoolData>(createEmptySchool());
  const documents = ref<DocumentData>(createEmptyDocuments());
  const agreement = ref(false);
  const errors = ref<StepErrors>({});
  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);
  const registrationNumber = ref("");
  const periodId = ref("");

  const totalSteps = TOTAL_STEPS;
  const stepLabels = STEP_LABELS;

  const progress = computed(() => (currentStep.value / totalSteps) * 100);

  const canProceed = computed(() => Object.keys(errors.value).length === 0);

  function validateStep(step: number): boolean {
    const e: StepErrors = {};

    if (step === 1) {
      const s = student.value;
      if (!s.nik || !/^\d{16}$/.test(s.nik)) e.nik = "NIK harus 16 digit angka";
      if (s.nisn && !/^\d{10}$/.test(s.nisn)) e.nisn = "NISN harus 10 digit angka";
      if (!s.full_name || s.full_name.length < 3) e.full_name = "Nama lengkap minimal 3 karakter";
      if (!s.birth_place) e.birth_place = "Tempat lahir wajib diisi";
      if (!s.birth_date) e.birth_date = "Tanggal lahir wajib diisi";
      if (!s.gender) e.gender = "Jenis kelamin wajib dipilih";
      if (!s.religion) e.religion = "Agama wajib dipilih";
      if (!s.address) e.address = "Alamat wajib diisi";
      if (!s.kecamatan) e.kecamatan = "Kecamatan wajib diisi";
      if (!s.kabupaten) e.kabupaten = "Kabupaten wajib diisi";
      if (!s.provinsi) e.provinsi = "Provinsi wajib diisi";
    }

    if (step === 2) {
      const p = parent.value;
      if (!p.father_name) e.father_name = "Nama ayah wajib diisi";
      if (!p.mother_name) e.mother_name = "Nama ibu wajib diisi";
    }

    if (step === 3) {
      const sc = school.value;
      if (!sc.previous_school) e.previous_school = "Nama sekolah wajib diisi";
      if (!sc.graduation_year) {
        e.graduation_year = "Tahun lulus wajib diisi";
      } else {
        const y = Number(sc.graduation_year);
        if (y < 2020 || y > 2030) e.graduation_year = "Tahun lulus harus 2020-2030";
      }
    }

    if (step === 4) {
      const d = documents.value;
      if (!d.birth_certificate) e.birth_certificate = "Akte kelahiran wajib diupload";
      if (!d.family_card) e.family_card = "Kartu keluarga wajib diupload";
      if (!d.student_photo) e.student_photo = "Foto siswa wajib diupload";
      const maxSize = 2 * 1024 * 1024;
      const photoMax = 1 * 1024 * 1024;
      if (d.birth_certificate && d.birth_certificate.size > maxSize) e.birth_certificate = "Maksimal 2MB";
      if (d.family_card && d.family_card.size > maxSize) e.family_card = "Maksimal 2MB";
      if (d.student_photo && d.student_photo.size > photoMax) e.student_photo = "Maksimal 1MB";
      if (d.diploma && d.diploma.size > maxSize) e.diploma = "Maksimal 2MB";
    }

    if (step === 5) {
      if (!agreement.value) e.agreement = "Centang pernyataan kebenaran data";
    }

    errors.value = e;
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (validateStep(currentStep.value) && currentStep.value < totalSteps) {
      currentStep.value++;
      errors.value = {};
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
      errors.value = {};
    }
  }

  function setStep(step: number) {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step;
      errors.value = {};
    }
  }

  async function submitRegistration(): Promise<boolean> {
    if (!validateStep(5)) return false;
    isSubmitting.value = true;
    submitError.value = null;

    try {
      const s = student.value;
      const p = parent.value;
      const sc = school.value;

      const input: PpdbRegistrationInput = {
        period_id: periodId.value,
        nik: s.nik,
        nisn: s.nisn || null,
        full_name: s.full_name,
        birth_place: s.birth_place,
        birth_date: s.birth_date,
        gender: s.gender as "L" | "P",
        religion: s.religion,
        address: s.address,
        rt: s.rt || null,
        rw: s.rw || null,
        kelurahan: s.kelurahan || "",
        kecamatan: s.kecamatan,
        kabupaten: s.kabupaten,
        provinsi: s.provinsi,
        kode_pos: s.kode_pos || null,
        phone: s.phone || null,
        father_name: p.father_name,
        father_occupation: p.father_occupation || "",
        father_income: p.father_income || "",
        mother_name: p.mother_name,
        mother_occupation: p.mother_occupation || "",
        mother_income: p.mother_income || "",
        guardian_name: p.guardian_name || null,
        previous_school: sc.previous_school,
        previous_school_npsn: sc.previous_school_npsn || null,
        previous_school_address: sc.previous_school_address || null,
        graduation_year: Number(sc.graduation_year),
      };

      const docs = documents.value;
      const files: Record<string, File> = {};
      if (docs.birth_certificate) files.birth_certificate = docs.birth_certificate;
      if (docs.family_card) files.family_card = docs.family_card;
      if (docs.student_photo) files.student_photo = docs.student_photo;
      if (docs.diploma) files.diploma = docs.diploma;

      const regNumber = await apiSubmit(input, files);
      registrationNumber.value = regNumber;
      return true;
    } catch (e) {
      submitError.value = e instanceof Error ? e.message : "Gagal mengirim pendaftaran";
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  function reset() {
    currentStep.value = 1;
    student.value = createEmptyStudent();
    parent.value = createEmptyParent();
    school.value = createEmptySchool();
    documents.value = createEmptyDocuments();
    agreement.value = false;
    errors.value = {};
    isSubmitting.value = false;
    submitError.value = null;
    registrationNumber.value = "";
    periodId.value = "";
  }

  return {
    currentStep, student, parent, school, documents, agreement,
    errors, isSubmitting, submitError, registrationNumber, periodId,
    totalSteps, stepLabels, progress, canProceed,
    validateStep, nextStep, prevStep, setStep, submitRegistration, reset,
  };
});
