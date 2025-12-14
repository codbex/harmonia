# Overflow

CSS utility classes set overflow behaviour.

## Class names

| Class              | Description            |
| ------------------ | ---------------------- |
| overflow-hidden    | `overflow: hidden;`    |
| overflow-visible   | `overflow: visible;`   |
| overflow-scroll    | `overflow: scroll;`    |
| overflow-x-scroll  | `overflow-x: scroll;`  |
| overflow-y-scroll  | `overflow-y: scroll;`  |
| overflow-x-visible | `overflow-x: visible;` |
| overflow-y-visible | `overflow-y: visible;` |
| overflow-x-hidden  | `overflow-x: hidden;`  |
| overflow-y-hidden  | `overflow-y: hidden;`  |

## Examples

### Scroll

<br />

<ClientOnly>
<component-container>
<div class="tile-xs overflow-scroll">
  <svg x-h-icon class="tile-lg" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-xs overflow-scroll">
  <svg x-h-icon class="tile-lg" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### Scroll horizontally

<br />

<ClientOnly>
<component-container>
<div class="tile-xs overflow-x-scroll overflow-y-hidden">
  <svg x-h-icon class="tile-lg" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-xs overflow-x-scroll overflow-y-hidden">
  <svg x-h-icon class="" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### Scroll vertivally

<br />

<ClientOnly>
<component-container>
<div class="tile-xs overflow-y-scroll overflow-x-hidden">
  <svg x-h-icon class="tile-lg" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-xs overflow-x-hidden overflow-y-scroll">
  <svg x-h-icon class="" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### No scroll

<br />

<ClientOnly>
<component-container>
<div class="tile-xs overflow-hidden">
  <svg x-h-icon class="tile-lg" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-xs overflow-hidden">
  <svg x-h-icon class="" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### Visible

<br />

<ClientOnly>
<component-container>
<div class="tile-xs overflow-visible">
  <svg x-h-icon class="tile-lg" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-xs overflow-visible">
  <svg x-h-icon class="" data-link="/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```
