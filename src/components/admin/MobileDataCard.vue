<script setup lang="ts">
import Badge from '../common/Badge.vue';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'status';
}

defineProps<{
  item: Record<string, unknown>;
  fields: Field[];
  statusField: string;
}>();

const emit = defineEmits<{
  click: [];
  edit: [];
  delete: [];
}>();

function getBadgeVariant(value: unknown): 'success' | 'warning' | 'neutral' {
  const v = String(value).toLowerCase();
  if (v === 'published' || v === 'active' || v === 'draft') return 'success';
  if (v === 'archived' || v === 'inactive') return 'warning';
  return 'neutral';
}

function formatDate(value: unknown): string {
  if (!value) return '-';
  return new Date(String(value)).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
</script>

<template>
  <div
    class="rounded-xl border border-[var(--color-sand)] bg-white p-4 shadow-sm"
    @click="emit('click')"
  >
    <div class="mb-3 flex items-start justify-between">
      <h3 class="font-semibold text-[var(--color-bark)]">
        {{ item.title || item.name || item.id }}
      </h3>
      <Badge v-if="item[statusField]" :variant="getBadgeVariant(item[statusField])">
        {{ item[statusField] }}
      </Badge>
    </div>

    <dl class="mb-4 space-y-2">
      <div v-for="field in fields" :key="field.key" class="flex justify-between text-small">
        <dt class="text-[var(--color-moss)]">{{ field.label }}</dt>
        <dd class="font-medium text-[var(--color-bark)]">
          <template v-if="field.type === 'date'">{{ formatDate(item[field.key]) }}</template>
          <template v-else>{{ item[field.key] || '-' }}</template>
        </dd>
      </div>
    </dl>

    <div class="flex gap-2 border-t border-[var(--color-sand)] pt-3">
      <button
        class="flex-1 rounded-lg border border-[var(--color-sand)] px-3 py-2 text-small font-medium text-[var(--color-forest)] hover:bg-[var(--color-cream)]"
        @click.stop="emit('edit')"
      >
        Edit
      </button>
      <button
        class="flex-1 rounded-lg border border-red-200 px-3 py-2 text-small font-medium text-red-600 hover:bg-red-50"
        @click.stop="emit('delete')"
      >
        Hapus
      </button>
    </div>
  </div>
</template>
