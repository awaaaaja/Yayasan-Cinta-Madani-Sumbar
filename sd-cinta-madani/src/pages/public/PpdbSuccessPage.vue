<script setup lang="ts">
import { useRoute } from "vue-router";
import PageHeader from "@/components/sections/PageHeader.vue";
import Breadcrumb from "@/components/common/Breadcrumb.vue";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({
  title: "Pendaftaran Berhasil",
  description: "Pendaftaran PPDB SD Cinta Madani berhasil dikirim.",
});

const route = useRoute();
const regNumber = (route.query.reg as string) || "";

const breadcrumbs = [
  { label: "Beranda", to: "/" },
  { label: "PPDB", to: "/ppdb" },
  { label: "Berhasil" },
];
</script>

<template>
  <div>
    <PageHeader title="Pendaftaran Berhasil" description="Terima kasih telah mendaftar di SD Cinta Madani." />

    <div class="container-site py-12 md:py-16">
      <Breadcrumb :items="breadcrumbs" class="mb-8 md:mb-12" />

      <div class="max-w-lg mx-auto text-center">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 class="text-h2 text-text mb-3">Pendaftaran Terkirim!</h2>
        <p class="text-body text-muted mb-6">
          Data Anda telah berhasil dikirim. Tim kami akan memverifikasi data Anda dalam 1-3 hari kerja.
        </p>

        <div v-if="regNumber" class="bg-surface rounded-[16px] p-6 mb-8">
          <p class="text-small text-muted mb-2">Nomor Registrasi Anda</p>
          <p class="text-h2 text-primary font-mono tracking-wider">{{ regNumber }}</p>
        </div>

        <p class="text-small text-muted mb-8">
          Simpan nomor registrasi untuk melacak status pendaftaran Anda.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/ppdb"
            class="inline-flex items-center justify-center gap-2 h-12 px-6 border border-line rounded-[var(--radius-sm)] text-body font-medium text-text hover:bg-surface transition-colors"
          >
            Kembali ke PPDB
          </a>
          <a
            href="/"
            class="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-semibold rounded-[var(--radius-sm)] hover:bg-green-600 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
