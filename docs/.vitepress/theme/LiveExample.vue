<script setup>
import { onMounted, useTemplateRef } from 'vue';

// Renders a live demo and its source from ONE code block. The fenced html block
// passed as the default slot is the single source: VitePress highlights it for
// display, and we hand its raw text to a `component-container` to run live, so
// the two can never drift.
const props = defineProps({
  dataClass: { type: String, default: '' },
  dataStyle: { type: String, default: '' },
});

const preview = useTemplateRef('preview');
const code = useTemplateRef('code');

onMounted(() => {
  const codeEl = code.value?.querySelector('pre code');
  const raw = codeEl ? codeEl.textContent.replace(/\n$/, '') : '';
  if (!raw) return;

  const container = document.createElement('component-container');
  if (props.dataClass) container.setAttribute('data-class', props.dataClass);
  if (props.dataStyle) container.setAttribute('data-style', props.dataStyle);
  // Set the code before connecting so connectedCallback renders it.
  container._code = raw;
  preview.value.appendChild(container);
});
</script>

<template>
  <div class="live-example">
    <div class="live-example-preview" ref="preview"></div>
    <div class="live-example-code" ref="code"><slot /></div>
  </div>
</template>
