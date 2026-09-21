<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { getRegistrationById, getRegistrationDocuments, verifyRegistration, acceptRegistration, rejectRegistration } from '@/services/admin/ppdb-registrations.admin.service';
import type { PpdbRegistration, PpdbDocument } from '@/services/admin/ppdb-registrations.admin.service';
import { useErrorToast } from '@/composables/useErrorToast';

const route = useRoute();
const router = useRouter();
const { showError } = useErrorToast();

document.title = 'Detail Registrasi PPDB';

const reg = ref<PpdbRegistration | null>(null);
const documents = ref<PpdbDocument[]>([]);
const loading = ref(true);
const saving = ref(false);
const adminNotes = ref('');
const showVerifyDialog = ref(false);
const showAcceptDialog = ref(false);
const showRejectDialog = ref(false);

// Document preview
const previewOpen = ref(false);
const previewDoc = ref<PpdbDocument | null>(null);

async function fetchData() {
  loading.value = true;
  try {
    const [r, d] = await Promise.all([
      getRegistrationById(route.params.id as string),
      getRegistrationDocuments(route.params.id as string),
    ]);
    reg.value = r;
    documents.value = d;
    adminNotes.value = r.admin_notes || '';
  } catch (e) { console.error(e); showError('Gagal memuat data'); } finally { loading.value = false; }
}

onMounted(fetchData);

async function handleVerify() {
  if (!reg.value) return;
  saving.value = true;
  try {
    reg.value = await verifyRegistration(reg.value.id);
    showVerifyDialog.value = false;
  } catch (e) { console.error(e); showError('Gagal verify'); } finally { saving.value = false; }
}

async function handleAccept() {
  if (!reg.value) return;
  saving.value = true;
  try {
    reg.value = await acceptRegistration(reg.value.id, adminNotes.value);
    showAcceptDialog.value = false;
  } catch (e) { console.error(e); showError('Gagal accept'); } finally { saving.value = false; }
}

async function handleReject() {
  if (!reg.value) return;
  if (!adminNotes.value.trim()) { showError('Catatan wajib diisi untuk penolakan'); return; }
  saving.value = true;
  try {
    reg.value = await rejectRegistration(reg.value.id, adminNotes.value);
    showRejectDialog.value = false;
  } catch (e) { console.error(e); showError('Gagal reject'); } finally { saving.value = false; }
}

function openPreview(doc: PpdbDocument) {
  previewDoc.value = doc;
  previewOpen.value = true;
}

function closePreview() {
  previewOpen.value = false;
  previewDoc.value = null;
}

function downloadDoc(doc: PpdbDocument) {
  const a = document.createElement('a');
  a.href = doc.file_url;
  a.download = doc.file_name;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.click();
}

function isImage(fileName: string) {
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(fileName);
}

function isPdf(fileName: string) {
  return /\.pdf$/i.test(fileName);
}

function onPreviewKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePreview();
}

function statusColor(s: string) {
  switch (s) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'verified': return 'bg-blue-100 text-blue-700';
    case 'accepted': return 'bg-emerald-100 text-emerald-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-500';
  }
}

function statusLabel(s: string) {
  switch (s) {
    case 'pending': return 'Pending';
    case 'verified': return 'Verified';
    case 'accepted': return 'Diterima';
    case 'rejected': return 'Ditolak';
    default: return s;
  }
}

function genderLabel(g: string) { return g === 'L' ? 'Laki-laki' : 'Perempuan'; }
function formatDate(d: string) { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }); }
function formatDateTime(d: string) { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }

const docLabels: Record<string, string> = {
  birth_certificate: 'Akte Kelahiran',
  family_card: 'Kartu Keluarga',
  student_photo: 'Foto Siswa',
  diploma: 'Ijazah',
};

const docIcons: Record<string, string> = {
  birth_certificate: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  family_card: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  student_photo: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  diploma: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
};
</script>

<template>
  <div class="space-y-6">
    <!-- Back + title -->
    <div class="flex items-center gap-3">
      <button
        class="rounded-lg border border-[var(--color-sand)] p-2 text-[var(--color-moss)] hover:bg-[var(--color-cream)]"
        @click="router.push('/admin/registrations')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">Detail Registrasi</h1>
    </div>

    <div v-if="loading" class="py-12 text-center text-[var(--color-moss)]">Memuat data...</div>

    <template v-else-if="reg">
      <!-- Header card -->
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-small text-[var(--color-moss)]">No. Registrasi</p>
            <p class="text-h2 font-mono text-[var(--color-bark)]">{{ reg.registration_number }}</p>
          </div>
          <span :class="['inline-flex rounded-full px-3 py-1 text-small font-medium', statusColor(reg.status)]">
            {{ statusLabel(reg.status) }}
          </span>
        </div>
      </div>

      <!-- Status & Aksi -->
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6">
        <h3 class="mb-4 font-semibold text-[var(--color-bark)]">Status & Aksi</h3>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div class="flex-1">
            <label class="mb-1 block text-small text-[var(--color-moss)]">Status Saat Ini</label>
            <span :class="['inline-flex rounded-full px-3 py-1 text-small font-medium', statusColor(reg.status)]">
              {{ statusLabel(reg.status) }}
            </span>
          </div>
          <div class="flex-1">
            <label for="admin-notes" class="mb-1 block text-small text-[var(--color-moss)]">Catatan Admin</label>
            <textarea
              id="admin-notes"
              v-model="adminNotes"
              rows="3"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
              placeholder="Catatan internal (wajib diisi jika reject)..."
            />
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-if="reg.status === 'pending'"
            class="rounded-lg bg-blue-600 px-4 py-2 text-small font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            :disabled="saving"
            @click="showVerifyDialog = true"
          >
            Verify
          </button>
          <button
            v-if="reg.status === 'verified'"
            class="rounded-lg bg-emerald-600 px-4 py-2 text-small font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            :disabled="saving"
            @click="showAcceptDialog = true"
          >
            Accept
          </button>
          <button
            v-if="reg.status === 'pending' || reg.status === 'verified'"
            class="rounded-lg bg-red-600 px-4 py-2 text-small font-medium text-white hover:bg-red-700 disabled:opacity-50"
            :disabled="saving"
            @click="showRejectDialog = true"
          >
            Reject
          </button>
        </div>
      </div>

      <!-- Data Siswa -->
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6">
        <h3 class="mb-4 font-semibold text-[var(--color-bark)]">Data Siswa</h3>
        <dl class="grid grid-cols-1 gap-x-8 gap-y-3 text-small sm:grid-cols-2">
          <div><dt class="text-[var(--color-moss)]">NIK</dt><dd class="font-mono text-[var(--color-bark)]">{{ reg.nik }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">NISN</dt><dd class="font-mono text-[var(--color-bark)]">{{ reg.nisn || '-' }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Nama Lengkap</dt><dd class="text-[var(--color-bark)]">{{ reg.full_name }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Tempat, Tanggal Lahir</dt><dd class="text-[var(--color-bark)]">{{ reg.birth_place }}, {{ formatDate(reg.birth_date) }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Jenis Kelamin</dt><dd class="text-[var(--color-bark)]">{{ genderLabel(reg.gender) }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Agama</dt><dd class="text-[var(--color-bark)]">{{ reg.religion }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-[var(--color-moss)]">Alamat Lengkap</dt><dd class="text-[var(--color-bark)]">{{ reg.address }}{{ reg.rt ? `, RT ${reg.rt}` : '' }}{{ reg.rw ? `/RW ${reg.rw}` : '' }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Kelurahan</dt><dd class="text-[var(--color-bark)]">{{ reg.kelurahan }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Kecamatan</dt><dd class="text-[var(--color-bark)]">{{ reg.kecamatan }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Kabupaten</dt><dd class="text-[var(--color-bark)]">{{ reg.kabupaten }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Provinsi</dt><dd class="text-[var(--color-bark)]">{{ reg.provinsi }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Kode Pos</dt><dd class="text-[var(--color-bark)]">{{ reg.kode_pos || '-' }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Telepon</dt><dd class="text-[var(--color-bark)]">{{ reg.phone || '-' }}</dd></div>
        </dl>
      </div>

      <!-- Data Orang Tua -->
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6">
        <h3 class="mb-4 font-semibold text-[var(--color-bark)]">Data Orang Tua</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <!-- Ayah -->
          <div class="rounded-lg border border-[var(--color-sand)] p-4">
            <p class="mb-2 text-small font-medium text-[var(--color-forest)]">Ayah</p>
            <dl class="space-y-1 text-small">
              <div><dt class="text-[var(--color-moss)]">Nama</dt><dd class="text-[var(--color-bark)]">{{ reg.father_name }}</dd></div>
              <div><dt class="text-[var(--color-moss)]">Pekerjaan</dt><dd class="text-[var(--color-bark)]">{{ reg.father_occupation || '-' }}</dd></div>
              <div><dt class="text-[var(--color-moss)]">Penghasilan</dt><dd class="text-[var(--color-bark)]">{{ reg.father_income || '-' }}</dd></div>
            </dl>
          </div>
          <!-- Ibu -->
          <div class="rounded-lg border border-[var(--color-sand)] p-4">
            <p class="mb-2 text-small font-medium text-[var(--color-forest)]">Ibu</p>
            <dl class="space-y-1 text-small">
              <div><dt class="text-[var(--color-moss)]">Nama</dt><dd class="text-[var(--color-bark)]">{{ reg.mother_name }}</dd></div>
              <div><dt class="text-[var(--color-moss)]">Pekerjaan</dt><dd class="text-[var(--color-bark)]">{{ reg.mother_occupation || '-' }}</dd></div>
              <div><dt class="text-[var(--color-moss)]">Penghasilan</dt><dd class="text-[var(--color-bark)]">{{ reg.mother_income || '-' }}</dd></div>
            </dl>
          </div>
          <!-- Wali -->
          <div class="rounded-lg border border-[var(--color-sand)] p-4">
            <p class="mb-2 text-small font-medium text-[var(--color-forest)]">Wali</p>
            <dl class="space-y-1 text-small">
              <div><dt class="text-[var(--color-moss)]">Nama</dt><dd class="text-[var(--color-bark)]">{{ reg.guardian_name || '-' }}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Asal Sekolah -->
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6">
        <h3 class="mb-4 font-semibold text-[var(--color-bark)]">Asal Sekolah</h3>
        <dl class="grid grid-cols-1 gap-x-8 gap-y-3 text-small sm:grid-cols-2">
          <div><dt class="text-[var(--color-moss)]">Nama Sekolah</dt><dd class="text-[var(--color-bark)]">{{ reg.previous_school }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">NPSN</dt><dd class="font-mono text-[var(--color-bark)]">{{ reg.previous_school_npsn || '-' }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-[var(--color-moss)]">Alamat Sekolah</dt><dd class="text-[var(--color-bark)]">{{ reg.previous_school_address || '-' }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Tahun Lulus</dt><dd class="text-[var(--color-bark)]">{{ reg.graduation_year }}</dd></div>
        </dl>
      </div>

      <!-- Dokumen -->
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6">
        <h3 class="mb-4 font-semibold text-[var(--color-bark)]">Dokumen</h3>
        <div v-if="documents.length === 0" class="py-6 text-center text-small text-[var(--color-moss)]">Belum ada dokumen diupload.</div>
        <div v-else class="space-y-2">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="flex items-center gap-3 rounded-lg border border-[var(--color-sand)] p-3 transition-colors hover:bg-[var(--color-cream)]"
          >
            <svg class="h-8 w-8 shrink-0 text-[var(--color-moss)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="docIcons[doc.document_type] || docIcons.birth_certificate" />
            </svg>
            <div class="min-w-0 flex-1">
              <p class="text-small font-medium text-[var(--color-bark)]">{{ docLabels[doc.document_type] || doc.document_type }}</p>
              <p class="truncate text-xs text-[var(--color-moss)]">{{ doc.file_name }}</p>
            </div>
            <div class="flex shrink-0 gap-1">
              <button
                v-if="isImage(doc.file_name) || isPdf(doc.file_name)"
                class="rounded p-1.5 text-[var(--color-forest)] hover:bg-[var(--color-cream)]"
                title="Lihat"
                @click.stop="openPreview(doc)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              <button
                class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]"
                title="Download"
                @click.stop="downloadDoc(doc)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="rounded-xl border border-[var(--color-sand)] bg-white p-6">
        <h3 class="mb-4 font-semibold text-[var(--color-bark)]">Informasi</h3>
        <dl class="grid grid-cols-1 gap-x-8 gap-y-3 text-small sm:grid-cols-2">
          <div><dt class="text-[var(--color-moss)]">Didaftarkan</dt><dd class="text-[var(--color-bark)]">{{ formatDateTime(reg.created_at) }}</dd></div>
          <div><dt class="text-[var(--color-moss)]">Terakhir Diperbarui</dt><dd class="text-[var(--color-bark)]">{{ formatDateTime(reg.updated_at) }}</dd></div>
        </dl>
      </div>
    </template>

    <!-- Confirm dialogs -->
    <ConfirmDialog
      :open="showVerifyDialog"
      title="Verify Registrasi"
      message="Yakin ingin memverifikasi registrasi ini? Status akan berubah menjadi 'verified'."
      confirm-label="Verify"
      @confirm="handleVerify"
      @cancel="showVerifyDialog = false"
    />
    <ConfirmDialog
      :open="showAcceptDialog"
      title="Accept Registrasi"
      message="Yakin ingin menerima registrasi ini?"
      confirm-label="Accept"
      @confirm="handleAccept"
      @cancel="showAcceptDialog = false"
    />
    <ConfirmDialog
      :open="showRejectDialog"
      title="Reject Registrasi"
      message="Yakin ingin menolak registrasi ini? Catatan admin wajib diisi."
      confirm-label="Reject"
      confirm-variant="danger"
      @confirm="handleReject"
      @cancel="showRejectDialog = false"
    />

    <!-- Document preview modal -->
    <Teleport to="body">
      <div
        v-if="previewOpen && previewDoc"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`Preview: ${previewDoc.file_name}`"
        @keydown="onPreviewKeydown"
        @click.self="closePreview"
      >
        <div class="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-xl bg-white shadow-2xl">
          <div class="flex items-center justify-between border-b border-[var(--color-sand)] px-4 py-3">
            <p class="truncate text-small font-medium text-[var(--color-bark)]">{{ previewDoc.file_name }}</p>
            <button class="ml-4 rounded p-1 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="closePreview">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="flex items-center justify-center p-2">
            <img
              v-if="isImage(previewDoc.file_name)"
              :src="previewDoc.file_url"
              :alt="previewDoc.file_name"
              class="max-h-[80vh] max-w-full object-contain"
            />
            <iframe
              v-else-if="isPdf(previewDoc.file_name)"
              :src="previewDoc.file_url"
              class="h-[80vh] w-[80vw]"
              :title="previewDoc.file_name"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
