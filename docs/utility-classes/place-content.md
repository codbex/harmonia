# Place Content

Justifies and aligns content at the same time. Applies to both flex and grid layouts.

## Class names

| Class                 | Description                     |
| --------------------- | ------------------------------- |
| place-content-start   | `place-content: start;`         |
| place-content-center  | `place-content: center;`        |
| place-content-end     | `place-content: end;`           |
| place-content-between | `place-content: space-between;` |
| place-content-around  | `place-content: space-around;`  |
| place-content-evenly  | `place-content: space-evenly;`  |
| place-content-stretch | `place-content: stretch;`       |

## Examples

### Start

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-2 place-content-start gap-4 h-full" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-2 place-content-start gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
```

### Center

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-2 place-content-center gap-4 h-full" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-2 place-content-center gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
```

### End

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-2 place-content-end gap-4 h-full" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-2 place-content-end gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
```

### Between

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-2 place-content-between gap-4 h-full" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-2 place-content-between gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
```

### Around

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-2 place-content-around gap-4 h-full" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-2 place-content-around gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
```

### Evenly

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-2 place-content-evenly gap-4 h-full" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-2 place-content-evenly gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
```

### Stretch

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-2 place-content-stretch gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-2 place-content-stretch gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
```
