<script setup lang="ts" generic="T extends Record<string, unknown>">
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

const props = defineProps<{
  columns: Column[];
  rows: T[];
  loading: boolean;
  emptyMessage: string;
  selectedKeys: string[];
  caption?: string;
}>();

const emit = defineEmits<{
  sort: [column: string];
  select: [keys: string[]];
  rowClick: [row: Record<string, unknown>];
}>();

function toggleSort(key: string, sortable?: boolean) {
  if (sortable) emit('sort', key);
}

function toggleSelectAll(rows: T[], selectedKeys: string[]) {
  const rowKeys = rows.map((r) => r.id as string);
  const allSelected = rowKeys.every((k) => selectedKeys.includes(k));
  emit('select', allSelected ? [] : rowKeys);
}

function toggleSelect(key: string, selectedKeys: string[]) {
  const next = selectedKeys.includes(key)
    ? selectedKeys.filter((k) => k !== key)
    : [...selectedKeys, key];
  emit('select', next);
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse" :aria-label="caption || 'Data table'">
      <caption v-if="caption" class="sr-only">{{ caption }}</caption>
      <thead>
        <tr class="border-b border-[var(--color-sand)] bg-[var(--color-cream)]">
          <th class="w-12 px-4 py-3">
            <input
              type="checkbox"
              aria-label="Pilih semua baris"
              class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)] focus:ring-[var(--color-moss)]"
              :checked="rows.length > 0 && rows.every((r) => selectedKeys.includes(r.id as string))"
              @change="toggleSelectAll(rows, selectedKeys)"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left text-small font-semibold text-[var(--color-bark)]"
            :style="col.width ? { width: col.width } : {}"
          >
            <button
              v-if="col.sortable"
              class="flex items-center gap-1 hover:text-[var(--color-forest)]"
              :aria-label="`Urutkan berdasarkan ${col.label}`"
              @click="toggleSort(col.key, col.sortable)"
            >
              {{ col.label }}
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <span v-else>{{ col.label }}</span>
          </th>
          <th v-if="$slots.actions" class="w-24 px-4 py-3 text-right text-small font-semibold text-[var(--color-bark)]">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + 2" class="px-4 py-12 text-center text-[var(--color-moss)]" aria-live="polite">
            <div class="flex items-center justify-center gap-2">
              <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memuat data...
            </div>
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length + 2" class="px-4 py-12 text-center text-[var(--color-moss)]">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr
          v-for="row in rows"
          :key="row.id as string"
          class="cursor-pointer border-b border-[var(--color-sand)]/50 hover:bg-[var(--color-cream)]/60"
          @click="emit('rowClick', row)"
        >
          <td class="w-12 px-4 py-3">
            <input
              type="checkbox"
              :aria-label="`Pilih baris ${row.id}`"
              class="h-4 w-4 rounded border-[var(--color-sand)] text-[var(--color-forest)] focus:ring-[var(--color-moss)]"
              :checked="selectedKeys.includes(row.id as string)"
              @click.stop="toggleSelect(row.id as string, selectedKeys)"
            />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-body text-[var(--color-bark)]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="px-4 py-3 text-right">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
