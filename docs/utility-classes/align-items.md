# Align Content

Aligns items along the cross axis of a flex or grid container.

## Class names

| Class          | Description                |
| -------------- | -------------------------- |
| items-start    | `align-items: flex-start;` |
| items-center   | `align-items: center;`     |
| items-end      | `align-items: flex-end;`   |
| items-baseline | `align-items: baseline;`   |
| items-stretch  | `align-content: stretch;`  |

## Examples

### Start

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="flex items-start gap-4 h-full">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex h-full items-start gap-4">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
```

### Center

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="flex items-center gap-4 h-full">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex h-full items-center gap-4">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
```

### End

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="flex items-end gap-4 h-full">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex h-full items-end gap-4">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
```

### Baseline

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="flex items-baseline gap-4 h-full">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex h-full items-baseline gap-4">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
```

### Stretch

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="flex items-stretch gap-4 h-full">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex h-full items-stretch gap-4">
  <span class="bg-primary text-primary-foreground flex-1 p-2">1</span>
  <span class="bg-primary text-primary-foreground flex-1 px-2 pt-2 pb-12">2</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">3</span>
</div>
```
