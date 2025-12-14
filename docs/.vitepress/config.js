import { defineConfig } from 'vitepress';

const basePath = '/harmonia/';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Harmonia UI',
  description: 'Harmonia UI Component Library',
  base: basePath,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo/harmonia-circle.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components' },
    ],

    sidebar: [
      {
        text: 'Get started',
        items: [{ text: 'Installation', link: '/get-started' }],
      },
      {
        text: 'Components',
        items: [
          { text: 'Accordion', link: '/components/accordion' },
          { text: 'Alert', link: '/components/alert' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Badge', link: '/components/badge' },
          { text: 'Button', link: '/components/button' },
          { text: 'Button Group', link: '/components/button-group' },
          { text: 'Calendar', link: '/components/calendar' },
          { text: 'Card', link: '/components/card' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Collapsible', link: '/components/collapsible' },
          { text: 'Date Picker', link: '/components/datepicker' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Fieldset', link: '/components/fieldset' },
          { text: 'Icon', link: '/components/icon' },
          { text: 'Info Page', link: '/components/info-page' },
          { text: 'Input', link: '/components/input' },
          { text: 'Input Group', link: '/components/input-group' },
          { text: 'Label', link: '/components/label' },
          { text: 'List', link: '/components/list' },
          { text: 'Listbox', link: '/components/listbox' },
          { text: 'Menu', link: '/components/menu' },
          { text: 'Pagination', link: '/components/pagination' },
          { text: 'Popover', link: '/components/popover' },
          { text: 'Progress', link: '/components/progress' },
          { text: 'Radio', link: '/components/radio' },
          { text: 'Range', link: '/components/range' },
          { text: 'Select', link: '/components/select' },
          { text: 'Separator', link: '/components/separator' },
          { text: 'Sidebar', link: '/components/sidebar' },
          { text: 'Skeleton', link: '/components/skeleton' },
          { text: 'Spinner', link: '/components/spinner' },
          { text: 'Switch', link: '/components/switch' },
          { text: 'Table', link: '/components/table' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'Tag', link: '/components/tag' },
          { text: 'Text', link: '/components/text' },
          { text: 'Textarea', link: '/components/textarea' },
          { text: 'Tile', link: '/components/tile' },
          { text: 'Time Picker', link: '/components/timepicker' },
          { text: 'Toolbar', link: '/components/toolbar' },
          { text: 'Tooltip', link: '/components/tooltip' },
        ],
      },
      {
        text: 'Utility classes',
        items: [
          { text: 'Width & Height', link: '/utility-classes/width-height' },
          { text: 'Margins & Paddings', link: '/utility-classes/margins-paddings' },
          { text: 'Position', link: '/utility-classes/position' },
          { text: 'Flex Layout', link: '/utility-classes/flex' },
          { text: 'Grid layout', link: '/utility-classes/grid' },
          { text: 'Align Content', link: '/utility-classes/align-content' },
          { text: 'Align Items', link: '/utility-classes/align-items' },
          { text: 'Justify Content', link: '/utility-classes/justify' },
          { text: 'Place Content', link: '/utility-classes/place-content' },
          { text: 'Gap', link: '/utility-classes/gap' },
          { text: 'Border', link: '/utility-classes/border' },
          { text: 'Color', link: '/utility-classes/color' },
          { text: 'Shadow', link: '/utility-classes/shadow' },
          { text: 'Images', link: '/utility-classes/images' },
          { text: 'Overflow', link: '/utility-classes/overflow' },
          { text: 'Rotate', link: '/utility-classes/rotate' },
          { text: 'Text', link: '/utility-classes/text' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/codbex/harmonia' }],
  },
  head: [
    ['link', { rel: 'icon', href: `${basePath}favicon.ico` }],
    ['script', { src: `${basePath}js/component-container.js`, type: 'module' }],
    ['script', { src: `${basePath}lib/node_modules/lucide/dist/umd/lucide.min.js`, type: 'text/javascript' }],
    ['link', { href: `${basePath}lib/node_modules/@codbex/harmonia/dist/harmonia.css`, rel: 'stylesheet' }],
    ['link', { href: `${basePath}fonts.css`, rel: 'stylesheet' }],
  ],
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'component-container' || tag === 'component-test',
      },
    },
  },
});
