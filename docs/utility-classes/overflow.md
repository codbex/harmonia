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

<LiveExample>

```html
<div class="tile-sm overflow-scroll">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

</LiveExample>

### Scroll (hidden scrollbars)

<LiveExample>

```html
<div class="tile-sm scrollbar-none overflow-scroll">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

</LiveExample>

### Scroll horizontally

<LiveExample>

```html
<div class="tile-sm overflow-x-scroll overflow-y-hidden">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

</LiveExample>

### Scroll vertivally

<LiveExample>

```html
<div class="tile-sm overflow-x-hidden overflow-y-scroll">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

</LiveExample>

### No scroll

<LiveExample>

```html
<div class="tile-sm overflow-hidden">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

</LiveExample>

### Visible

<LiveExample>

```html
<div class="tile-sm overflow-visible">
  <svg x-h-icon class="tile-lg" data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
</div>
```

</LiveExample>
