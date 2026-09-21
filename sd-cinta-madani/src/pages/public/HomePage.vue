<script setup lang="ts">
import HeroSection from "@/components/sections/HeroSection.vue";
import StatsSection from "@/components/sections/StatsSection.vue";
import AboutSection from "@/components/sections/AboutSection.vue";
import ValuesSection from "@/components/sections/ValuesSection.vue";
import ProgramsSection from "@/components/sections/ProgramsSection.vue";
import SchoolLifeSection from "@/components/sections/SchoolLifeSection.vue";
import NewsSection from "@/components/sections/NewsSection.vue";
import AchievementsSection from "@/components/sections/AchievementsSection.vue";
import GallerySection from "@/components/sections/GallerySection.vue";
import AgendaSection from "@/components/sections/AgendaSection.vue";
import PpdbCtaSection from "@/components/sections/PpdbCtaSection.vue";
import { usePageHead } from "@/composables/usePageHead";

usePageHead({
  title: "Beranda",
  description: "SD Cinta Madani: lingkungan belajar yang mendukung karakter, potensi, dan masa depan setiap anak.",
});
</script>

<template>
  <main>
    <!-- Dark: Hero -->
    <HeroSection />

    <!-- White: Stats -->
    <StatsSection />

    <!-- Ivory: About -->
    <AboutSection />

    <!-- Background: Values -->
    <ValuesSection />

    <!-- Sage: Programs -->
    <ProgramsSection />

    <!-- Dark: School Life -->
    <SchoolLifeSection />

    <!-- White: News -->
    <NewsSection />

    <!-- Background: Achievements -->
    <AchievementsSection />

    <!-- Ivory: Gallery -->
    <GallerySection />

    <!-- Background: Agenda -->
    <AgendaSection />

    <!-- Background: PPDB CTA -->
    <PpdbCtaSection />
  </main>
</template>
