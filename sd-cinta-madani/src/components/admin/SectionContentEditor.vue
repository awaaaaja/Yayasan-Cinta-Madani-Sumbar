<script setup lang="ts">
import { ref, watch } from "vue";
import Icon from "@/components/ui/Icon.vue";

const props = defineProps<{
  sectionKey: string;
  content: Record<string, unknown>;
}>();

const emit = defineEmits<{
  "update:content": [value: Record<string, unknown>];
}>();

const local = ref<Record<string, unknown>>({ ...props.content });

watch(() => props.content, (v) => { local.value = { ...v }; }, { deep: true });

function update(key: string, value: unknown) {
  local.value[key] = value;
  emit("update:content", { ...local.value });
}

// --- Hero ---
function heroFields() {
  return local.value as { heading?: string; description?: string; image?: string };
}

// --- About Profile ---
function profileFields() {
  return local.value as { heading?: string; description?: string; image?: string; stats?: { label: string; value: string }[] };
}

function addStat() {
  const fields = profileFields();
  const stats = [...(fields.stats || []), { label: "", value: "" }];
  update("stats", stats);
}

function removeStat(i: number) {
  const fields = profileFields();
  const stats = (fields.stats || []).filter((_: unknown, idx: number) => idx !== i);
  update("stats", stats);
}

function updateStat(i: number, key: "label" | "value", val: string) {
  const fields = profileFields();
  const stats = [...(fields.stats || [])];
  stats[i] = { ...stats[i], [key]: val };
  update("stats", stats);
}

// --- About Values / Agenda Info (repeatable items) ---
function itemsFields() {
  return (local.value as { items?: { icon?: string; title?: string; description?: string; label?: string; value?: string }[] }).items || [];
}

function addItem() {
  const items = [...itemsFields(), { icon: "", title: "", description: "", label: "", value: "" }];
  update("items", items);
}

function removeItem(i: number) {
  const items = itemsFields().filter((_: unknown, idx: number) => idx !== i);
  update("items", items);
}

function updateItem(i: number, key: string, val: string) {
  const items = [...itemsFields()];
  items[i] = { ...items[i], [key]: val };
  update("items", items);
}

// --- About History ---
function historyFields() {
  return (local.value as { items?: { year?: string; title?: string; description?: string }[] }).items || [];
}

// --- Detect section type ---
type SectionForm = "hero" | "profile" | "values" | "history" | "info" | "raw";

const formType = computed((): SectionForm => {
  const key = props.sectionKey;
  if (key.includes("hero")) return "hero";
  if (key === "about_profile") return "profile";
  if (key.includes("values")) return "values";
  if (key.includes("history")) return "history";
  if (key.includes("info")) return "info";
  return "raw";
});

import { computed } from "vue";
</script>

<template>
  <!-- HERO form -->
  <div v-if="formType === 'hero'" class="space-y-4">
    <div>
      <label class="block text-small font-medium text-[var(--color-bark)] mb-1">Judul</label>
      <input
        :value="heroFields().heading"
        type="text"
        class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        placeholder="Judul hero..."
        @input="update('heading', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div>
      <label class="block text-small font-medium text-[var(--color-bark)] mb-1">Deskripsi</label>
      <textarea
        :value="heroFields().description"
        rows="3"
        class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        placeholder="Deskripsi hero..."
        @input="update('description', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
    <div>
      <label class="block text-small font-medium text-[var(--color-bark)] mb-1">URL Gambar</label>
      <input
        :value="heroFields().image"
        type="url"
        class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        placeholder="https://..."
        @input="update('image', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>

  <!-- PROFILE form -->
  <div v-else-if="formType === 'profile'" class="space-y-4">
    <div>
      <label class="block text-small font-medium text-[var(--color-bark)] mb-1">Judul</label>
      <input
        :value="profileFields().heading"
        type="text"
        class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        @input="update('heading', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div>
      <label class="block text-small font-medium text-[var(--color-bark)] mb-1">Deskripsi (HTML)</label>
      <textarea
        :value="profileFields().description"
        rows="5"
        class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 font-mono text-xs text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        @input="update('description', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
    <div>
      <label class="block text-small font-medium text-[var(--color-bark)] mb-1">URL Gambar</label>
      <input
        :value="profileFields().image"
        type="url"
        class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-body text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
        @input="update('image', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-small font-medium text-[var(--color-bark)]">Statistik</label>
        <button type="button" class="text-xs text-[var(--color-forest)] hover:underline" @click="addStat">+ Tambah</button>
      </div>
      <div v-if="profileFields().stats?.length" class="space-y-2">
        <div v-for="(stat, i) in profileFields().stats" :key="i" class="flex gap-2">
          <input
            :value="stat.label"
            type="text"
            placeholder="Label"
            class="flex-1 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
            @input="updateStat(i, 'label', ($event.target as HTMLInputElement).value)"
          />
          <input
            :value="stat.value"
            type="text"
            placeholder="Nilai"
            class="w-32 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
            @input="updateStat(i, 'value', ($event.target as HTMLInputElement).value)"
          />
          <button type="button" class="text-red-500 hover:text-red-700 px-2" @click="removeStat(i)">✕</button>
        </div>
      </div>
      <p v-else class="text-xs text-[var(--color-moss)]">Belum ada statistik.</p>
    </div>
  </div>

  <!-- VALUES / INFO form (repeatable items with icon+title+desc or icon+label+value) -->
  <div v-else-if="formType === 'values' || formType === 'info'" class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="text-small font-medium text-[var(--color-bark)]">Items</label>
      <button type="button" class="text-xs text-[var(--color-forest)] hover:underline" @click="addItem">+ Tambah</button>
    </div>
    <div v-if="itemsFields().length" class="space-y-3">
      <div v-for="(item, i) in itemsFields()" :key="i" class="rounded-lg border border-[var(--color-sand)] p-3 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-[var(--color-moss)]">#{{ i + 1 }}</span>
          <button type="button" class="text-xs text-red-500 hover:text-red-700" @click="removeItem(i)">Hapus</button>
        </div>
        <div class="flex gap-2">
          <input
            :value="item.icon"
            type="text"
            placeholder="Icon name"
            class="w-32 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
            @input="updateItem(i, 'icon', ($event.target as HTMLInputElement).value)"
          />
          <input
            :value="formType === 'info' ? item.label : item.title"
            type="text"
            :placeholder="formType === 'info' ? 'Label' : 'Judul'"
            class="flex-1 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
            @input="updateItem(i, formType === 'info' ? 'label' : 'title', ($event.target as HTMLInputElement).value)"
          />
          <input
            :value="formType === 'info' ? item.value : item.description"
            type="text"
            :placeholder="formType === 'info' ? 'Nilai' : 'Deskripsi'"
            class="flex-1 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
            @input="updateItem(i, formType === 'info' ? 'value' : 'description', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div v-if="item.icon" class="flex items-center gap-2 text-xs text-[var(--color-moss)]">
          Preview: <Icon :name="item.icon" icon-class="w-4 h-4 text-[var(--color-forest)]" /> {{ item.icon }}
        </div>
      </div>
    </div>
    <p v-else class="text-xs text-[var(--color-moss)]">Belum ada items.</p>
  </div>

  <!-- HISTORY form (repeatable year+title+desc) -->
  <div v-else-if="formType === 'history'" class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="text-small font-medium text-[var(--color-bark)]">Timeline</label>
      <button type="button" class="text-xs text-[var(--color-forest)] hover:underline" @click="addItem">+ Tambah</button>
    </div>
    <div v-if="historyFields().length" class="space-y-3">
      <div v-for="(item, i) in historyFields()" :key="i" class="rounded-lg border border-[var(--color-sand)] p-3 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-[var(--color-moss)]">#{{ i + 1 }}</span>
          <button type="button" class="text-xs text-red-500 hover:text-red-700" @click="removeItem(i)">Hapus</button>
        </div>
        <div class="flex gap-2">
          <input
            :value="item.year"
            type="text"
            placeholder="Tahun"
            class="w-24 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
            @input="updateItem(i, 'year', ($event.target as HTMLInputElement).value)"
          />
          <input
            :value="item.title"
            type="text"
            placeholder="Judul"
            class="flex-1 rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
            @input="updateItem(i, 'title', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <textarea
          :value="item.description"
          rows="2"
          placeholder="Deskripsi"
          class="w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-small text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none"
          @input="updateItem(i, 'description', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
    </div>
    <p v-else class="text-xs text-[var(--color-moss)]">Belum ada timeline.</p>
  </div>

  <!-- RAW JSON fallback -->
  <div v-else class="space-y-4">
    <p class="text-xs text-[var(--color-moss)]">Section type <code class="bg-gray-100 px-1 rounded">{{ sectionKey }}</code> — edit sebagai JSON.</p>
    <textarea
      :value="JSON.stringify(local, null, 2)"
      rows="12"
      class="w-full rounded-lg border border-[var(--color-sand)] bg-gray-50 px-4 py-3 font-mono text-xs text-[var(--color-bark)] focus:border-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/20"
      spellcheck="false"
      @input="try { update('raw', JSON.parse(($event.target as HTMLTextAreaElement).value)); } catch {}"
    />
  </div>
</template>
