# Flex Layout

## Class names

### Horizontal & Vertical Boxes

| Class | Description                    |
| ----- | ------------------------------ |
| vbox  | Combination of `flex flex-col` |
| hbox  | Combination of `flex flex-row` |

### Flex

| Class            | Description                      |
| ---------------- | -------------------------------- |
| flex             | `display: flex;`                 |
| flex-row         | Horizontal flex.                 |
| flex-col         | Vertical flex.                   |
| flex-row-reverse | Reverse order horizontal flex.   |
| flex-col-reverse | Reverse order vertical flex.     |
| flex-wrap        | Flex layout with wrapping items. |
| flex-0           | `flex: 0;`                       |
| flex-1           | `flex: 1;`                       |
| flex-auto        | `flex: auto;`                    |
| flex-none        | `flex: none;`                    |

`flex-row-reverse` and `flex-col-reverse` also support responsive prefixes `sm:`, `md:`, `lg:`, and `xl:` (e.g. `md:flex-row-reverse`).

::: info Flex classes
The `flex-*` classes must be combined with the `flex` class.
:::

## Examples

### Horizontal box

<LiveExample>

```html
<div class="hbox gap-1">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Vertical box

<LiveExample>

```html
<div class="vbox gap-1">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Horizontal flex

<LiveExample>

```html
<div class="flex flex-row gap-1">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Reverse horizontal flex

<LiveExample>

```html
<div class="flex flex-row-reverse gap-1">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Vertical flex

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full flex-col gap-1">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Reverse vertical flex

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full flex-col-reverse gap-1">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Flex wrap

<LiveExample>

```html
<div class="flex flex-row flex-wrap gap-1">
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
  <span class="bg-primary p-2 text-primary-foreground">13</span>
  <span class="bg-primary p-2 text-primary-foreground">14</span>
  <span class="bg-primary p-2 text-primary-foreground">15</span>
  <span class="bg-primary p-2 text-primary-foreground">16</span>
  <span class="bg-primary p-2 text-primary-foreground">17</span>
  <span class="bg-primary p-2 text-primary-foreground">18</span>
  <span class="bg-primary p-2 text-primary-foreground">19</span>
  <span class="bg-primary p-2 text-primary-foreground">20</span>
  <span class="bg-primary p-2 text-primary-foreground">21</span>
  <span class="bg-primary p-2 text-primary-foreground">22</span>
  <span class="bg-primary p-2 text-primary-foreground">23</span>
  <span class="bg-primary p-2 text-primary-foreground">24</span>
</div>
```

</LiveExample>

### Flex 1

<LiveExample>

```html
<div class="flex flex-row gap-1">
  <span class="bg-primary p-2 text-primary-foreground">Normal</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">Flex 1</span>
</div>
```

</LiveExample>

### Flex Auto

<LiveExample>

```html
<div class="flex flex-row gap-1">
  <span class="flex-auto bg-primary p-2 text-primary-foreground">Auto</span>
  <span class="flex-auto bg-primary p-2 text-primary-foreground">Auto</span>
</div>
```

</LiveExample>

### Flex none

<LiveExample>

```html
<div class="flex flex-row gap-1">
  <span class="flex-none bg-primary p-2 text-primary-foreground">None</span>
  <span class="flex-none bg-primary p-2 text-primary-foreground">None</span>
</div>
```

</LiveExample>
