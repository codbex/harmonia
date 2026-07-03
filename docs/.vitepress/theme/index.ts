// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import TemplateShowcase from './TemplateShowcase.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TemplateShowcase', TemplateShowcase);
  },
} satisfies Theme;
