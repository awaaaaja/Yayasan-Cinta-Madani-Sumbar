<script setup lang="ts">
defineProps<{
  html: string;
}>();
</script>

<template>
  <div
    v-if="html"
    class="prose prose-lg max-w-none text-text
      prose-headings:font-bold prose-headings:text-text
      prose-h2:text-h3 prose-h2:mt-8 prose-h2:mb-4
      prose-h3:text-h4 prose-h3:mt-6 prose-h3:mb-3
      prose-p:text-body prose-p:leading-relaxed prose-p:text-muted
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-text prose-strong:font-semibold
      prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
      prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
      prose-li:text-body prose-li:text-muted
      prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted
      prose-img:rounded-xl prose-img:shadow-sm
      prose-hr:border-line-light prose-hr:my-8"
    v-html="html"
  />
</template>
