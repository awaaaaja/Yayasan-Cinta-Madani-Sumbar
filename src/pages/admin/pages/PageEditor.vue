<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormField from '@/components/admin/FormField.vue';
import SeoFields from '@/components/admin/SeoFields.vue';
import { getPageById, updatePage, listSections, updateSection } from '@/services/admin/pages.admin.service';
import { useFormValidation, required } from '@/composables/useFormValidation';
import { useErrorToast } from '@/composables/useErrorToast';
import type { Page, PageSection } from '@/types';

const route = useRoute();
const router = useRouter();
document.title = 'Edit Halaman';

const pageData = ref<Page | null>(null);
const sections = ref<PageSection[]>([]);
const loading = ref(true);
const saving = ref(false);
const saveError = ref('');

const { errors, validate, clearErrors } = useFormValidation({
  title: [required('Judul Halaman')],
});
const { showError } = useErrorToast();

const seoValue = ref({ title: '', description: '', ogImage: '' });

onMounted(async () => {
  try {
    const data = await getPageById(route.params.id as string);
    pageData.value = data;
    seoValue.value = { title: data.seo_title || '', description: data.seo_description || '', ogImage: data.og_image_url || '' };
    sections.value = await listSections(data.id);
  } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
});

async function handleSave() {
  if (!pageData.value) return;
  clearErrors();
  saveError.value = '';
  if (!validate({ title: pageData.value.title })) return;
  saving.value = true;
  try {
    await updatePage(pageData.value.id, {
      seo_title: seoValue.value.title,
      seo_description: seoValue.value.description,
      og_image_url: seoValue.value.ogImage,
    });
    for (const section of sections.value) {
      await updateSection(pageData.value.id, section.section_key, {
        title: section.title,
        subtitle: section.subtitle,
        content: section.content,
        is_visible: section.is_visible,
        sort_order: section.sort_order,
      });
    }
    router.push('/admin/pages');
  } catch (e) { saveError.value = 'Gagal menyimpan halaman. Silakan coba lagi.'; } finally { saving.value = false; }
}

function updateSectionContent(idx: number, field: string, value: unknown) {
  const section = sections.value[idx];
  if (field === 'content') {
    try {
      section.content = JSON.parse(value as string);
    } catch {
      section.content = { raw: value };
    }
  } else {
    (section as Record<string, unknown>)[field] = value;
  }
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>
    <template v-else-if="pageData">
      <div v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ saveError }}</div>
      <div v-if="errors.title" class="text-xs text-red-600">{{ errors.title }}</div>
      <div class="flex items-center gap-3">
        <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="router.push('/admin/pages')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 class="text-2xl font-bold text-[var(--color-bark)]">{{ pageData.title }}</h1>
        <span :class="['inline-flex rounded-full px-2 py-0.5 text-xs font-medium', pageData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">{{ pageData.status }}</span>
      </div>

      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-4 space-y-6">
        <h2 class="font-semibold text-[var(--color-bark)]">Sections</h2>
        <div v-for="(section, idx) in sections" :key="section.id" class="rounded-lg border border-[var(--color-sand)] p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-small font-medium text-[var(--color-moss)]">{{ section.section_key }}</span>
            <label class="flex items-center gap-2 text-small">
              <input type="checkbox" :checked="section.is_visible" class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)]" @change="section.is_visible = ($event.target as HTMLInputElement).checked" />
              Visible
            </label>
          </div>
          <FormField label="Judul Section">
            <input :value="section.title" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)]" @input="updateSectionContent(idx, 'title', ($event.target as HTMLInputElement).value)" />
          </FormField>
          <FormField label="Subtitle">
            <input :value="section.subtitle" type="text" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)]" @input="updateSectionContent(idx, 'subtitle', ($event.target as HTMLInputElement).value)" />
          </FormField>
          <FormField label="Content (JSON)">
            <textarea :value="JSON.stringify(section.content, null, 2)" rows="6" class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 font-mono text-xs text-[var(--color-bark)]" @input="updateSectionContent(idx, 'content', ($event.target as HTMLTextAreaElement).value)" />
          </FormField>
        </div>
        <div v-if="sections.length === 0" class="py-8 text-center text-[var(--color-moss)]">Tidak ada section</div>
      </div>

      <SeoFields v-model="seoValue" />
    </template>

    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-sand)] bg-white shadow-lg">
      <div class="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-3">
        <button class="rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)]" @click="router.push('/admin/pages')">Batal</button>
        <button :disabled="saving" class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="handleSave">Simpan</button>
      </div>
    </div>
  </div>
</template>
