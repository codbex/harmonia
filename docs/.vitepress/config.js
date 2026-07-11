import { defineConfig } from 'vitepress';
import { version } from '../../package.json';

const basePath = '/harmonia/'; // Also in component-container.js

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Harmonia',
  description: 'UI Component Library',
  base: basePath,
  themeConfig: {
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo/harmonia-circle.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components' },
      { text: 'Charts', link: '/charts' },
      { text: `v${version}`, link: `https://www.npmjs.com/package/@codbex/harmonia/v/${version}` },
    ],

    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'Installation', link: '/installation' },
          { text: 'Dark Mode', link: '/dark-mode' },
          { text: 'Theme Customization', link: '/custom-themes' },
          { text: 'Theme Generator', link: '/theming/generator.html', target: '_self' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Accordion', link: '/components/accordion' },
          { text: 'Alert', link: '/components/alert' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Breadcrumb', link: '/components/breadcrumb' },
          { text: 'Button', link: '/components/button' },
          { text: 'Button Group', link: '/components/button-group' },
          { text: 'Calendar', link: '/components/calendar' },
          { text: 'Card', link: '/components/card' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Chip', link: '/components/chip' },
          { text: 'Date Picker', link: '/components/date-picker' },
          { text: 'Date Time Picker', link: '/components/datetime-picker' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Expansion Panel', link: '/components/expansion-panel' },
          { text: 'File Upload', link: '/components/file-upload' },
          { text: 'Fieldset', link: '/components/fieldset' },
          { text: 'Icon', link: '/components/icon' },
          { text: 'Info Page', link: '/components/info-page' },
          { text: 'Inline Calendar', link: '/components/inline-calendar' },
          { text: 'Input', link: '/components/input' },
          { text: 'Input Group', link: '/components/input-group' },
          { text: 'Input Number', link: '/components/input-number' },
          { text: 'Label', link: '/components/label' },
          { text: 'List', link: '/components/list' },
          { text: 'Listbox', link: '/components/listbox' },
          { text: 'Menu', link: '/components/menu' },
          { text: 'Menubar', link: '/components/menubar' },
          { text: 'Month Picker', link: '/components/month-picker' },
          { text: 'Navigation Menu', link: '/components/navigation-menu' },
          { text: 'Notifications', link: '/components/notifications' },
          { text: 'Pagination', link: '/components/pagination' },
          { text: 'Popover', link: '/components/popover' },
          { text: 'Progress', link: '/components/progress' },
          { text: 'Radio', link: '/components/radio' },
          { text: 'Range', link: '/components/range' },
          { text: 'Rating', link: '/components/rating' },
          { text: 'Select', link: '/components/select' },
          { text: 'Separator', link: '/components/separator' },
          { text: 'Sheet', link: '/components/sheet' },
          { text: 'Sidebar', link: '/components/sidebar' },
          { text: 'Skeleton', link: '/components/skeleton' },
          { text: 'Slot Picker', link: '/components/slot-picker' },
          { text: 'Spinner', link: '/components/spinner' },
          { text: 'Step Indicator', link: '/components/step-indicator' },
          { text: 'Switch', link: '/components/switch' },
          { text: 'Table', link: '/components/table' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'Tag', link: '/components/tag' },
          { text: 'Text', link: '/components/text' },
          { text: 'Textarea', link: '/components/textarea' },
          { text: 'Tile', link: '/components/tile' },
          { text: 'Time Picker', link: '/components/time-picker' },
          { text: 'Toolbar', link: '/components/toolbar' },
          { text: 'Tooltip', link: '/components/tooltip' },
          { text: 'Tree', link: '/components/tree' },
          { text: 'Week Picker', link: '/components/week-picker' },
        ],
      },
      {
        text: 'Charts',
        link: '/charts',
        items: [
          { text: 'Bar', link: '/charts/bar' },
          { text: 'Line', link: '/charts/line' },
          { text: 'Scatter', link: '/charts/scatter' },
          { text: 'Pie', link: '/charts/pie' },
          { text: 'Doughnut', link: '/charts/doughnut' },
          { text: 'Polar Area', link: '/charts/polar-area' },
          { text: 'Radar', link: '/charts/radar' },
        ],
      },
      {
        text: 'Layouts',
        items: [{ text: 'Split', link: '/layouts/split' }],
      },
      {
        text: 'Utilities',
        items: [
          { text: 'Breakpoint Listener', link: '/utilities/breakpoint-listener' },
          { text: 'Chart Export', link: '/utilities/chart-export' },
          { text: 'Date Format', link: '/utilities/date-format' },
          { text: 'Focus', link: '/utilities/focus' },
          { text: 'Include', link: '/utilities/include' },
          { text: 'Template', link: '/utilities/template' },
          { text: 'Theme', link: '/utilities/theme' },
        ],
      },
      {
        text: 'Plugins',
        items: [
          { text: 'i18next', link: '/plugins/i18next' },
          { text: 'Lucide', link: '/plugins/lucide' },
        ],
      },
      {
        text: 'Utility classes',
        items: [
          { text: 'Display', link: '/utility-classes/display' },
          { text: 'Flex Layout', link: '/utility-classes/flex' },
          { text: 'Grid layout', link: '/utility-classes/grid' },
          { text: 'Align Items', link: '/utility-classes/align-items' },
          { text: 'Align Self', link: '/utility-classes/align-self' },
          { text: 'Align Content', link: '/utility-classes/align-content' },
          { text: 'Justify Content', link: '/utility-classes/justify' },
          { text: 'Place Content', link: '/utility-classes/place-content' },
          { text: 'Gap', link: '/utility-classes/gap' },
          { text: 'Margins & Paddings', link: '/utility-classes/margins-paddings' },
          { text: 'Width & Height', link: '/utility-classes/width-height' },
          { text: 'Tile container', link: '/utility-classes/tile' },
          { text: 'Position', link: '/utility-classes/position' },
          { text: 'Overflow', link: '/utility-classes/overflow' },
          { text: 'Text', link: '/utility-classes/text' },
          { text: 'Color', link: '/utility-classes/color' },
          { text: 'Border', link: '/utility-classes/border' },
          { text: 'Shadow', link: '/utility-classes/shadow' },
          { text: 'Opacity', link: '/utility-classes/opacity' },
          { text: 'Cursor', link: '/utility-classes/cursor' },
          { text: 'Background', link: '/utility-classes/background' },
          { text: 'Images', link: '/utility-classes/images' },
          { text: 'Animations', link: '/utility-classes/animations' },
          { text: 'Rotate', link: '/utility-classes/rotate' },
          { text: 'Backdrop Blur', link: '/utility-classes/backdrop-blur' },
          { text: 'Masks', link: '/utility-classes/masks' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/codbex/harmonia' }],
  },
  head: [
    ['link', { rel: 'icon', href: `${basePath}favicon.ico` }],
    // Mirror VitePress's stored appearance into Harmonia's color-scheme key BEFORE
    // harmonia.js runs, so Harmonia's own init applies the same scheme instead of
    // re-deriving it from the system and clobbering what VitePress set. VitePress is
    // the single source of truth for the docs; the runtime watcher in the theme keeps
    // the two in sync after toggles (and the shared key propagates to template iframes).
    ['script', {}, "try{var a=localStorage.getItem('vitepress-theme-appearance');if(a==='dark'||a==='light'||a==='auto')localStorage.setItem('codbex.harmonia.colorMode',a);}catch(e){}"],
    ['script', { src: `${basePath}js/component-container.js`, type: 'module' }],
    ['script', { src: `${basePath}js/svg-icon.js`, type: 'module' }],
    ['script', { src: `${basePath}lib/node_modules/lucide/dist/umd/lucide.min.js`, type: 'text/javascript' }],
    ['script', { src: `${basePath}lib/node_modules/i18next/dist/umd/i18next.min.js`, type: 'text/javascript' }],
    ['script', { src: `${basePath}js/i18next-demo.js`, type: 'text/javascript' }],
    ['script', { src: `${basePath}lib/node_modules/alpinejs/dist/cdn.min.js`, defer: true, type: 'text/javascript' }],
    ['script', { src: `${basePath}lib/node_modules/@codbex/harmonia/dist/harmonia.js`, type: 'text/javascript' }],
    ['script', { src: `${basePath}lib/node_modules/@codbex/harmonia/dist/harmonia-lucide.js`, type: 'text/javascript' }],
    ['script', { src: `${basePath}lib/node_modules/@codbex/harmonia/dist/harmonia-i18next.js`, type: 'text/javascript' }],
    ['link', { href: `${basePath}lib/node_modules/@codbex/harmonia/dist/harmonia.css`, rel: 'stylesheet' }],
    ['link', { href: `${basePath}fonts.css`, rel: 'stylesheet' }],
  ],
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'component-container' || tag === 'svg-icon',
      },
    },
  },
  vite: {
    plugins: [
      {
        name: 'replace-placeholder',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('.md')) {
            return code.replace(/__H_VER__/g, version);
          }
        },
      },
    ],
  },
});
