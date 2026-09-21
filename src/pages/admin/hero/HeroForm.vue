<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getHeroSlideById, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '@/services/admin/hero.admin.service';
import MediaPicker from '@/components/admin/MediaPicker.vue';
import type { HeroSlide } from '@/types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
const saving = ref(false);
const error = ref<string | null>(null);

const form = ref({
  title: '',
  description: '',
  image_url: '',
  image_alt: '',
  image_position: 'center',
  duration: 6000,
  sort_order: 0,
  is_active: true,
  cta_label: '',
  cta_url: '',
});

const positionOptions = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

async function fetchSlide() {
  if (!isEdit.value) return;
  try {
    const data = await getHeroSlideById(route.params.id as string);
    form.value = {
      title: data.title || '',
      description: data.description || '',
      image_url: data.image_url,
      image_alt: data.image_alt || '',
      image_position: data.image_position || 'center',
      duration: data.duration || 6000,
      sort_order: data.sort_order || 0,
      is_active: data.is_active,
      cta_label: data.cta_label || '',
      cta_url: data.cta_url || '',
    };
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Gagal memuat data';
  }
}

async function handleSubmit() {
  if (!form.value.image_url) {
    error.value = 'Gambar wajib diupload';
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    const payload: Partial<HeroSlide> = {
      title: form.value.title || null,
      description: form.value.description || null,
      image_url: form.value.image_url,
      image_alt: form.value.image_alt || null,
      image_position: form.value.image_position,
      duration: form.value.duration,
      sort_order: form.value.sort_order,
      is_active: form.value.is_active,
      cta_label: form.value.cta_label || null,
      cta_url: form.value.cta_url || null,
    };

    if (isEdit.value) {
      await updateHeroSlide(route.params.id as string, payload);
    } else {
      await createHeroSlide(payload);
    }
    router.push('/admin/hero');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Gagal menyimpan';
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!isEdit.value) return;
  if (!confirm('Yakin ingin menghapus slide ini?')) return;
  try {
    await deleteHeroSlide(route.params.id as string);
    router.push('/admin/hero');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Gagal menghapus';
  }
}

onMounted(fetchSlide);
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-[var(--color-bark)]">
        {{ isEdit ? 'Edit Slide' : 'Tambah Slide' }}
      </h1>
      <button v-if="isEdit" class="text-sm text-red-500 hover:text-red-700" @click="handleDelete">
        Hapus
      </button>
    </div>

    <div v-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{{ error }}</div>

    <form @submit.prevent="handleSubmit" class="space-y-6 rounded-xl border border-[var(--color-sand)] bg-white p-6">
      <!-- Image via MediaPicker -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-2">Gambar *</label>
        <MediaPicker
          v-model="form.image_url"
          bucket="site-assets"
          folder="hero"
          @remove="form.image_url = ''"
        />
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Judul</label>
        <input v-model="form.title" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Judul slide (opsional)" />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Deskripsi</label>
        <textarea v-model="form.description" rows="2" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Deskripsi singkat (opsional)" />
      </div>

      <!-- Alt Text -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Alt Text</label>
        <input v-model="form.image_alt" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Deskripsi gambar untuk aksesibilitas" />
      </div>

      <!-- Row: Position + Duration -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Posisi Gambar</label>
          <select v-model="form.image_position" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20">
            <option v-for="opt in positionOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Durasi (ms)</label>
          <input v-model.number="form.duration" type="number" min="2000" max="15000" step="500" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
        </div>
      </div>

      <!-- Row: Sort + Active -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">Urutan</label>
          <input v-model.number="form.sort_order" type="number" min="0" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" />
        </div>
        <div class="flex items-end pb-1">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)] focus:ring-[var(--color-forest)]/20" />
            <span class="text-sm font-medium text-[var(--color-bark)]">Aktif</span>
          </label>
        </div>
      </div>

      <!-- CTA -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">CTA Label</label>
          <input v-model="form.cta_label" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="Label tombol (opsional)" />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--color-bark)] mb-1">CTA URL</label>
          <input v-model="form.cta_url" type="text" class="w-full rounded-lg border border-[var(--color-sand)] px-3 py-2 text-body focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20" placeholder="/ppdb" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-4 border-t border-[var(--color-sand)]">
        <button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-forest)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50">
          <svg v-if="saving" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
        <button type="button" class="rounded-lg border border-[var(--color-sand)] px-5 py-2.5 text-sm font-medium text-[var(--color-bark)] hover:bg-[var(--color-cream)]" @click="router.push('/admin/hero')">
          Batal
        </button>
      </div>
    </form>
  </div>
</template>
