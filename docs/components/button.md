# Button

Displays a button. The component can be used to trigger an action or as a hyperlink.

## API Reference

### Component attubute(s)

```
x-h-button
```

### Attributes

| Attribute    | Type                                                                                                   | Required | Description                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`outline`<br />`transparent`<br />`link` | false    | Changes the color/shape of the button. Can be used to indicate different states.                           |
| data-size    | `xs`<br />`sm`<br />`lg`<br />`icon-xs`<br />`icon-sm`<br />`icon`<br />`icon-lg`                      | false    | Changes the size of the button. When the button contains only an icon, the `icon-*` values should be used. |
| data-toggled | boolean                                                                                                | false    | Set the toggle state.                                                                                      |

### Modifiers

| Modifier | Description                                   |
| -------- | --------------------------------------------- |
| group    | Used when the button is inside a button group |

## Toggle Button

<ClientOnly>
<component-container>
<div x-data="{ toggled: true }">
  <button x-h-button x-bind:data-toggled="toggled" x-on:click="toggled = !toggled">Toggle</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ toggled: true }">
  <button x-h-button :data-toggled="toggled" @:click="toggled = !toggled">Toggle</button>
</div>
```

## Button Variants

<ClientOnly>
<component-container data-class="flex flex-col items-start gap-4">
<button x-h-button>Default</button>
<button x-h-button data-variant="primary">Primary</button>
<button x-h-button data-variant="positive">Positive</button>
<button x-h-button data-variant="negative">Negative</button>
<button x-h-button data-variant="warning">Warning</button>
<button x-h-button data-variant="outline">Outline</button>
<button x-h-button data-variant="transparent">Transparent</button>
<a x-h-button data-variant="link" href="#">Link</a>
</component-container>
</ClientOnly>

```html
<button x-h-button>Default</button>
<button x-h-button data-variant="primary">Primary</button>
<button x-h-button data-variant="positive">Positive</button>
<button x-h-button data-variant="negative">Negative</button>
<button x-h-button data-variant="warning">Warning</button>
<button x-h-button data-variant="outline">Outline</button>
<button x-h-button data-variant="transparent">Transparent</button>
<a x-h-button data-variant="link" href="#">Link</a>
```

## Button with icons

You can include an icon directly inside the button.

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col items-center gap-4">
<button x-h-button>
  <i role="img" data-lucide="chevron-left"></i>
  Left-aligned
</button>
<button x-h-button>
  <i role="img" data-lucide="chevron-right"></i>
  Right-aligned
</button>
<button x-h-button>
  <svg class="fill-foreground" width="16" height="16" version="1.1" viewBox="0 0 .75 .75" xmlns="http://www.w3.org/2000/svg">
    <path d="m0.32031 0.046875a0.27344 0.27344 0 0 0-0.27344 0.27344 0.27344 0.27344 0 0 0 0.27344 0.27343 0.27344 0.27344 0 0 0 0.17271-0.06145l0.17083 0.17083 0.039274-0.039274-0.17083-0.17083a0.27344 0.27344 0 0 0 0.06145-0.17271 0.27344 0.27344 0 0 0-0.27343-0.27344zm0 0.055543a0.2179 0.2179 0 0 1 0.2179 0.2179 0.2179 0.2179 0 0 1-0.2179 0.2179 0.2179 0.2179 0 0 1-0.2179-0.2179 0.2179 0.2179 0 0 1 0.2179-0.2179z" fill-rule="evenodd"/>
  </svg>
  Search
</button>
</component-container>
</ClientOnly>

```html
<button x-h-button>
  <i role="img" data-lucide="chevron-left"></i>
  Left-aligned
</button>
<button x-h-button>
  <i role="img" data-lucide="chevron-right"></i>
  Right-aligned
</button>
<button x-h-button>
  <svg class="fill-foreground" width="512" height="512" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m10 0a10 10 0 0 0-10 10 10 10 0 0 0 10 9.9999 10 10 0 0 0 6.3163-2.2473l6.2474 6.2474 1.4363-1.4363-6.2474-6.2474a10 10 0 0 0 2.2473-6.3163 10 10 0 0 0-9.9999-10zm0 2.0313a7.9688 7.9688 0 0 1 7.9688 7.9688 7.9688 7.9688 0 0 1-7.9688 7.9688 7.9688 7.9688 0 0 1-7.9688-7.9688 7.9688 7.9688 0 0 1 7.9688-7.9688z"
      fill-rule="evenodd"
    />
  </svg>
  Search
</button>
```

## Icon button

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col items-center gap-4">
<button x-h-button data-size="icon" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
</component-container>
</ClientOnly>

```html
<button x-h-button data-size="icon" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
```

## Button sizes

### Extra small

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col items-center gap-4">
<button x-h-button data-size="xs">
  <i role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-xs" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
</component-container>
</ClientOnly>

```html
<button x-h-button data-size="xs">
  <i role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-xs" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
```

### Small

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col items-center gap-4">
<button x-h-button data-size="sm">
  <i role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-sm" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
</component-container>
</ClientOnly>

```html
<button x-h-button data-size="sm">
  <i role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-sm" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
```

### Large

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col items-center gap-4">
<button x-h-button data-size="lg">
  <i role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-lg" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
</component-container>
</ClientOnly>

```html
<button x-h-button data-size="lg">
  <i role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-lg" aria-label="Icon button">
  <i role="img" data-lucide="save"></i>
</button>
```
