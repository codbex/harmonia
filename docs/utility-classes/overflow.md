# Overflow

CSS utility classes set overflow behaviour.

## Class names

| Class              | Description              |
| ------------------ | ------------------------ |
| overflow-auto      | `overflow: auto;`        |
| overflow-hidden    | `overflow: hidden;`      |
| overflow-visible   | `overflow: visible;`     |
| overflow-scroll    | `overflow: scroll;`      |
| overflow-x-scroll  | `overflow-x: scroll;`    |
| overflow-y-scroll  | `overflow-y: scroll;`    |
| overflow-x-visible | `overflow-x: visible;`   |
| overflow-y-visible | `overflow-y: visible;`   |
| overflow-x-auto    | `overflow-x: auto;`      |
| overflow-y-auto    | `overflow-y: auto;`      |
| overflow-x-hidden  | `overflow-x: hidden;`    |
| overflow-y-hidden  | `overflow-y: hidden;`    |
| scrollbar-none     | `scrollbar-width: none;` |

## Examples

### Scroll

<br />

<ClientOnly>
<component-container>
<div class="tile-sm overflow-scroll">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm overflow-scroll">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### Scroll (hidden scrollbars)

<br />

<ClientOnly>
<component-container>
<div class="tile-sm overflow-scroll scrollbar-none">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm scrollbar-none overflow-scroll">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### Scroll horizontally

<br />

<ClientOnly>
<component-container>
<div class="tile-sm overflow-x-scroll overflow-y-hidden">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm overflow-x-scroll overflow-y-hidden">
  <svg x-h-icon class="" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### Scroll vertivally

<br />

<ClientOnly>
<component-container>
<div class="tile-sm overflow-y-scroll overflow-x-hidden">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm overflow-x-hidden overflow-y-scroll">
  <svg x-h-icon class="" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### No scroll

<br />

<ClientOnly>
<component-container>
<div class="tile-sm overflow-hidden">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm overflow-hidden">
  <svg x-h-icon class="" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

### Visible

<br />

<ClientOnly>
<component-container>
<div class="tile-sm overflow-visible">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm overflow-visible">
  <svg x-h-icon class="" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```
