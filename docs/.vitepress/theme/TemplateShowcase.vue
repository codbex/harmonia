<script setup>
import { ref } from 'vue';

defineProps({
  title: { type: String, required: true },
  src: { type: String, required: true },
});

const tab = ref('preview');
</script>

<template>
  <article class="template-card">
    <header class="template-card-header">
      <h3>{{ title }}</h3>
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

    <div v-show="tab === 'code'" class="template-code">
      <slot />
    </div>
  </article>
</template>
