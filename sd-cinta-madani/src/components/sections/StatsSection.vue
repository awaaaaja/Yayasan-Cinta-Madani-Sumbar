<script setup lang="ts">
import { ref, onMounted } from "vue";
import AnimatedNumber from "@/components/ui/AnimatedNumber.vue";
import Reveal from "@/components/ui/Reveal.vue";
import { getSectionContent } from "@/services/homepage.service";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  prefix: string;
}

const stats = ref<StatItem[]>([
  { value: 6, suffix: "", label: "Kelas", prefix: "" },
  { value: 180, suffix: "+", label: "Siswa", prefix: "" },
  { value: 25, suffix: "+", label: "Guru & Staf", prefix: "" },
  { value: 1, suffix: "", label: "Akreditasi A", prefix: "" },
]);

interface StatsContent {
  items?: Array<{
    value: number;
    suffix?: string;
    label: string;
    prefix?: string;
  }>;
}

async function fetchStats() {
  try {
    const content = await getSectionContent<StatsContent>("statistics");
    if (content?.items?.length) {
      const mapped = content.items
        .filter((item) => item && typeof item.value === "number" && !isNaN(item.value))
        .map((item) => ({
          value: item.value,
          suffix: item.suffix || "",
          label: item.label || "",
          prefix: item.prefix || "",
        }));
      if (mapped.length > 0) stats.value = mapped;
    }
  } catch {
    // keep defaults
  }
}

onMounted(fetchStats);
</script>

<template>
  <section id="stats" class="py-16 md:py-20 bg-surface border-y border-line-light">
    <div class="container-site">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <Reveal
          v-for="(stat, i) in stats"
          :key="i"
          :delay="i * 100"
          class="text-center md:text-left"
        >
          <p class="text-display !text-primary mb-1">
            <AnimatedNumber
              :target="stat.value"
              :prefix="stat.prefix"
              :suffix="stat.suffix"
              :duration="1800 + i * 200"
            />
          </p>
          <p class="text-small text-muted">{{ stat.label }}</p>
        </Reveal>
      </div>
    </div>
  </section>
</template>
