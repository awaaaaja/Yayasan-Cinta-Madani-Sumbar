<script setup lang="ts">
import { ref } from "vue";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import { submitContactMessage } from "@/services/contact.service";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({ title: "Kontak", description: "Hubungi Yayasan Cinta Madani." });

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
</script>

<template>
  <div>
    <PageHeader title="Kontak" description="Hubungi Yayasan Cinta Madani untuk informasi lebih lanjut." />

    <section class="py-[72px] md:py-[96px] lg:py-[120px] bg-background">
      <div class="container-site">
        <Breadcrumb :items="[{ label: 'Kontak' }]" />

        <div class="max-w-[620px]">
          <!-- Success -->
          <div v-if="submitSuccess" class="bg-surface-soft rounded-[16px] p-6 mb-8">
            <p class="text-body font-semibold text-primary">Pesan berhasil dikirim!</p>
            <p class="text-body text-primary/80 mt-1">Kami akan merespons segera.</p>
          </div>

          <!-- Error -->
          <div v-if="submitError" class="bg-red-50 rounded-[16px] p-6 mb-8">
            <p class="text-body text-red-600">{{ submitError }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
            <!-- Name -->
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

            <!-- Email -->
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

            <!-- Phone -->
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

            <!-- Subject -->
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

            <!-- Message -->
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
      </div>
    </section>
  </div>
</template>
