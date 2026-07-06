<script setup>
import { onMounted, ref } from 'vue';

defineProps({
  title: { type: String, required: true },
  src: { type: String, required: true },
  desc: { type: String, default: '' },
});

const tab = ref('preview');
const codeRoot = ref(null);
const fileNames = ref([]);
const activeFile = ref(0);
let fileBlocks = [];

// A slot child like `<p><strong>js/app.js</strong></p>` (rendered from a
// standalone `**js/app.js**` markdown line) marks the start of a file's blocks.
function isFileLabel(el) {
  return el.tagName === 'P' && el.children.length === 1 && el.firstElementChild.tagName === 'STRONG' && el.firstElementChild.textContent.trim() === el.textContent.trim();
}

function selectFile(index) {
  activeFile.value = index;
  fileBlocks.forEach((blocks, i) => {
    blocks.forEach((block) => {
      block.style.display = i === index ? '' : 'none';
    });
  });
}

onMounted(() => {
  const names = [];
  fileBlocks = [];
  for (const child of Array.from(codeRoot.value?.children ?? [])) {
    if (isFileLabel(child)) {
      names.push(child.textContent.trim());
      fileBlocks.push([]);
      child.style.display = 'none';
    } else if (fileBlocks.length) {
      fileBlocks[fileBlocks.length - 1].push(child);
    }
  }
  if (names.length) {
    fileNames.value = names;
    selectFile(0);
  }
});
</script>

<template>
  <article class="template-card">
    <header class="template-card-header">
      <div class="template-card-heading">
        <h3>{{ title }}</h3>
        <p v-if="desc" class="template-card-desc">{{ desc }}</p>
      </div>
      <div class="template-card-actions">
        <div class="template-toggle" role="tablist" :aria-label="`${title} view`">
          <button type="button" role="tab" :aria-selected="tab === 'preview'" :class="{ active: tab === 'preview' }" @click="tab = 'preview'">Preview</button>
          <button type="button" role="tab" :aria-selected="tab === 'code'" :class="{ active: tab === 'code' }" @click="tab = 'code'">Code</button>
        </div>
        <a class="template-open" :href="src" target="_blank" rel="noopener noreferrer">Open in new tab</a>
      </div>
    </header>

    <div v-show="tab === 'preview'">
      <iframe class="template-frame" :src="src" :title="`${title} template`" loading="lazy"></iframe>
    </div>

    <div v-show="tab === 'code'" class="template-code" :class="{ 'has-files': fileNames.length > 0 }">
      <div v-if="fileNames.length" class="template-files" role="tablist" :aria-label="`${title} source files`">
        <button v-for="(name, index) in fileNames" :key="name" type="button" role="tab" :aria-selected="activeFile === index" :class="{ active: activeFile === index }" @click="selectFile(index)">{{ name }}</button>
      </div>
      <div ref="codeRoot" class="template-code-blocks">
        <slot />
      </div>
    </div>
  </article>
</template>
