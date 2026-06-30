# Grid Layout

## Class names

| Class            | Description                                     |
| ---------------- | ----------------------------------------------- |
| grid             | `display: grid;`                                |
| grid-cols-`1-12` | Number of grid columns. From 1 to 12.           |
| col-span-`1-12`  | Number of columns an item spans. From 1 to 12.  |
| row-span-`1-12`  | Number of rows an item spans. From 1 to 12.     |

::: info Responsive grid
You can combine the `grid-cols-*` and `col-span-*` classes with the standard `sm`, `md`, `lg` and `xl` breakpoint prefixes to make the grid responsive.
:::

### Justify grid items

| Class                 | Description               |
| --------------------- | ------------------------- |
| justify-items-start   | `justify-items: start;`   |
| justify-items-center  | `justify-items: center;`  |
| justify-items-end     | `justify-items: end;`     |
| justify-items-stretch | `justify-items: stretch;` |

### Align and justify grid items

| Class               | Description             |
| ------------------- | ----------------------- |
| place-items-start   | `place-items: start;`   |
| place-items-center  | `place-items: center;`  |
| place-items-end     | `place-items: end;`     |
| place-items-stretch | `place-items: stretch;` |

## Examples

### Grid

<ClientOnly>
<component-container>
<div class="grid grid-cols-12 gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
  <span class="bg-primary text-primary-foreground p-2">7</span>
  <span class="bg-primary text-primary-foreground p-2">8</span>
  <span class="bg-primary text-primary-foreground p-2">9</span>
  <span class="bg-primary text-primary-foreground p-2">10</span>
  <span class="bg-primary text-primary-foreground p-2">11</span>
  <span class="bg-primary text-primary-foreground p-2">12</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-12 gap-1">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
  <span class="bg-primary p-2 text-primary-foreground">7</span>
  <span class="bg-primary p-2 text-primary-foreground">8</span>
  <span class="bg-primary p-2 text-primary-foreground">9</span>
  <span class="bg-primary p-2 text-primary-foreground">10</span>
  <span class="bg-primary p-2 text-primary-foreground">11</span>
  <span class="bg-primary p-2 text-primary-foreground">12</span>
</div>
```

### Responsive grid

<ClientOnly>
<component-container>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
  <span class="bg-primary text-primary-foreground p-2">7</span>
  <span class="bg-primary text-primary-foreground p-2">8</span>
  <span class="bg-primary text-primary-foreground p-2">9</span>
  <span class="bg-primary text-primary-foreground p-2">10</span>
  <span class="bg-primary text-primary-foreground p-2">11</span>
  <span class="bg-primary text-primary-foreground p-2">12</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
  <span class="bg-primary p-2 text-primary-foreground">7</span>
  <span class="bg-primary p-2 text-primary-foreground">8</span>
  <span class="bg-primary p-2 text-primary-foreground">9</span>
  <span class="bg-primary p-2 text-primary-foreground">10</span>
  <span class="bg-primary p-2 text-primary-foreground">11</span>
  <span class="bg-primary p-2 text-primary-foreground">12</span>
</div>
```

### Justify items start

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 justify-items-start gap-4">
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
<div class="grid grid-cols-3 justify-items-start gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

### Justify items center

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 justify-items-center gap-4">
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
<div class="grid grid-cols-3 justify-items-center gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

### Justify items end

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 justify-items-end gap-4">
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
<div class="grid grid-cols-3 justify-items-end gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

### Justify items stretch

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 justify-items-stretch gap-4">
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
<div class="grid grid-cols-3 justify-items-stretch gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

### Column span

<ClientOnly>
<component-container>
<div class="grid grid-cols-4 gap-1">
  <span class="bg-primary text-primary-foreground p-2 col-span-2">col-span-2</span>
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2 col-span-3">col-span-3</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-4 gap-1">
  <span class="bg-primary col-span-2 p-2 text-primary-foreground">col-span-2</span>
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary col-span-3 p-2 text-primary-foreground">col-span-3</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

### Row span

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 gap-1" style="height: 10rem">
  <span class="bg-primary text-primary-foreground p-2 row-span-2">row-span-2</span>
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-3 gap-1" style="height: 10rem">
  <span class="bg-primary row-span-2 p-2 text-primary-foreground">row-span-2</span>
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

### Place items start

<ClientOnly>
<component-container data-style="height: 18rem">
<div class="grid grid-cols-3 place-items-start gap-4 h-full">
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
<div class="grid h-full grid-cols-3 justify-items-start gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

### Place items center

<ClientOnly>
<component-container data-style="height: 18rem">
<div class="grid grid-cols-3 place-items-center gap-4 h-full">
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
<div class="grid h-full grid-cols-3 justify-items-center gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

### Place items end

<ClientOnly>
<component-container data-style="height: 18rem">
<div class="grid grid-cols-3 place-items-end gap-4 h-full">
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
<div class="grid h-full grid-cols-3 justify-items-end gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

### Place items stretch

<ClientOnly>
<component-container data-style="height: 18rem">
<div class="grid grid-cols-3 place-items-stretch gap-4 h-full">
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
<div class="grid h-full grid-cols-3 justify-items-stretch gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```
