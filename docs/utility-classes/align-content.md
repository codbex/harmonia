# Align Content

Aligns rows inside grids or wrapping flex layouts.

## Class names

| Class           | Description                     |
| --------------- | ------------------------------- |
| content-start   | `align-content: flex-start;`    |
| content-center  | `align-content: center;`        |
| content-end     | `align-content: flex-end;`      |
| content-between | `align-content: space-between;` |
| content-around  | `align-content: space-around;`  |
| content-evenly  | `align-content: space-evenly;`  |
| content-stretch | `align-content: stretch;`       |

## Examples

### Start

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-3 content-start gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-3 content-start gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
```

### Center

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-3 content-center gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-3 content-center gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
```

### End

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-3 content-end gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-3 content-end gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
```

### Between

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-3 content-between gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-3 content-between gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
```

### Around

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-3 content-around gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-3 content-around gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
```

### Evenly

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-3 content-evenly gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-3 content-evenly gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
```

### Stretch

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="grid grid-cols-3 content-stretch gap-4 h-full">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid h-full grid-cols-3 content-stretch gap-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
</div>
```
