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

## Examples

### Start

<br />

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
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Center

<br />

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
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### End

<br />

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
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### End safe

<br />

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
    <span class="bg-primary text-primary-foreground px-12 py-2">1</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">2</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">3</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">4</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">5</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">6</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">7</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">8</span>
  </div>
  <label x-h-label>End safe</label>
  <div class="flex justify-end-safe gap-2 overflow-hidden">
    <span class="bg-primary text-primary-foreground px-12 py-2">1</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">2</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">3</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">4</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">5</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">6</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">7</span>
    <span class="bg-primary text-primary-foreground px-12 py-2">8</span>
  </div>
</div>
```

### Between

<br />

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
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Around

<br />

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
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Evenly

<br />

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
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```
