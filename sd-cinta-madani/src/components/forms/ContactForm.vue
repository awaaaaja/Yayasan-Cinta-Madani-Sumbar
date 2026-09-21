/**
 * Contact form with client-side validation and Supabase submission.
 * Fields: name, email, phone, subject, message.
 * Self-contained — no props. Emits submitSuccess on successful send.
 */
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { submitContactMessage } from '@/services/contact.service'
import FormField from '@/components/admin/FormField.vue'
import Button from '@/components/common/Button.vue'

const emit = defineEmits<{
  submitSuccess: [message: string]
}>()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const errors = reactive<Record<string, string>>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const loading = ref(false)
const submitted = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.subject = ''
  errors.message = ''

  if (!form.name || form.name.length < 2) {
    errors.name = 'Nama harus minimal 2 karakter.'
    valid = false
  }
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Email tidak valid.'
    valid = false
  }
  if (form.phone && form.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Nomor telepon minimal 7 digit.'
    valid = false
  }
  if (!form.subject || form.subject.length < 3) {
    errors.subject = 'Subjek harus minimal 3 karakter.'
    valid = false
  }
  if (!form.message || form.message.length < 10) {
    errors.message = 'Pesan harus minimal 10 karakter.'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true

  try {
    await submitContactMessage({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      subject: form.subject,
      message: form.message,
    })

    submitted.value = true
    emit('submitSuccess', 'Pesan berhasil dikirim!')
  } catch {
    errors.message = 'Gagal mengirim pesan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form
    v-if="!submitted"
    aria-label="Formulir kontak"
    class="space-y-5"
    @submit.prevent="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField label="Nama" :error="errors.name" required>
        <input
          v-model="form.name"
          type="text"
          required
          autocomplete="name"
          placeholder="Nama lengkap"
          class="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </FormField>

      <FormField label="Email" :error="errors.email" required>
        <input
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          placeholder="nama@email.com"
          class="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </FormField>

      <FormField label="Telepon" :error="errors.phone">
        <input
          v-model="form.phone"
          type="tel"
          autocomplete="tel"
          placeholder="08xxxxxxxxxx"
          class="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </FormField>

      <FormField label="Subjek" :error="errors.subject" required>
        <input
          v-model="form.subject"
          type="text"
          required
          placeholder="Perihal pesan"
          class="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </FormField>
    </div>

    <FormField label="Pesan" :error="errors.message" required>
      <textarea
        v-model="form.message"
        rows="5"
        required
        placeholder="Tuliskan pesan Anda..."
        class="w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-y"
      />
    </FormField>

    <Button
      type="submit"
      variant="primary"
      :disabled="loading"
      class="w-full md:w-auto min-h-[48px]"
    >
      <template v-if="loading">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Mengirim...
      </template>
      <template v-else>
        Kirim Pesan
      </template>
    </Button>
  </form>

  <div v-else class="text-center py-12 space-y-4">
    <div class="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
      <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 class="text-h3 text-[var(--color-primary)]">Pesan terkirim!</h3>
    <p class="text-body text-[var(--color-text)]">Terima kasih telah menghubungi kami. Kami akan merespons segera.</p>
  </div>
</template>
