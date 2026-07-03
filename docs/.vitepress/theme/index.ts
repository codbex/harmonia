// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import { inBrowser, useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { watch } from 'vue';
import IconGallery from './IconGallery.vue';
import LiveExample from './LiveExample.vue';
import TemplateShowcase from './TemplateShowcase.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  setup() {
    // VitePress owns the docs color scheme; mirror its resolved value into Harmonia so
    // the component previews (which follow `<html>.dark`) and the template iframes (which
    // read Harmonia's shared color-scheme key + storage events) stay in sync with the
    // VitePress appearance toggle.
    if (!inBrowser) return;
    const { isDark } = useData();
    watch(
      isDark,
      (dark) => {
        (window as unknown as { Harmonia?: { setColorScheme(mode: string): void } }).Harmonia?.setColorScheme(dark ? 'dark' : 'light');
      },
      { immediate: true }
    );
  },
  enhanceApp({ app }) {
    app.component('TemplateShowcase', TemplateShowcase);
    app.component('LiveExample', LiveExample);
    app.component('IconGallery', IconGallery);
  },
} satisfies Theme;
