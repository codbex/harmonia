# Popover

The popover displays additional information for an object in a compact way without leaving the page. Do NOT use this as a dropdown. Use the menu component instead.

## API Reference

### Component attubute(s)

```
x-h-popover
x-h-popover-trigger
```

::: info Trigger and menu placement
The `x-h-popover` element must be placed somewhere AFTER the `x-h-popover-trigger` and they must have the same direct parent. Otherwise, the popover will not be able to find the trigger.
:::

### Attributes

#### x-h-popover-trigger

| Attribute | Type    | Required | Description                                                                                                    |
| --------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `self`    | boolean | false    | Boolean value, used to show and hide the popover programmatically. Disables the auto open/close functionality. |

#### x-h-popover

| Attribute  | Type                                                                                                                                                                          | Required | Description                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| data-align | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the popover body relative to the trigger. |

### Modifiers

#### x-h-popover-trigger

| Modifier | Description                                         |
| -------- | --------------------------------------------------- |
| chevron  | Rotates the icon inside the trigger at 180 degrees. |

#### x-h-popover

| Modifier  | Description                                 |
| --------- | ------------------------------------------- |
| no-scroll | Used when the popover body must not scroll. |

## Examples

### Popover

<br />

<ClientOnly>
<component-container>
<button x-h-button x-h-popover-trigger>Popover</button>
<div class="w-64 p-4" x-h-popover>Popover content</div>
</component-container>
</ClientOnly>

```html
<button x-h-button x-h-popover-trigger>Popover</button>
<div class="w-64 p-4" x-h-popover>Popover content</div>
```

### Popover (manual open/close)

<br />

<ClientOnly>
<component-container>
<div x-data="{ open: false }">
  <button x-h-button x-h-popover-trigger="open" x-on:click="open = !open">Popover</button>
  <div class="w-64 p-4" x-h-popover>Popover content</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ open: false }">
  <button x-h-button x-h-popover-trigger="open" @click="open = !open">Popover</button>
  <div class="w-64 p-4" x-h-popover>Popover content</div>
</div>
```

### Alignment

<br />

<ClientOnly>
<component-container>
<div class="flex flex-col" style="gap: 4rem">
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Bottom start</button>
    <div class="w-64 p-4" x-h-popover data-align="bottom-start">Bottom start content</div>
    <button x-h-button x-h-popover-trigger>Bottom</button>
    <div class="w-64 p-4" x-h-popover data-align="bottom">Bottom center content</div>
    <button x-h-button x-h-popover-trigger>Bottom end</button>
    <div class="w-64 p-4" x-h-popover data-align="bottom-end">Bottom end content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Right start</button>
    <div class="w-64 p-4" x-h-popover data-align="right-start">Right start content</div>
    <button x-h-button x-h-popover-trigger>Left start</button>
    <div class="w-64 p-4" x-h-popover data-align="left-start">Left start content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Right</button>
    <div class="w-64 p-4" x-h-popover data-align="right">Right center content</div>
    <button x-h-button x-h-popover-trigger>Left</button>
    <div class="w-64 p-4" x-h-popover data-align="left">Left center content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Right end</button>
    <div class="w-64 p-4" x-h-popover data-align="right-end">Right end content</div>
    <button x-h-button x-h-popover-trigger>Left end</button>
    <div class="w-64 p-4" x-h-popover data-align="left-end">Left end content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Top start</button>
    <div class="w-64 p-4" x-h-popover data-align="top-start">Top start content</div>
    <button x-h-button x-h-popover-trigger>Top</button>
    <div class="w-64 p-4" x-h-popover data-align="top">Top center content</div>
    <button x-h-button x-h-popover-trigger>Top end</button>
    <div class="w-64 p-4" x-h-popover data-align="top-end">Top end content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-col" style="gap: 4rem">
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Bottom start</button>
    <div class="w-64 p-4" x-h-popover data-align="bottom-start">Bottom start content</div>
    <button x-h-button x-h-popover-trigger>Bottom</button>
    <div class="w-64 p-4" x-h-popover data-align="bottom">Bottom center content</div>
    <button x-h-button x-h-popover-trigger>Bottom end</button>
    <div class="w-64 p-4" x-h-popover data-align="bottom-end">Bottom end content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Right start</button>
    <div class="w-64 p-4" x-h-popover data-align="right-start">Right start content</div>
    <button x-h-button x-h-popover-trigger>Left start</button>
    <div class="w-64 p-4" x-h-popover data-align="left-start">Left start content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Right</button>
    <div class="w-64 p-4" x-h-popover data-align="right">Right center content</div>
    <button x-h-button x-h-popover-trigger>Left</button>
    <div class="w-64 p-4" x-h-popover data-align="left">Left center content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Right end</button>
    <div class="w-64 p-4" x-h-popover data-align="right-end">Right end content</div>
    <button x-h-button x-h-popover-trigger>Left end</button>
    <div class="w-64 p-4" x-h-popover data-align="left-end">Left end content</div>
  </div>
  <div class="flex items-center justify-between gap-4">
    <button x-h-button x-h-popover-trigger>Top start</button>
    <div class="w-64 p-4" x-h-popover data-align="top-start">Top start content</div>
    <button x-h-button x-h-popover-trigger>Top</button>
    <div class="w-64 p-4" x-h-popover data-align="top">Top center content</div>
    <button x-h-button x-h-popover-trigger>Top end</button>
    <div class="w-64 p-4" x-h-popover data-align="top-end">Top end content</div>
  </div>
</div>
```
