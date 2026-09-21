<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import MediaPicker from './MediaPicker.vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [html: string];
}>();

const showImagePicker = ref(false);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Link.configure({ openOnClick: false }),
    Image,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Underline,
  ],
  onUpdate: ({ editor: e }) => {
    emit('update:modelValue', e.getHTML());
  },
});

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val);
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

function toggleBold() { editor.value?.chain().focus().toggleBold().run(); }
function toggleItalic() { editor.value?.chain().focus().toggleItalic().run(); }
function toggleUnderline() { editor.value?.chain().focus().toggleUnderline().run(); }
function toggleH2() { editor.value?.chain().focus().toggleHeading({ level: 2 }).run(); }
function toggleH3() { editor.value?.chain().focus().toggleHeading({ level: 3 }).run(); }
function toggleBulletList() { editor.value?.chain().focus().toggleBulletList().run(); }
function toggleOrderedList() { editor.value?.chain().focus().toggleOrderedList().run(); }
function toggleBlockquote() { editor.value?.chain().focus().toggleBlockquote().run(); }
function setHorizontalRule() { editor.value?.chain().focus().setHorizontalRule().run(); }
function setAlignLeft() { editor.value?.chain().focus().setTextAlign('left').run(); }
function setAlignCenter() { editor.value?.chain().focus().setTextAlign('center').run(); }
function setAlignRight() { editor.value?.chain().focus().setTextAlign('right').run(); }
function undo() { editor.value?.chain().focus().undo().run(); }
function redo() { editor.value?.chain().focus().redo().run(); }

function addLink() {
  const url = window.prompt('URL:');
  if (url) editor.value?.chain().focus().setLink({ href: url }).run();
}

function onImageSelected(url: string) {
  if (url) editor.value?.chain().focus().setImage({ src: url }).run();
  showImagePicker.value = false;
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-[var(--color-sand)]">
    <div v-if="editor" class="flex flex-wrap items-center gap-1 border-b border-[var(--color-sand)] bg-[var(--color-cream)] px-3 py-2">
      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('bold') && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Bold"
        @click="toggleBold"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
      </button>
      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('italic') && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Italic"
        @click="toggleItalic"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0l-4 16m-2 0h4" /></svg>
      </button>
      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('underline') && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Underline"
        @click="toggleUnderline"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v7a5 5 0 0010 0V4M5 21h14" /></svg>
      </button>

      <div class="mx-1 h-5 w-px bg-[var(--color-sand)]" />

      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('heading', { level: 2 }) && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Heading 2"
        @click="toggleH2"
      >
        H2
      </button>
      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('heading', { level: 3 }) && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Heading 3"
        @click="toggleH3"
      >
        H3
      </button>

      <div class="mx-1 h-5 w-px bg-[var(--color-sand)]" />

      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Link" @click="addLink">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      </button>
      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('bulletList') && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Bullet List"
        @click="toggleBulletList"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('orderedList') && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Ordered List"
        @click="toggleOrderedList"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
      </button>
      <button
        type="button"
        :class="['rounded p-1.5 hover:bg-[var(--color-sand)]', editor.isActive('blockquote') && 'bg-[var(--color-sand)] text-[var(--color-forest)]']"
        title="Blockquote"
        @click="toggleBlockquote"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
      </button>
      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Gambar" @click="showImagePicker = true">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </button>
      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Horizontal Rule" @click="setHorizontalRule">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" /></svg>
      </button>

      <div class="mx-1 h-5 w-px bg-[var(--color-sand)]" />

      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Align Left" @click="setAlignLeft">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14" /></svg>
      </button>
      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Align Center" @click="setAlignCenter">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M4 18h16" /></svg>
      </button>
      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Align Right" @click="setAlignRight">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14" /></svg>
      </button>

      <div class="mx-1 h-5 w-px bg-[var(--color-sand)]" />

      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Undo" @click="undo">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
      </button>
      <button type="button" class="rounded p-1.5 hover:bg-[var(--color-sand)]" title="Redo" @click="redo">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
      </button>
    </div>

    <EditorContent
      :editor="editor"
      class="min-h-[400px] bg-white px-4 py-3 text-body text-[var(--color-bark)] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[380px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[var(--color-moss)]/40 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[var(--color-sage)] [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-[var(--color-moss)]"
    />
  </div>

  <!-- Image Picker Modal -->
  <div v-if="showImagePicker" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
    <div class="w-full max-w-md rounded-xl bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-[var(--color-sand)] px-6 py-4">
        <h3 class="text-lg font-semibold text-[var(--color-bark)]">Sisipkan Gambar</h3>
        <button class="rounded p-1.5 text-[var(--color-moss)] hover:bg-[var(--color-cream)]" @click="showImagePicker = false">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="px-6 py-4">
        <MediaPicker model-value="" bucket="site-assets" folder="content" @update:model-value="onImageSelected" />
      </div>
    </div>
  </div>
</template>
