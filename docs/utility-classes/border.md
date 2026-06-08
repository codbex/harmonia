# Border

Classes for adding a border or border radius to an element.

## Border

### Class names

| Class          | Description                                              |
| -------------- | -------------------------------------------------------- |
| box-border     | `box-sizing: border-box`                                 |
| border         | Border on all 4 sides, 1px.                              |
| border-0       | No border.                                               |
| border-`2..12` | Border width from 2 to 12px. `border-width: <number>px;` |
| border-t       | Top border.                                              |
| border-r       | Right border.                                            |
| border-b       | Bottom border.                                           |
| border-l       | Left border.                                             |
| border-solid   | Solid line border.                                       |
| border-dotted  | Dotted line border.                                      |
| border-dashed  | Dashed line border.                                      |

### Examples

#### Border Side

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 gap-5 md:grid-cols-5">
  <div class="border text-center">Border</div>
  <div class="border-l text-center">Left</div>
  <div class="border-t text-center">Top</div>
  <div class="border-b text-center">Bottom</div>
  <div class="border-r text-center">Right</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-3 gap-5 md:grid-cols-5">
  <div class="border text-center">Border</div>
  <div class="border-l text-center">Left</div>
  <div class="border-t text-center">Top</div>
  <div class="border-b text-center">Bottom</div>
  <div class="border-r text-center">Right</div>
</div>
```

#### Border Size

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 gap-5 md:grid-cols-6">
  <div class="border text-center">border</div>
  <div class="border-2 text-center">border-2</div>
  <div class="border-4 text-center">border-4</div>
  <div class="border-6 text-center">border-6</div>
  <div class="border-8 text-center">border-8</div>
  <div class="border-12 text-center">border-12</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-3 gap-5 md:grid-cols-6">
  <div class="border text-center">border</div>
  <div class="border-2 text-center">border-2</div>
  <div class="border-4 text-center">border-4</div>
  <div class="border-6 text-center">border-6</div>
  <div class="border-8 text-center">border-8</div>
  <div class="border-12 text-center">border-12</div>
</div>
```

## Divide

Adds a border between child elements by applying a border to all children except the last one.

### Class names

| Class                   | Description                                                                    |
| ----------------------- | ------------------------------------------------------------------------------ |
| divide-x                | Vertical dividers between horizontally stacked children (border on left side). |
| divide-y                | Horizontal dividers between vertically stacked children (border on top side).  |
| divide-x-reverse        | Adjusts `divide-x` for reversed flex row direction (`flex-row-reverse`).       |
| divide-y-reverse        | Adjusts `divide-y` for reversed flex column direction (`flex-col-reverse`).    |
| divide-x-0 / divide-y-0 | Removes the divider width.                                                     |
| divide-x-`2..12`        | Sets the horizontal divider width from 2 to 12px.                              |
| divide-y-`2..12`        | Sets the vertical divider width from 2 to 12px.                                |
| divide-solid            | Solid divider line style.                                                      |
| divide-dashed           | Dashed divider line style.                                                     |
| divide-dotted           | Dotted divider line style.                                                     |

### Examples

#### Divide X

<ClientOnly>
<component-container>
<div class="flex divide-x">
  <div class="px-4 text-center">First</div>
  <div class="px-4 text-center">Second</div>
  <div class="px-4 text-center">Third</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex divide-x">
  <div class="px-4 text-center">First</div>
  <div class="px-4 text-center">Second</div>
  <div class="px-4 text-center">Third</div>
</div>
```

#### Divide Y

<ClientOnly>
<component-container>
<div class="flex flex-col divide-y">
  <div class="py-2 text-center">First</div>
  <div class="py-2 text-center">Second</div>
  <div class="py-2 text-center">Third</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-col divide-y">
  <div class="py-2 text-center">First</div>
  <div class="py-2 text-center">Second</div>
  <div class="py-2 text-center">Third</div>
</div>
```

#### Divide Style

<ClientOnly>
<component-container>
<div class="hbox gap-4">
  <div class="vbox divide-y divide-solid">
    <div class="px-4">Solid</div>
    <div class="px-4">Solid</div>
    <div class="px-4">Solid</div>
  </div>
  <div class="vbox divide-y-2 divide-dashed">
    <div class="px-4">Dashed</div>
    <div class="px-4">Dashed</div>
    <div class="px-4">Dashed</div>
  </div>
  <div class="vbox divide-y-2 divide-dotted">
    <div class="px-4">Dotted</div>
    <div class="px-4">Dotted</div>
    <div class="px-4">Dotted</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="hbox gap-4">
  <div class="vbox divide-y divide-solid">
    <div class="px-4">Solid</div>
    <div class="px-4">Solid</div>
    <div class="px-4">Solid</div>
  </div>
  <div class="vbox divide-y-2 divide-dashed">
    <div class="px-4">Dashed</div>
    <div class="px-4">Dashed</div>
    <div class="px-4">Dashed</div>
  </div>
  <div class="vbox divide-y-2 divide-dotted">
    <div class="px-4">Dotted</div>
    <div class="px-4">Dotted</div>
    <div class="px-4">Dotted</div>
  </div>
</div>
```

---

## Border Radius

### Class names

| Class             | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| rounded-`size`    | Border radius on all 4 corners.                                    |
| rounded-t-`size`  | Border radius on the top-left and top-right corners.               |
| rounded-b-`size`  | Border radius on the bottom-left and bottom-right corners.         |
| rounded-s-`size`  | Border radius on the start side (top-left and bottom-left in LTR). |
| rounded-e-`size`  | Border radius on the end side (top-right and bottom-right in LTR). |
| rounded-tl-`size` | Border radius on the top-left corner only.                         |
| rounded-tr-`size` | Border radius on the top-right corner only.                        |
| rounded-bl-`size` | Border radius on the bottom-left corner only.                      |
| rounded-br-`size` | Border radius on the bottom-right corner only.                     |

Available sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `none`, `full`.

### Examples

#### Border Radius Size

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 gap-5 md:grid-cols-5">
  <div class="border rounded-none p-3 text-center text-sm">none</div>
  <div class="border rounded-xs p-3 text-center text-sm">xs</div>
  <div class="border rounded-sm p-3 text-center text-sm">sm</div>
  <div class="border rounded-md p-3 text-center text-sm">md</div>
  <div class="border rounded-lg p-3 text-center text-sm">lg</div>
  <div class="border rounded-xl p-3 text-center text-sm">xl</div>
  <div class="border rounded-2xl p-3 text-center text-sm">2xl</div>
  <div class="border rounded-3xl p-3 text-center text-sm">3xl</div>
  <div class="border rounded-4xl p-3 text-center text-sm">4xl</div>
  <div class="border rounded-full p-3 text-center text-sm">full</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-3 gap-5 md:grid-cols-5">
  <div class="rounded-none border p-3 text-center text-sm">none</div>
  <div class="rounded-xs border p-3 text-center text-sm">xs</div>
  <div class="rounded-sm border p-3 text-center text-sm">sm</div>
  <div class="rounded-md border p-3 text-center text-sm">md</div>
  <div class="rounded-lg border p-3 text-center text-sm">lg</div>
  <div class="rounded-xl border p-3 text-center text-sm">xl</div>
  <div class="rounded-2xl border p-3 text-center text-sm">2xl</div>
  <div class="rounded-3xl border p-3 text-center text-sm">3xl</div>
  <div class="rounded-4xl border p-3 text-center text-sm">4xl</div>
  <div class="rounded-full border p-3 text-center text-sm">full</div>
</div>
```

#### Border Radius Side

<ClientOnly>
<component-container>
<div class="grid grid-cols-2 gap-5 md:grid-cols-4">
  <div class="border rounded-xl p-3 text-center text-sm">rounded-xl</div>
  <div class="border rounded-t-xl p-3 text-center text-sm">rounded-t-xl</div>
  <div class="border rounded-b-xl p-3 text-center text-sm">rounded-b-xl</div>
  <div class="border rounded-s-xl p-3 text-center text-sm">rounded-s-xl</div>
  <div class="border rounded-e-xl p-3 text-center text-sm">rounded-e-xl</div>
  <div class="border rounded-tl-xl p-3 text-center text-sm">rounded-tl-xl</div>
  <div class="border rounded-tr-xl p-3 text-center text-sm">rounded-tr-xl</div>
  <div class="border rounded-bl-xl p-3 text-center text-sm">rounded-bl-xl</div>
  <div class="border rounded-br-xl p-3 text-center text-sm">rounded-br-xl</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-2 gap-5 md:grid-cols-4">
  <div class="rounded-xl border p-3 text-center text-sm">rounded-xl</div>
  <div class="rounded-t-xl border p-3 text-center text-sm">rounded-t-xl</div>
  <div class="rounded-b-xl border p-3 text-center text-sm">rounded-b-xl</div>
  <div class="rounded-s-xl border p-3 text-center text-sm">rounded-s-xl</div>
  <div class="rounded-e-xl border p-3 text-center text-sm">rounded-e-xl</div>
  <div class="rounded-tl-xl border p-3 text-center text-sm">rounded-tl-xl</div>
  <div class="rounded-tr-xl border p-3 text-center text-sm">rounded-tr-xl</div>
  <div class="rounded-bl-xl border p-3 text-center text-sm">rounded-bl-xl</div>
  <div class="rounded-br-xl border p-3 text-center text-sm">rounded-br-xl</div>
</div>
```
