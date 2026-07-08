# Lucide

An optional plugin that keeps [Lucide](https://lucide.dev) icons in sync with the Alpine/Harmonia lifecycle. Place `x-h-lucide` on a Lucide placeholder and it renders that icon when Alpine initializes the element, including markup added dynamically through `x-h-include`, a router (e.g. Pinecone-router) or Alpine's `x-for` / `x-if`. No global `lucide.createIcons` scans and no event wiring are needed. Use an `<svg>` placeholder when the icon carries other Alpine directives or a dynamic name: it is rendered in place with a reactive `data-lucide`, while any other tag is replaced by the rendered svg.

::: info
This plugin is **not** part of the default Harmonia bundle. You opt in by loading it, and Lucide itself must be available as a global (`window.lucide`).
:::

## Usage

This plugin is opt-in, so you load it yourself. Load Lucide and Harmonia first, then add the plugin.

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

| Attribute     | Type   | Required | Description                                                                                                                                |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `data-lucide` | string | false    | The icon name. Takes priority over the expression, so existing Lucide markup is a drop-in. Reactive on an `<svg>` placeholder (see below). |

How the placeholder is rendered depends on its tag:

- An `<svg x-h-lucide>` placeholder is rendered **in place**: the icon's shapes are inserted into the element, Lucide's identifying classes are merged with yours, and Lucide's default attributes are applied only where you have not set that attribute yourself. Because the element is never replaced, Alpine directives on it (`x-show`, `:class`, `x-transition`, `@click`, ...) keep working. On this form `data-lucide` is also reactive: change it (for example with a bound `:data-lucide`) and the new icon is rendered in place.
- Any other tag (typically `<i>`, matching Lucide's own markup) is **replaced** by the rendered `<svg>`. The placeholder's attributes (`class`, `role`, `aria-*`, sizing, etc.) are copied onto it. Alpine bindings cannot survive that replacement, so combining another directive with `x-h-lucide` on such a placeholder throws an error. The one exception is `:data-lucide`, whose bound name is consumed once when the icon renders. Use the `<svg>` form for anything reactive.

## Examples

### Drop-in for existing markup

Add `x-h-lucide` to any existing Lucide placeholder and the `data-lucide` name is reused.

<!-- prettier-ignore -->
```html
<i data-lucide="home" x-h-lucide></i>
<i data-lucide="settings" x-h-lucide class="size-5 text-primary" role="img" aria-label="Settings"></i>
```

### Name from the expression

```html
<i x-h-lucide="'arrow-up-right'"></i>
```

### Reactive icons

Put `x-h-lucide` on an `<svg>` element when the icon needs other Alpine directives or a dynamic name. The element is rendered in place instead of being replaced, so bindings like `x-show` stay live, and a bound `:data-lucide` swaps the rendered icon whenever its value changes. Here the icon follows the current theme choice:

<LiveExample data-class="flex flex-col items-start">

```html
<div x-data="{ theme: 'light' }">
  <button x-h-button data-variant="outline" @click="theme = theme === 'light' ? 'dark' : 'light'">
    <svg x-h-lucide role="presentation" :data-lucide="theme === 'light' ? 'sun' : 'moon'"></svg>
    <span x-text="theme === 'light' ? 'Light' : 'Dark'"></span>
  </button>
</div>
```

</LiveExample>

On a replaced placeholder like `<i>`, `:data-lucide` is consumed once when the icon first renders, so later changes have no effect. Any other directive on a replaced placeholder would silently die with the replaced element, which is why the plugin throws for it and points you here.

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
On a replaced placeholder like `<i>`, the icon name is read once. For an icon whose name changes at runtime, use an `<svg>` placeholder with a bound `:data-lucide`, which re-renders the icon in place.
:::
