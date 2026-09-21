<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { supabase } from '@/services/supabase';

const props = defineProps<{
  modelValue: string;
  source: string;
  placeholder?: string;
  excludeId?: string;
  table?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isManual = ref(false);
const slugError = ref('');
const checking = ref(false);

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

watch(() => props.source, (val) => {
  if (!isManual.value && val) {
    emit('update:modelValue', generateSlug(val));
  }
});

async function checkUniqueness(slug: string) {
  if (!slug || !props.table) return;
  checking.value = true;
  slugError.value = '';
  try {
    let query = supabase.from(props.table).select('id', { count: 'exact', head: true }).eq('slug', slug);
    if (props.excludeId) query = query.neq('id', props.excludeId);
    const { count } = await query;
    if (count && count > 0) {
      slugError.value = 'Slug sudah digunakan';
    }
  } catch { /* ignore */ }
  finally { checking.value = false; }
}

function onInput(e: Event) {
  isManual.value = true;
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
  checkUniqueness(val);
}

const computedSlug = computed(() => generateSlug(props.source));
</script>

<template>
  <div class="space-y-1.5">
    <label class="block text-small font-semibold text-[var(--color-bark)]">Slug</label>
    <div class="flex items-center gap-2">
      <span class="text-small text-[var(--color-moss)]">/</span>
      <input
        type="text"
        :value="modelValue"
        :placeholder="placeholder || 'url-slug'"
        :class="[
          'flex-1 rounded-lg border bg-white px-3 py-2 text-body text-[var(--color-bark)] placeholder-[var(--color-moss)]/50 focus:outline-none focus:ring-2',
          slugError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[var(--color-sand)] focus:border-[var(--color-forest)] focus:ring-[var(--color-forest)]/20',
        ]"
        @input="onInput"
      />
    </div>
    <p v-if="checking" class="text-xs text-[var(--color-moss)]">Mengecek...</p>
    <p v-else-if="slugError" class="text-xs text-red-600">{{ slugError }}</p>
    <p v-else-if="source && !isManual" class="text-xs text-[var(--color-moss)]">
      Otomatis dari judul: {{ computedSlug }}
    </p>
    <p v-else-if="isManual" class="text-xs text-[var(--color-gold)]">Slug manual</p>
  </div>
</template>
