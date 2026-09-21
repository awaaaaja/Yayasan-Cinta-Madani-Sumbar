<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import SectionContentEditor from '@/components/admin/SectionContentEditor.vue';
import { listSections, updateSection, deleteSection, reorderSections, getPageByKey, listPages } from '@/services/admin/pages.admin.service';
import { useErrorToast } from '@/composables/useErrorToast';
import { useFocusTrap } from '@/composables/useFocusTrap';
import type { Page, PageSection } from '@/types';

const sections = ref<PageSection[]>([]);
const pages = ref<Page[]>([]);
const loading = ref(true);
const saving = ref(false);
const editId = ref<string | null>(null);
const editContent = ref<Record<string, unknown>>({});
const showDeleteDialog = ref(false);
const deleteTarget = ref<string | null>(null);
const showAddDialog = ref(false);
const newSectionKey = ref('');
const pageId = ref('');
const selectedPageKey = ref('home');
const error = ref('');
const editModalRef = ref<HTMLElement | null>(null);
const addModalRef = ref<HTMLElement | null>(null);
const { showError } = useErrorToast();

const editModalOpen = computed(() => editId.value !== null);
useFocusTrap(editModalOpen, editModalRef);
const addModalOpen = computed(() => showAddDialog.value);
useFocusTrap(addModalOpen, addModalRef);

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
  about_hero: 'Hero Tentang',
  about_profile: 'Profil Lembaga',
  about_values: 'Nilai-Nilai Lembaga',
  about_history: 'Sejarah / Timeline',
  program_hero: 'Hero Program',
  program_featured: 'Program Unggulan',
  program_grid: 'Daftar Program',
  news_hero: 'Hero Berita',
  news_featured: 'Berita Unggulan',
  gallery_hero: 'Hero Galeri',
  agenda_hero: 'Hero Agenda',
  agenda_info: 'Info Agenda',
};

const availableSectionTypes = [
  { value: 'hero', label: 'Hero', defaultContent: { heading: '', description: '', image: '' } },
  { value: 'about_profile', label: 'Profil Lembaga', defaultContent: { heading: '', description: '', image: '', stats: [] } },
  { value: 'about_values', label: 'Nilai-Nilai', defaultContent: { items: [] } },
  { value: 'about_history', label: 'Sejarah / Timeline', defaultContent: { items: [] } },
  { value: 'program_hero', label: 'Hero Program', defaultContent: { heading: '', description: '', image: '' } },
  { value: 'program_featured', label: 'Program Unggulan', defaultContent: { heading: '', description: '' } },
  { value: 'news_hero', label: 'Hero Berita', defaultContent: { heading: '', description: '', image: '' } },
  { value: 'gallery_hero', label: 'Hero Galeri', defaultContent: { heading: '', description: '', image: '' } },
  { value: 'agenda_hero', label: 'Hero Agenda', defaultContent: { heading: '', description: '', image: '' } },
  { value: 'agenda_info', label: 'Info Agenda', defaultContent: { items: [] } },
  { value: 'custom', label: 'Custom Section', defaultContent: {} },
];

const pageOptions = computed(() =>
  pages.value.map((p) => ({ label: p.title, value: p.page_key }))
);

const sortedSections = computed(() =>
  [...sections.value].sort((a, b) => a.sort_order - b.sort_order)
);

const editingSection = computed(() =>
  sections.value.find((s) => s.id === editId.value)
);

const selectedSectionType = computed(() =>
  availableSectionTypes.find(t => t.value === newSectionKey.value)
);

async function fetchPages() {
  try {
    const result = await listPages({ pageSize: 50 });
    pages.value = result.data || [];
  } catch { /* ignore */ }
}

async function fetchSections() {
  loading.value = true;
  error.value = '';
  try {
    const page = await getPageByKey(selectedPageKey.value);
    if (!page) { error.value = 'Halaman tidak ditemukan'; sections.value = []; return; }
    pageId.value = page.id;
    sections.value = await listSections(page.id);
  } catch (e) { error.value = 'Gagal memuat section'; console.error(e); showError('Gagal memuat data'); }
  finally { loading.value = false; }
}

function openEdit(section: PageSection) {
  editId.value = section.id;
  editContent.value = { ...(section.content || {}) };
}

function closeEdit() {
  editId.value = null;
  editContent.value = {};
}

async function saveContent() {
  if (!editId.value || !pageId.value) return;
  saving.value = true;
  try {
    const section = sections.value.find((s) => s.id === editId.value);
    if (!section) return;

    await updateSection(pageId.value, section.section_key, { content: editContent.value });
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

function openAddDialog() {
  newSectionKey.value = '';
  showAddDialog.value = true;
}

async function createSection() {
  if (!newSectionKey.value || !pageId.value) return;
  saving.value = true;
  try {
    const sectionType = availableSectionTypes.find(t => t.value === newSectionKey.value);
    const defaultContent = sectionType?.defaultContent || {};
    const maxOrder = sortedSections.value.length > 0
      ? Math.max(...sortedSections.value.map(s => s.sort_order))
      : 0;

    await updateSection(pageId.value, newSectionKey.value, {
      content: defaultContent,
      sort_order: maxOrder + 1,
      is_visible: true,
    });
    showAddDialog.value = false;
    newSectionKey.value = '';
    await fetchSections();
  } catch (e) { console.error(e); showError('Gagal membuat section'); }
  finally { saving.value = false; }
}

watch(selectedPageKey, () => fetchSections());

onMounted(async () => {
  await fetchPages();
  await fetchSections();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-bark)]">Section Manager</h1>
        <p class="mt-1 text-small text-[var(--color-moss)]">Kelola section halaman: urutan, visibilitas, dan konten.</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] transition-colors"
          @click="openAddDialog"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Tambah Section
        </button>
        <a
          :href="'/' + (selectedPageKey === 'home' ? '' : selectedPageKey)"
          target="_blank"
          class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-sand)] px-4 py-2 text-small font-medium text-[var(--color-bark)] hover:bg-[var(--color-cream)]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Preview
        </a>
      </div>
    </div>

    <!-- Page selector -->
    <div class="flex items-center gap-3">
      <label class="text-small font-medium text-[var(--color-bark)]">Halaman:</label>
      <select
        v-model="selectedPageKey"
        class="rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
      >
        <option v-for="opt in pageOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat section...</div>

    <div v-else-if="sortedSections.length === 0" class="py-12 text-center text-[var(--color-moss)]">
      Belum ada section. Klik "Tambah Section" untuk menambahkan.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(section, index) in sortedSections"
        :key="section.id"
        class="rounded-xl border bg-white p-4 transition-colors"
        :class="section.is_visible ? 'border-[var(--color-sand)]' : 'border-dashed border-gray-300 bg-gray-50/50'"
      >
        <div class="flex items-center gap-3">
          <div class="flex flex-col gap-0.5">
            <button
              :disabled="index === 0 || saving"
              class="rounded p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-moss)] hover:bg-[var(--color-cream)] disabled:opacity-30"
              title="Pindah ke atas"
              @click="moveUp(index)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
            </button>
            <button
              :disabled="index === sortedSections.length - 1 || saving"
              class="rounded p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-moss)] hover:bg-[var(--color-cream)] disabled:opacity-30"
              title="Pindah ke bawah"
              @click="moveDown(index)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

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

          <div class="flex items-center gap-1">
            <button
              :class="[
                'relative inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors',
                section.is_visible ? 'bg-[var(--color-forest)]' : 'bg-gray-300',
              ]"
              :aria-label="section.is_visible ? 'Sembunyikan section' : 'Tampilkan section'"
              :aria-pressed="section.is_visible"
              role="switch"
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
              class="rounded p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-moss)] hover:bg-[var(--color-cream)]"
              title="Edit konten"
              @click="openEdit(section)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button
              class="rounded p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-500 hover:bg-red-50"
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
      <div ref="editModalRef" class="w-full max-w-2xl rounded-xl bg-white shadow-xl" role="dialog" aria-modal="true" :aria-label="'Edit: ' + (sectionLabels[editingSection.section_key] || editingSection.section_key)">
        <div class="flex items-center justify-between border-b border-[var(--color-sand)] px-6 py-4">
          <div>
            <h2 class="text-lg font-semibold text-[var(--color-bark)]">
              Edit: {{ sectionLabels[editingSection.section_key] || editingSection.section_key }}
            </h2>
            <p class="text-xs text-[var(--color-moss)]">Ubah konten section ini.</p>
          </div>
          <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="closeEdit">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <SectionContentEditor
            v-if="editingSection"
            :section-key="editingSection.section_key"
            :content="editContent"
            @update:content="editContent = $event"
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

    <!-- Add Section Modal -->
    <div v-if="showAddDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div ref="addModalRef" class="w-full max-w-md rounded-xl bg-white shadow-xl" role="dialog" aria-modal="true" aria-label="Tambah Section">
        <div class="flex items-center justify-between border-b border-[var(--color-sand)] px-6 py-4">
          <h2 class="text-lg font-semibold text-[var(--color-bark)]">Tambah Section</h2>
          <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="showAddDialog = false">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="px-6 py-4">
          <label class="block text-small font-medium text-[var(--color-bark)] mb-2">Tipe Section</label>
          <select
            v-model="newSectionKey"
            class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
          >
            <option value="" disabled>Pilih tipe section...</option>
            <option v-for="type in availableSectionTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
          <p v-if="selectedSectionType" class="mt-2 text-xs text-[var(--color-moss)]">
            {{ selectedSectionType.value === 'custom' ? 'Section kosong yang bisa diisi sesuai kebutuhan.' : `Default content: ${Object.keys(selectedSectionType.defaultContent).join(', ')}` }}
          </p>
        </div>
        <div class="flex justify-end gap-3 border-t border-[var(--color-sand)] px-6 py-4">
          <button class="rounded-lg border border-[var(--color-sand)] px-4 py-2 text-small text-[var(--color-bark)] hover:bg-[var(--color-cream)]" @click="showAddDialog = false">Batal</button>
          <button
            :disabled="!newSectionKey || saving"
            class="rounded-lg bg-[var(--color-forest)] px-4 py-2 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50"
            @click="createSection"
          >
            {{ saving ? 'Membuat...' : 'Buat Section' }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog :open="showDeleteDialog" title="Hapus Section" message="Apakah Anda yakin ingin menghapus section ini? Section akan dihapus permanen." confirm-label="Hapus" confirm-variant="danger" @confirm="handleDelete" @cancel="showDeleteDialog = false" />
  </div>
</template>
