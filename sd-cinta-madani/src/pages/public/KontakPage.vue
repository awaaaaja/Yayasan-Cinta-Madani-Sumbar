<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import { submitContactMessage } from "@/services/contact.service";
import { getSiteSettings } from "@/services/settings.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Kontak", description: "Hubungi SD Cinta Madani untuk informasi lebih lanjut." });

const form = ref({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref<string | null>(null);
const settingsLoading = ref(true);
const settings = ref<{ school_name?: string; address?: string; phone?: string; email?: string; maps_url?: string }>({});

function validate(): boolean {
  errors.value = {};
  if (!form.value.name.trim()) errors.value.name = "Nama wajib diisi";
  if (!form.value.email.trim()) errors.value.email = "Email wajib diisi";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = "Email tidak valid";
  if (!form.value.subject.trim()) errors.value.subject = "Subjek wajib diisi";
  if (!form.value.message.trim()) errors.value.message = "Pesan wajib diisi";
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  isSubmitting.value = true;
  submitError.value = null;
  submitSuccess.value = false;

  try {
    await submitContactMessage({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      phone: form.value.phone.trim() || undefined,
      subject: form.value.subject.trim(),
      message: form.value.message.trim(),
    });
    submitSuccess.value = true;
    form.value = { name: "", email: "", phone: "", subject: "", message: "" };
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : "Gagal mengirim pesan. Silakan coba lagi.";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  try {
    const s = await getSiteSettings();
    if (s) {
      settings.value = s;
      if (s.school_name) usePageHead({ title: "Kontak", description: `Hubungi ${s.school_name} untuk informasi lebih lanjut.` });
    }
  } catch { /* silent */ }
  finally { settingsLoading.value = false; }
});
</script>

<template>
  <div>
    <PageHeader title="Kontak" :description="settings.school_name ? `Hubungi ${settings.school_name} untuk informasi lebih lanjut.` : 'Hubungi kami untuk informasi lebih lanjut.'" />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Kontak' }]" />

        <div class="grid lg:grid-cols-[1fr_400px] gap-12 mt-8">
          <!-- Form -->
          <div class="max-w-[620px]">
            <div v-if="submitSuccess" class="bg-surface-soft rounded-[16px] p-6 mb-8">
              <p class="text-body font-semibold text-primary">Pesan berhasil dikirim!</p>
              <p class="text-body text-primary/80 mt-1">Kami akan merespons segera.</p>
            </div>

            <div v-if="submitError" class="bg-red-50 rounded-[16px] p-6 mb-8">
              <p class="text-body text-red-600">{{ submitError }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
              <div>
                <label for="name" class="block text-body font-semibold text-text-950 mb-2">Nama Lengkap *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  :class="[
                    'w-full h-12 px-4 rounded-[var(--radius-sm)] border text-body bg-white transition-colors',
                    errors.name ? 'border-red-500' : 'border-line focus:border-green-700'
                  ]"
                  placeholder="Masukkan nama lengkap"
                />
                <p v-if="errors.name" class="text-small text-red-500 mt-1">{{ errors.name }}</p>
              </div>

              <div>
                <label for="email" class="block text-body font-semibold text-text-950 mb-2">Email *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  :class="[
                    'w-full h-12 px-4 rounded-[var(--radius-sm)] border text-body bg-white transition-colors',
                    errors.email ? 'border-red-500' : 'border-line focus:border-green-700'
                  ]"
                  placeholder="email@contoh.com"
                />
                <p v-if="errors.email" class="text-small text-red-500 mt-1">{{ errors.email }}</p>
              </div>

              <div>
                <label for="phone" class="block text-body font-semibold text-text-950 mb-2">Telepon</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-line text-body bg-white focus:border-green-700 transition-colors"
                  placeholder="08xxx"
                />
              </div>

              <div>
                <label for="subject" class="block text-body font-semibold text-text-950 mb-2">Subjek *</label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  :class="[
                    'w-full h-12 px-4 rounded-[var(--radius-sm)] border text-body bg-white transition-colors',
                    errors.subject ? 'border-red-500' : 'border-line focus:border-green-700'
                  ]"
                  placeholder="Perihal pesan"
                />
                <p v-if="errors.subject" class="text-small text-red-500 mt-1">{{ errors.subject }}</p>
              </div>

              <div>
                <label for="message" class="block text-body font-semibold text-text-950 mb-2">Pesan *</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  :class="[
                    'w-full px-4 py-3 rounded-[var(--radius-sm)] border text-body bg-white resize-none transition-colors',
                    errors.message ? 'border-red-500' : 'border-line focus:border-green-700'
                  ]"
                  placeholder="Tuliskan pesan Anda"
                />
                <p v-if="errors.message" class="text-small text-red-500 mt-1">{{ errors.message }}</p>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="h-12 px-8 bg-primary text-white font-semibold rounded-[var(--radius-sm)] hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
              >
                {{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}
              </button>
            </form>
          </div>

          <!-- Contact Info Sidebar -->
          <div class="space-y-6">
            <div v-if="settingsLoading" class="py-8 text-center text-muted text-small">Memuat informasi kontak...</div>

            <div v-else class="space-y-6">
              <div class="bg-white rounded-[16px] border border-line p-6">
                <h3 class="text-h4 text-text-950 mb-4">Informasi Kontak</h3>
                <div class="space-y-4">
                  <div v-if="settings.address" class="flex gap-3">
                    <svg class="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <div>
                      <p class="text-small text-muted">Alamat</p>
                      <p class="text-body text-text-950">{{ settings.address }}</p>
                    </div>
                  </div>
                  <div v-if="settings.phone" class="flex gap-3">
                    <svg class="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <div>
                      <p class="text-small text-muted">Telepon</p>
                      <a :href="`tel:${settings.phone}`" class="text-body text-text-950 hover:text-primary transition-colors">{{ settings.phone }}</a>
                    </div>
                  </div>
                  <div v-if="settings.email" class="flex gap-3">
                    <svg class="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <div>
                      <p class="text-small text-muted">Email</p>
                      <a :href="`mailto:${settings.email}`" class="text-body text-text-950 hover:text-primary transition-colors">{{ settings.email }}</a>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="settings.maps_url" class="bg-white rounded-[16px] border border-line overflow-hidden">
                <div class="aspect-video bg-surface-soft flex items-center justify-center">
                  <a
                    :href="settings.maps_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex flex-col items-center gap-2 text-primary hover:text-green-600 transition-colors"
                  >
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span class="text-small font-medium">Lihat di Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
