<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { signIn } from "@/services/auth.service";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

onMounted(() => {
  document.title = "Login - Admin";
});

async function handleLogin() {
  error.value = "";
  if (!email.value || !password.value) {
    error.value = "Email dan password wajib diisi";
    return;
  }

  loading.value = true;
  try {
    const result = await signIn(email.value, password.value);
    if (result.error) {
      error.value = result.error;
      return;
    }
    router.push("/admin/dashboard");
  } catch {
    error.value = "Terjadi kesalahan. Coba lagi.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-[var(--color-bark)]">Admin Panel</h1>
        <p class="mt-1 text-body text-[var(--color-moss)]">Masuk ke dashboard</p>
      </div>

      <div class="rounded-2xl border border-[var(--color-sand)] bg-white p-6 shadow-sm">
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-1.5">
            <label for="login-email" class="block text-small font-semibold text-[var(--color-bark)]">Email</label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="admin@sekolah.com"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2.5 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
            />
          </div>

          <div class="space-y-1.5">
            <label for="login-password" class="block text-small font-semibold text-[var(--color-bark)]">Password</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan password"
              class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-4 py-2.5 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
            />
          </div>

          <div
            v-if="error"
            role="alert"
            class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-[var(--color-forest)] py-2.5 text-small font-medium text-white hover:bg-[var(--color-moss)] disabled:opacity-50"
          >
            {{ loading ? "Masuk..." : "Masuk" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
