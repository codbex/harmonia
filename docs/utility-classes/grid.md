# Grid Layout

## Class names

| Class            | Description                                    |
| ---------------- | ---------------------------------------------- |
| grid             | `display: grid;`                               |
| grid-cols-`1-12` | Number of grid columns. From 1 to 12.          |
| col-span-`1-12`  | Number of columns an item spans. From 1 to 12. |
| row-span-`1-12`  | Number of rows an item spans. From 1 to 12.    |

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

<LiveExample>

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

</LiveExample>

### Responsive grid

<LiveExample>

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

</LiveExample>

### Justify items start

<LiveExample>

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

</LiveExample>

### Justify items center

<LiveExample>

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

</LiveExample>

### Justify items end

<LiveExample>

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

</LiveExample>

### Justify items stretch

<LiveExample>

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

</LiveExample>

### Column span

<LiveExample>

```html
<div class="grid grid-cols-4 gap-1">
  <span class="col-span-2 bg-primary p-2 text-primary-foreground">col-span-2</span>
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="col-span-3 bg-primary p-2 text-primary-foreground">col-span-3</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Row span

<LiveExample>

```html
<div class="grid grid-cols-3 gap-1" style="height: 10rem">
  <span class="row-span-2 bg-primary p-2 text-primary-foreground">row-span-2</span>
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### Place items start

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 place-items-start gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Place items center

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 place-items-center gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Place items end

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 place-items-end gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Place items stretch

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 place-items-stretch gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>
