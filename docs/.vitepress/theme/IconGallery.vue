<script setup>
import { onMounted, useTemplateRef } from 'vue';

// Interactive icon gallery (preview + click-to-copy) with no code of its own on
// screen. The wrapped html fence is the single source: it stays the clean,
// copyable reference shown below, and the gallery above is generated from the
// icon names/labels parsed out of it - so the two can never list different icons.
const preview = useTemplateRef('preview');
const code = useTemplateRef('code');

onMounted(() => {
  const raw = code.value?.querySelector('pre code')?.textContent || '';
  const icons = [...raw.matchAll(/data-icon="([^"]+)"(?:[^>]*\baria-label="([^"]+)")?/g)].map((m) => ({ name: m[1], label: m[2] || m[1] }));
  if (!icons.length) return;

  const items = icons
    .map(
      ({ name, label }) => `
    <div class="size-full">
      <button x-h-button data-variant="transparent" class="vbox h-auto w-full items-center gap-2" x-h-tooltip-trigger @click="copy('${name}')">
        <svg x-h-icon data-icon="${name}" class="size-8" role="img" aria-label="${label}"></svg>
        <span>${name}</span>
      </button>
      <div x-h-tooltip x-text="tooltipLabel"></div>
    </div>`
    )
    .join('');

  const markup = `<div class="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-4" x-data="iconGallery">${items}
</div>
<script>
  Alpine.data('iconGallery', () => ({
    tooltipLabel: 'Click to copy code',
    copy(name) {
      navigator.clipboard.writeText('<svg x-h-icon data-icon="' + name + '" role="img" aria-label="' + name + '"></svg>');
    },
  }));
<\/script>`;

  const container = document.createElement('component-container');
  container.setAttribute('data-class', 'p-4');
  container._code = markup;
  preview.value.appendChild(container);
});
</script>

<template>
  <div class="icon-gallery">
    <div class="icon-gallery-preview" ref="preview"></div>
    <div ref="code"><slot /></div>
  </div>
</template>
