<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import SlugInput from '@/components/admin/SlugInput.vue';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import RichTextEditor from '@/components/admin/RichTextEditor.vue';
import SeoFields from '@/components/admin/SeoFields.vue';
import SaveBar from '@/components/admin/SaveBar.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getProgramById, createProgram, updateProgram, deleteProgram, publishProgram, archiveProgram, getProgramUnitIds } from '@/services/admin/programs.admin.service';
import { listUnits } from '@/services/admin/units.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { Program, EducationUnit } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
document.title = isEdit.value ? 'Edit Program' : 'Tambah Program';

const form = ref<Partial<Program>>({
  title: '',
  slug: '',
  excerpt: '',
  content: {},
  image_url: null,
  icon: '',
  featured: false,
  sort_order: 0,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  og_image_url: '',
});

const selectedUnitIds = ref<string[]>([]);
const units = ref<EducationUnit[]>([]);
const loading = ref(false);
const saving = ref(false);
const showDeleteDialog = ref(false);
const originalStatus = ref('draft');

const { errors, validate, clearErrors } = useFormValidation({ title: [required('Judul')], slug: [required('Slug')] });
const { showError } = useErrorToast();
const saveError = ref('');

const seoValue = computed({
  get: () => ({ title: form.value.seo_title || '', description: form.value.seo_description || '', ogImage: form.value.og_image_url || '' }),
  set: (val) => { form.value.seo_title = val.title; form.value.seo_description = val.description; form.value.og_image_url = val.ogImage; },
});

const originalForm = ref<Partial<Program>>({});
const hasUnsavedChanges = computed(() => {
  if (!isEdit.value) return true;
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value) || JSON.stringify(selectedUnitIds.value) !== JSON.stringify(originalUnitIds.value);
});
const originalUnitIds = ref<string[]>([]);

onMounted(async () => {
  const unitsResult = await listUnits({ pageSize: 100 });
  units.value = unitsResult.data;

  if (isEdit.value) {
    loading.value = true;
    try {
      const data = await getProgramById(route.params.id as string);
      form.value = { ...data };
      originalForm.value = { ...data };
      originalStatus.value = data.status;
      selectedUnitIds.value = await getProgramUnitIds(data.id);
      originalUnitIds.value = [...selectedUnitIds.value];
    } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
  }
});

function toggleUnit(unitId: string) {
  const idx = selectedUnitIds.value.indexOf(unitId);
  if (idx === -1) selectedUnitIds.value.push(unitId);
  else selectedUnitIds.value.splice(idx, 1);
}

async function handleSave(draft: boolean) {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (draft) form.value.status = 'draft';
    if (isEdit.value) {
      await updateProgram(route.params.id as string, form.value, selectedUnitIds.value);
    } else {
      const created = await createProgram(form.value, selectedUnitIds.value);
      router.replace(`/admin/programs/${created.id}/edit`);
    }
  } catch (e: unknown) { saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan data.'; } finally { saving.value = false; }
}

async function handlePublish() {
  clearErrors();
  saveError.value = '';
  if (!validate(form.value)) return;
  saving.value = true;
  try {
    if (isEdit.value) { await publishProgram(route.params.id as string); }
    else { form.value.status = 'published'; const created = await createProgram(form.value, selectedUnitIds.value); router.replace(`/admin/programs/${created.id}/edit`); }
    router.push('/admin/programs');
  } catch (e: unknown) { saveError.value = e instanceof Error ? e.message : 'Terjadi kesalahan saat mempublikasikan data.'; } finally { saving.value = false; }
}

async function handleArchive() {
  saving.value = true;
  try { await archiveProgram(route.params.id as string); router.push('/admin/programs'); } catch (e) { console.error(e); showError('Gagal mengarsipkan data'); } finally { saving.value = false; }
}

async function handleDelete() {
  saving.value = true;
  try { await deleteProgram(route.params.id as string); showDeleteDialog.value = false; router.push('/admin/programs'); } catch (e) { console.error(e); showError('Gagal menghapus data'); } finally { saving.value = false; }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-small text-red-700">{{ saveError }}</div>
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else>
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormField label="Judul Program" required :error="errors.title">
            <input v-model="form.title" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Judul program" />
          </FormField>

          <SlugInput v-model="form.slug!" :source="form.title || ''" table="programs" :exclude-id="isEdit ? (route.params.id as string) : undefined" />

          <FormField label="Ringkasan">
            <textarea v-model="form.excerpt!" rows="3" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Ringkasan program" />
          </FormField>

          <FormField label="Konten">
            <RichTextEditor :model-value="(form.content as unknown as string)" @update:model-value="(val: string) => { form.content = val as unknown as Record<string, unknown> }" placeholder="Konten program..." />
          </FormField>

          <FormField label="Icon (emoji atau nama ikon)">
            <input v-model="form.icon!" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="📘" />
          </FormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <FormField label="Urutan Tampilan">
              <input v-model.number="form.sort_order" type="number" min="0" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
            </FormField>
            <FormField label="Featured">
              <label class="flex items-center gap-2 pt-2">
                <input v-model="form.featured" type="checkbox" class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)] focus:ring-[var(--color-moss)]" />
                <span class="text-body text-[var(--color-bark)]">Tampilkan sebagai program unggulan</span>
              </label>
            </FormField>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-4">
            <h3 class="font-semibold text-[var(--color-bark)]">Gambar</h3>
            <MediaPicker v-model="form.image_url!" bucket="site-assets" folder="programs" />
          </div>

          <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-3">
            <h3 class="font-semibold text-[var(--color-bark)]">Unit Pendidikan</h3>
            <div class="space-y-2">
              <label v-for="unit in units" :key="unit.id" class="flex items-center gap-2">
                <input type="checkbox" :checked="selectedUnitIds.includes(unit.id)" class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)] focus:ring-[var(--color-moss)]" @change="toggleUnit(unit.id)" />
                <span class="text-body text-[var(--color-bark)]">{{ unit.name }}</span>
              </label>
              <p v-if="units.length === 0" class="text-xs text-[var(--color-moss)]">Belum ada unit</p>
            </div>
          </div>

          <SeoFields v-model="seoValue" />
        </div>
      </div>
    </template>

    <SaveBar :loading="saving" :has-unsaved-changes="hasUnsavedChanges" :status="isEdit ? (originalStatus || 'draft') : 'draft'" @save="handleSave" @publish="handlePublish" @archive="handleArchive" @delete="showDeleteDialog = true" />
    <ConfirmDialog :open="showDeleteDialog" title="Hapus Program" message="Apakah Anda yakin ingin menghapus program ini?" confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
