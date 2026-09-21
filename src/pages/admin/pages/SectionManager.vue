<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { listSections, updateSection, deleteSection, reorderSections, getPageByKey } from '@/services/admin/pages.admin.service';
import { useErrorToast } from '@/composables/useErrorToast';
import type { PageSection } from '@/types';

document.title = 'Section Manager - Homepage';

const sections = ref<PageSection[]>([]);
const loading = ref(true);
const saving = ref(false);
const editId = ref<string | null>(null);
const editContent = ref('');
const showDeleteDialog = ref(false);
const deleteTarget = ref<string | null>(null);
const pageId = ref('');
const error = ref('');
const { showError } = useErrorToast();

const sectionLabels: Record<string, string> = {
  hero: 'Hero',
  statistics: 'Statistik / Trust Strip',
  about: 'Tentang Yayasan',
  values: 'Nilai-Nilai',
  units: 'Unit Pendidikan',
  programs: 'Program',
  school_life: 'Kehidupan Sekolah',
  news: 'Berita',
  achievements: 'Prestasi',
  gallery: 'Galeri',
  agenda: 'Agenda',
  ppdb_cta: 'CTA PPDB',
};

const sortedSections = computed(() =>
  [...sections.value].sort((a, b) => a.sort_order - b.sort_order)
);

const editingSection = computed(() =>
  sections.value.find((s) => s.id === editId.value)
);

function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

async function fetchSections() {
  loading.value = true;
  error.value = '';
  try {
    const page = await getPageByKey('home');

    if (!page) { error.value = 'Halaman homepage tidak ditemukan'; return; }
    pageId.value = page.id;

    const result = await listSections(page.id);
    sections.value = result;
  } catch (e) { error.value = 'Gagal memuat section'; console.error(e); showError('Gagal memuat data'); }
  finally { loading.value = false; }
}

function openEdit(section: PageSection) {
  editId.value = section.id;
  editContent.value = formatJson(section.content);
}

function closeEdit() {
  editId.value = null;
  editContent.value = '';
}

async function saveContent() {
  if (!editId.value || !pageId.value) return;
  saving.value = true;
  try {
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(editContent.value); }
    catch { alert('JSON tidak valid'); saving.value = false; return; }

    const section = sections.value.find((s) => s.id === editId.value);
    if (!section) return;

    await updateSection(pageId.value, section.section_key, { content: parsed });
    closeEdit();
    await fetchSections();
  } catch (e) { console.error(e); showError('Gagal menyimpan data'); }
  finally { saving.value = false; }
}

async function toggleVisibility(section: PageSection) {
  if (!pageId.value) return;
  try {
    await updateSection(pageId.value, section.section_key, {
      is_visible: !section.is_visible,
    });
    await fetchSections();
  } catch (e) { console.error(e); showError('Gagal mengubah visibilitas'); }
}

function confirmDelete(id: string) {
  deleteTarget.value = id;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  try {
    await deleteSection(deleteTarget.value);
    showDeleteDialog.value = false;
    deleteTarget.value = null;
    await fetchSections();
  } catch (e) { console.error(e); showError('Gagal menghapus data'); }
}

async function moveUp(index: number) {
  if (index === 0 || !pageId.value) return;
  const sorted = sortedSections.value;
  const current = sorted[index];
  const prev = sorted[index - 1];

  const updates = [
    { id: current.id, sort_order: prev.sort_order },
    { id: prev.id, sort_order: current.sort_order },
  ];

  saving.value = true;
  try {
    await reorderSections(updates);
    await fetchSections();
  } catch (e) { console.error(e); showError('Gagal mengubah urutan'); }
  finally { saving.value = false; }
}

async function moveDown(index: number) {
  const sorted = sortedSections.value;
  if (index >= sorted.length - 1 || !pageId.value) return;
  const current = sorted[index];
  const next = sorted[index + 1];

  const updates = [
    { id: current.id, sort_order: next.sort_order },
    { id: next.id, sort_order: current.sort_order },
  ];

  saving.value = true;
  try {
    await reorderSections(updates);
    await fetchSections();
  } catch (e) { console.error(e); showError('Gagal mengubah urutan'); }
  finally { saving.value = false; }
}

onMounted(fetchSections);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-bark)]">Section Manager</h1>
        <p class="mt-1 text-small text-[var(--color-moss)]">Kelola section homepage: urutan, visibilitas, dan konten.</p>
      </div>
      <a
        href="/"
        target="_blank"
        class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-sand)] px-4 py-2 text-small font-medium text-[var(--color-bark)] hover:bg-[var(--color-cream)]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        Preview
      </a>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat section...</div>

    <div v-else-if="sortedSections.length === 0" class="py-12 text-center text-[var(--color-moss)]">Belum ada section</div>

    <div v-else class="space-y-3">
      <div
        v-for="(section, index) in sortedSections"
        :key="section.id"
        class="rounded-xl border bg-white p-4 transition-colors"
        :class="section.is_visible ? 'border-[var(--color-sand)]' : 'border-dashed border-gray-300 bg-gray-50/50'"
      >
        <div class="flex items-center gap-3">
          <!-- Reorder buttons -->
          <div class="flex flex-col gap-0.5">
            <button
              :disabled="index === 0 || saving"
              class="rounded p-0.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)] disabled:opacity-30"
              title="Pindah ke atas"
              @click="moveUp(index)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
            </button>
            <button
              :disabled="index === sortedSections.length - 1 || saving"
              class="rounded p-0.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)] disabled:opacity-30"
              title="Pindah ke bawah"
              @click="moveDown(index)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <!-- Section info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-[var(--color-moss)]">{{ section.section_key }}</span>
              <span class="text-small text-[var(--color-moss)]">·</span>
              <span class="text-small font-medium text-[var(--color-bark)]">
                {{ sectionLabels[section.section_key] || section.section_key }}
              </span>
            </div>
            <p class="mt-0.5 text-xs text-[var(--color-moss)]">
              Urutan: {{ section.sort_order }} ·
              {{ Object.keys(section.content || {}).length }} field
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              :class="[
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                section.is_visible ? 'bg-[var(--color-forest)]' : 'bg-gray-300',
              ]"
              :title="section.is_visible ? 'Sembunyikan' : 'Tampilkan'"
              @click="toggleVisibility(section)"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform',
                  section.is_visible ? 'translate-x-5' : 'translate-x-0',
                ]"
              />
            </button>
            <button
              class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]"
              title="Edit konten"
              @click="openEdit(section)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button
              class="rounded p-1.5 text-red-500 hover:bg-red-50"
              title="Hapus section"
              @click="confirmDelete(section.id)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editId && editingSection" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div class="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-[var(--color-sand)] px-6 py-4">
          <div>
            <h2 class="text-lg font-semibold text-[var(--color-bark)]">
              Edit: {{ sectionLabels[editingSection.section_key] || editingSection.section_key }}
            </h2>
            <p class="text-xs text-[var(--color-moss)]">Ubah konten JSON section ini.</p>
          </div>
          <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="closeEdit">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="px-6 py-4">
          <textarea
            v-model="editContent"
            rows="20"
            class="w-full rounded-lg border border-[var(--color-sand)] bg-gray-50 px-4 py-3 font-mono text-xs text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
            spellcheck="false"
          />
        </div>
        <div class="flex justify-end gap-3 border-t border-[var(--color-sand)] px-6 py-4">
          <button class="rounded-lg border border-[var(--color-sand)] px-4 py-2 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)]" @click="closeEdit">Batal</button>
          <button :disabled="saving" class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50" @click="saveContent">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Section" message="Apakah Anda yakin ingin menghapus section ini? Section akan dihapus permanen." confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
