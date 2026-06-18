# Justify Content

Distributes space between and around items along the main axis of a flex container and the inline axis of a grid container.

## Class names

| Class            | Description                       |
| ---------------- | --------------------------------- |
| justify-start    | `justify-content: flex-start;`    |
| justify-center   | `justify-content: center;`        |
| justify-end      | `justify-content: flex-end;`      |
| justify-end-safe | `justify-content: safe flex-end;` |
| justify-between  | `justify-content: space-between;` |
| justify-around   | `justify-content: space-around;`  |
| justify-evenly   | `justify-content: space-evenly;`  |
| justify-stretch  | `justify-content: stretch;`       |

## Examples

### Start

<ClientOnly>
<component-container>
<div class="flex justify-start gap-2">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex justify-start gap-2">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

### Center

<ClientOnly>
<component-container>
<div class="flex justify-center gap-2">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex justify-center gap-2">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

### End

<ClientOnly>
<component-container>
<div class="flex justify-end gap-2">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex justify-end gap-2">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

### End safe

<ClientOnly>
<component-container>
<div class="vbox gap-2">
  <label x-h-label>End</label>
  <div class="flex justify-end gap-2 overflow-hidden">
    <span class="bg-primary text-primary-foreground py-2 px-12">1</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">2</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">3</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">4</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">5</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">6</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">7</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">8</span>
  </div>
  <label x-h-label>End safe</label>
  <div class="flex justify-end-safe gap-2 overflow-hidden">
    <span class="bg-primary text-primary-foreground py-2 px-12">1</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">2</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">3</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">4</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">5</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">6</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">7</span>
    <span class="bg-primary text-primary-foreground py-2 px-12">8</span>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="vbox gap-2">
  <label x-h-label>End</label>
  <div class="flex justify-end gap-2 overflow-hidden">
    <span class="bg-primary px-12 py-2 text-primary-foreground">1</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">2</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">3</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">4</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">5</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">6</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">7</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">8</span>
  </div>
  <label x-h-label>End safe</label>
  <div class="flex justify-end-safe gap-2 overflow-hidden">
    <span class="bg-primary px-12 py-2 text-primary-foreground">1</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">2</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">3</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">4</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">5</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">6</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">7</span>
    <span class="bg-primary px-12 py-2 text-primary-foreground">8</span>
  </div>
</div>
```

### Between

<ClientOnly>
<component-container>
<div class="flex justify-between">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex justify-between">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

### Around

<ClientOnly>
<component-container>
<div class="flex justify-around">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex justify-around">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

### Evenly

<ClientOnly>
<component-container>
<div class="flex justify-evenly">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex justify-evenly">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```
