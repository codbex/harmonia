# Lucide

An optional plugin that keeps [Lucide](https://lucide.dev) icons in sync with the Alpine/Harmonia lifecycle. Place `x-h-lucide` on a Lucide placeholder and it renders that icon when Alpine initializes the element, including markup added dynamically through `x-h-include`, a router (e.g. Pinecone-router) or Alpine's `x-for` / `x-if`. No global `lucide.createIcons` scans and no event wiring are needed.

::: info
This plugin is **not** part of the default Harmonia bundle. You opt in by loading it, and Lucide itself must be available as a global (`window.lucide`).
:::

## Installation

Load Lucide and Harmonia first, then add the plugin.

### CDN

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script src="https://unpkg.com/@codbex/harmonia/dist/harmonia.min.js"></script>
<!-- opt in: registers x-h-lucide on alpine:init -->
<script src="https://unpkg.com/@codbex/harmonia/dist/harmonia-lucide.min.js"></script>
```

### ESM

```js
import Alpine from 'alpinejs';
import { Lucide } from '@codbex/harmonia';

Alpine.plugin(Lucide); // Lucide (window.lucide) must be loaded separately
Alpine.start();
```

## API Reference

### Component attribute(s)

```
x-h-lucide
```

### Arguments

| Attribute  | Type   | Required | Description                                                                                    |
| ---------- | ------ | -------- | ---------------------------------------------------------------------------------------------- |
| expression | string | false    | The icon name, e.g. `x-h-lucide="'home'"`. Used only when there is no `data-lucide` attribute. |

### Attributes

| Attribute     | Type   | Required | Description                                                                                |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------ |
| `data-lucide` | string | false    | The icon name. Takes priority over the expression, so existing Lucide markup is a drop-in. |

The placeholder's other attributes (`class`, `role`, `aria-*`, sizing, etc.) are copied onto the rendered `<svg>`, which replaces the placeholder element.

## Examples

### Drop-in for existing markup

Add `x-h-lucide` to any existing Lucide placeholder; the `data-lucide` name is reused.

```html
<i data-lucide="home" x-h-lucide></i> <i data-lucide="settings" x-h-lucide class="size-5 text-primary" role="img" aria-label="Settings"></i>
```

### Name from the expression

```html
<i x-h-lucide="'arrow-up-right'"></i>
```

### Inside dynamic content

Because each icon renders when Alpine initializes its element, icons work automatically in dynamically loaded fragments and loops, with no manual `createIcons` call.

```html
<!-- fragment loaded at runtime -->
<div x-h-include="'/fragments/menu.html'"></div>

<!-- a list rendered by Alpine -->
<template x-for="item in items" :key="item.id">
  <button x-h-button>
    <i :data-lucide="item.icon" x-h-lucide></i>
    <span x-text="item.label"></span>
  </button>
</template>
```

::: tip
The icon name is read once, so prefer static names. For an icon whose name changes at runtime, re-create the element (for example with `x-if` / `template`) so the directive runs again.
:::
