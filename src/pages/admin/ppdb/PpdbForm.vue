<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import SaveBar from '@/components/admin/SaveBar.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getPeriodById, createPeriod, updatePeriod, deletePeriod, getRequirements, upsertRequirements, getFaqs, upsertFaqs } from '@/services/admin/ppdb.admin.service';
import { listUnits } from '@/services/admin/units.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { PpdbPeriod, EducationUnit } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Periode PPDB' : 'Tambah Periode PPDB';

const form = ref<Partial<PpdbPeriod>>({
  unit_id: '', academic_year: '', title: '', description: '', status: 'coming_soon', registration_url: '', contact_name: '', contact_phone: '', contact_email: '', start_date: '', end_date: '',
});

const { errors, validate, clearErrors } = useFormValidation({
  unit_id: [required('Unit Pendidikan')],
  academic_year: [required('Tahun Ajaran')],
  title: [required('Judul')],
  start_date: [required('Tanggal Mulai')],
  end_date: [required('Tanggal Selesai')],
});
const { showError } = useErrorToast();
const saveError = ref('');

const requirements = ref<{ title: string; description: string; sort_order: number }[]>([]);
const faqs = ref<{ question: string; answer: string; sort_order: number }[]>([]);
const units = ref<EducationUnit[]>([]);
const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);

const originalForm = ref<Partial<PpdbPeriod>>({});
const hasUnsavedChanges = computed(() => {
  if (!isEdit.value) return true;
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

onMounted(async () => {
  const unitsResult = await listUnits({ pageSize: 100 });
  units.value = unitsResult.data;
  if (isEdit.value) {
    loading.value = true;
    try {
      const data = await getPeriodById(route.params.id as string);
      form.value = { ...data };
      originalForm.value = { ...data };
      const [reqs, faqData] = await Promise.all([getRequirements(data.id), getFaqs(data.id)]);
      requirements.value = reqs.map((r: Record<string, unknown>) => ({ title: r.title as string, description: r.description as string, sort_order: r.sort_order as number }));
      faqs.value = faqData.map((f: Record<string, unknown>) => ({ question: f.question as string, answer: f.answer as string, sort_order: f.sort_order as number }));
    } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
  }
});

function addRequirement() { requirements.value.push({ title: '', description: '', sort_order: requirements.value.length }); }
function removeRequirement(idx: number) { requirements.value.splice(idx, 1); }
function addFaq() { faqs.value.push({ question: '', answer: '', sort_order: faqs.value.length }); }
function removeFaq(idx: number) { faqs.value.splice(idx, 1); }

async function handleSave(draft: boolean) {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (draft) form.value.status = 'coming_soon';
    let id = route.params.id as string;
    if (isEdit.value) { await updatePeriod(id, form.value); }
    else { const created = await createPeriod(form.value); id = created.id; router.replace(`/admin/ppdb/${id}/edit`); }
    await Promise.all([upsertRequirements(id, requirements.value), upsertFaqs(id, faqs.value)]);
  } catch (e) { saveError.value = 'Gagal menyimpan periode PPDB. Silakan coba lagi.'; } finally { saving.value = false; }
}

async function handleDelete() {
  saving.value = true;
  try { await deletePeriod(route.params.id as string); showDeleteDialog.value = false; router.push('/admin/ppdb'); } catch (e) { console.error(e); showError('Gagal menghapus data'); } finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ saveError }}</div>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Unit Pendidikan" required :error="errors.unit_id">
            <select v-model="form.unit_id" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20">
              <option value="" disabled>Pilih unit</option>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
            </select>
          </FormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Tahun Ajaran" required :error="errors.academic_year">
              <input v-model="form.academic_year" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="2025/2026" />
            </FormField>
            <FormField label="Judul" required :error="errors.title">
              <input v-model="form.title" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="PPDB Tahun Ajaran 2025/2026" />
            </FormField>
          </div>
          <FormField label="Deskripsi">
            <textarea v-model="form.description!" rows="3" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
          </FormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Status" required>
              <select v-model="form.status" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20">
                <option value="coming_soon">Coming Soon</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </FormField>
            <FormField label="URL Pendaftaran">
              <input v-model="form.registration_url!" type="url" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="https://..." />
            </FormField>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Tanggal Mulai" required :error="errors.start_date">
              <input v-model="form.start_date" type="date" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="Tanggal Selesai" required :error="errors.end_date">
              <input v-model="form.end_date" type="date" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <FormField label="Kontak Nama">
              <input v-model="form.contact_name!" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="Kontak Telepon">
              <input v-model="form.contact_phone!" type="tel" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="Kontak Email">
              <input v-model="form.contact_email!" type="email" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
          </div>
        </div>
        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-[var(--color-bark)]">Persyaratan</h3>
              <button class="text-small text-[var(--color-forest)] hover:underline" @click="addRequirement">+ Tambah</button>
            </div>
            <div v-for="(req, idx) in requirements" :key="idx" class="space-y-2 rounded-lg border border-[var(--color-sand)] p-3">
              <input v-model="req.title" type="text" placeholder="Judul persyaratan" class="w-full rounded border border-[var(--color-sand)] bg-white px-2 py-1.5 text-small text-[var(--color-bark)]" />
              <textarea v-model="req.description" rows="2" placeholder="Deskripsi" class="w-full rounded border border-[var(--color-sand)] bg-white px-2 py-1.5 text-small text-[var(--color-bark)]" />
              <button class="text-xs text-red-500 hover:underline" @click="removeRequirement(idx)">Hapus</button>
            </div>
          </div>
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-[var(--color-bark)]">FAQ</h3>
              <button class="text-small text-[var(--color-forest)] hover:underline" @click="addFaq">+ Tambah</button>
            </div>
            <div v-for="(faq, idx) in faqs" :key="idx" class="space-y-2 rounded-lg border border-[var(--color-sand)] p-3">
              <input v-model="faq.question" type="text" placeholder="Pertanyaan" class="w-full rounded border border-[var(--color-sand)] bg-white px-2 py-1.5 text-small text-[var(--color-bark)]" />
              <textarea v-model="faq.answer" rows="2" placeholder="Jawaban" class="w-full rounded border border-[var(--color-sand)] bg-white px-2 py-1.5 text-small text-[var(--color-bark)]" />
              <button class="text-xs text-red-500 hover:underline" @click="removeFaq(idx)">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <SaveBar :loading="saving" :has-unsaved-changes="hasUnsavedChanges" :status="isEdit ? 'published' : 'draft'" @save="handleSave" @publish="() => handleSave(false)" @archive="() => {}" @delete="showDeleteDialog = true" />
    <ConfirmDialog :open="showDeleteDialog" title="Hapus Periode PPDB" message="Apakah Anda yakin ingin menghapus periode PPDB ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
