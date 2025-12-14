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
| flex-1           | `flex: 1;`                       |
| flex-auto        | `flex: auto;`                    |
| flex-none        | `flex: none;`                    |

::: info Flex classes
The `flex-*` classes must be combined with the `flex` class.
:::

## Examples

### Horizontal box

<br />

<ClientOnly>
<component-container>
<div class="hbox gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="hbox gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Vertical box

<br />

<ClientOnly>
<component-container>
<div class="vbox gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="vbox gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Horizontal flex

<br />

<ClientOnly>
<component-container>
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Reverse horizontal flex

<br />

<ClientOnly>
<component-container>
<div class="flex flex-row-reverse gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-row-reverse gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Vertical flex

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="flex flex-col h-full gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex h-full flex-col gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Reverse vertical flex

<br />

<ClientOnly>
<component-container data-height="18rem">
<div class="flex flex-col-reverse h-full gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex h-full flex-col-reverse gap-1">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
</div>
```

### Flex wrap

<br />

<ClientOnly>
<component-container>
<div class="flex flex-row flex-wrap gap-1">
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
  <span class="bg-primary text-primary-foreground p-2">13</span>
  <span class="bg-primary text-primary-foreground p-2">14</span>
  <span class="bg-primary text-primary-foreground p-2">15</span>
  <span class="bg-primary text-primary-foreground p-2">16</span>
  <span class="bg-primary text-primary-foreground p-2">17</span>
  <span class="bg-primary text-primary-foreground p-2">18</span>
  <span class="bg-primary text-primary-foreground p-2">19</span>
  <span class="bg-primary text-primary-foreground p-2">20</span>
  <span class="bg-primary text-primary-foreground p-2">21</span>
  <span class="bg-primary text-primary-foreground p-2">22</span>
  <span class="bg-primary text-primary-foreground p-2">23</span>
  <span class="bg-primary text-primary-foreground p-2">24</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-row flex-wrap gap-1">
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
  <span class="bg-primary text-primary-foreground p-2">13</span>
  <span class="bg-primary text-primary-foreground p-2">14</span>
  <span class="bg-primary text-primary-foreground p-2">15</span>
  <span class="bg-primary text-primary-foreground p-2">16</span>
  <span class="bg-primary text-primary-foreground p-2">17</span>
  <span class="bg-primary text-primary-foreground p-2">18</span>
  <span class="bg-primary text-primary-foreground p-2">19</span>
  <span class="bg-primary text-primary-foreground p-2">20</span>
  <span class="bg-primary text-primary-foreground p-2">21</span>
  <span class="bg-primary text-primary-foreground p-2">22</span>
  <span class="bg-primary text-primary-foreground p-2">23</span>
  <span class="bg-primary text-primary-foreground p-2">24</span>
</div>
```

### Flex 1

<br />

<ClientOnly>
<component-container>
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground p-2">Normal</span>
  <span class="bg-primary text-primary-foreground p-2 flex-1">Flex 1</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground p-2">Normal</span>
  <span class="bg-primary text-primary-foreground flex-1 p-2">Flex 1</span>
</div>
```

### Flex Auto

<br />

<ClientOnly>
<component-container>
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground p-2 flex-auto">Auto</span>
  <span class="bg-primary text-primary-foreground p-2 flex-auto">Auto</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground flex-auto p-2">Auto</span>
  <span class="bg-primary text-primary-foreground flex-auto p-2">Auto</span>
</div>
```

### Flex none

<br />

<ClientOnly>
<component-container>
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground p-2 flex-none">None</span>
  <span class="bg-primary text-primary-foreground p-2 flex-none">None</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-row gap-1">
  <span class="bg-primary text-primary-foreground flex-none p-2">None</span>
  <span class="bg-primary text-primary-foreground flex-none p-2">None</span>
</div>
```
