/**
 * Pagination component with ellipsis for page gaps.
 * Shows first/last pages, prev/next arrows, and sibling pages around the current page.
 * Hides entirely when totalPages <= 1.
 */
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    siblingCount?: number
  }>(),
  { siblingCount: 1 }
)

const emit = defineEmits<{
  pageChange: [page: number]
}>()

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
}

function createPageRange(current: number, total: number, siblings: number) {
  const totalSlots = siblings * 2 + 5
  if (total <= totalSlots) return range(1, total)

  const left = Math.max(current - siblings, 2)
  const right = Math.min(current + siblings, total - 1)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, totalSlots - 2)
    return [...leftRange, '...', total]
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(total - (totalSlots - 3) + 1, total)
    return [1, '...', ...rightRange]
  }
  if (showLeftEllipsis && showRightEllipsis) {
    const middleRange = range(left, right)
    return [1, '...', ...middleRange, '...', total]
  }
  return range(1, total)
}

const pages = computed(() =>
  createPageRange(props.currentPage, props.totalPages, props.siblingCount)
)

function goTo(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination" class="flex items-center justify-center gap-1">
    <button
      :disabled="currentPage === 1"
      aria-label="Halaman sebelumnya"
      :class="[
        'min-w-[44px] h-[44px] flex items-center justify-center rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
        currentPage === 1
          ? 'opacity-40 cursor-not-allowed text-[var(--color-text)]'
          : 'text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]'
      ]"
      @click="goTo(currentPage - 1)"
    >
      &laquo;
    </button>

    <template v-for="(page, i) in pages" :key="i">
      <span
        v-if="page === '...'"
        class="min-w-[44px] h-[44px] flex items-center justify-center text-[var(--color-muted)]"
        aria-hidden="true"
      >
        &hellip;
      </span>
      <button
        v-else
        :aria-label="`Halaman ${page}`"
        :aria-current="page === currentPage ? 'page' : undefined"
        :class="[
          'min-w-[44px] h-[44px] flex items-center justify-center rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
          page === currentPage
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]'
        ]"
        @click="goTo(page as number)"
      >
        {{ page }}
      </button>
    </template>

    <button
      :disabled="currentPage === totalPages"
      aria-label="Halaman berikutnya"
      :class="[
        'min-w-[44px] h-[44px] flex items-center justify-center rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
        currentPage === totalPages
          ? 'opacity-40 cursor-not-allowed text-[var(--color-text)]'
          : 'text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]'
      ]"
      @click="goTo(currentPage + 1)"
    >
      &raquo;
    </button>
  </nav>
</template>
