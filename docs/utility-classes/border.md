# Border

Classes for adding a border or border radius to an element.

## Border

### Class names

| Class          | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| box-border     | `box-sizing: border-box`                                    |
| border         | Border on all 4 sides, 1px.                                 |
| border-`2..12` | Border width from 2 to 12px. `border-width: <number>px;`   |
| border-t       | Top border.                                                 |
| border-r       | Right border.                                               |
| border-b       | Bottom border.                                              |
| border-l       | Left border.                                                |

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

---

## Border Radius

### Class names

| Class                          | Description                                                         |
| ------------------------------ | ------------------------------------------------------------------- |
| rounded-`size`                 | Border radius on all 4 corners.                                     |
| rounded-t-`size`               | Border radius on the top-left and top-right corners.                |
| rounded-b-`size`               | Border radius on the bottom-left and bottom-right corners.          |
| rounded-s-`size`               | Border radius on the start side (top-left and bottom-left in LTR). |
| rounded-e-`size`               | Border radius on the end side (top-right and bottom-right in LTR). |
| rounded-tl-`size`              | Border radius on the top-left corner only.                          |
| rounded-tr-`size`              | Border radius on the top-right corner only.                         |
| rounded-bl-`size`              | Border radius on the bottom-left corner only.                       |
| rounded-br-`size`              | Border radius on the bottom-right corner only.                      |

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
```
