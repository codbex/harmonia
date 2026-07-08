# Chip

A compact, interactive element used to represent an applied filter, a selected item, or a categorization. Chips support semantic color variants and an optional close button for dismissal.

## Usage

Use chips to display user-generated input or active selections that can be reviewed and removed. Always apply `x-h-chip` to a `<button>` element - this ensures proper keyboard interaction and press states. The close button (`x-h-chip-close`) must be placed on a `<span>` element inside the chip and requires an accessible label via `aria-label` or `aria-labelledby`. Chips can optionally include an icon before the label text. When a chip controls a popover or menu dropdown, the close button will automatically allow click events to propagate when the chip is in its expanded state, so the overlay can respond correctly.

## API Reference

### Component attribute(s)

```
x-h-chip
x-h-chip-close
```

### Attributes

#### x-h-chip

> Must be applied to a `<button>` element.

| Attribute    | Type                                                                                       | Required | Description    |
| ------------ | ------------------------------------------------------------------------------------------ | -------- | -------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`<br />`outline` | false    | Semantic color |

#### x-h-chip-close

> Must be applied to a `<span>` element.

| Attribute       | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| aria-label      | string | true\*   | Accessible label for the close action                    |
| aria-labelledby | string | true\*   | References an element whose text labels the close action |

::: info \* One of `aria-label` or `aria-labelledby` is required.
:::

## Examples

### Text-Only

<LiveExample data-exclude="generator">

```html
<button x-h-chip>Chip</button>
```

</LiveExample>

### Truncate Text

To enable text truncation, wrap the label in a `<span>`, `<p>`, or `<div>` element.

<LiveExample data-exclude="generator">

```html
<button x-h-chip style="max-width:4rem">
  <span>Truncate text</span>
</button>
```

</LiveExample>

### Icon & Text

<LiveExample data-exclude="generator">

```html
<button x-h-chip>
  <svg x-h-icon data-icon="mail" role="presentation"></svg>
  <span>Chip</span>
</button>
```

</LiveExample>

### Icon, Text & Close Button

<LiveExample>

```html
<button x-h-chip>
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
```

</LiveExample>

### Outline Variant

<LiveExample>

```html
<button x-h-chip data-variant="outline">
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
```

</LiveExample>

### Primary Variant

<LiveExample>

```html
<button x-h-chip data-variant="primary">
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
```

</LiveExample>

### Information Variant

<LiveExample>

```html
<button x-h-chip data-variant="information">
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
```

</LiveExample>

### Warning Variant

<LiveExample>

```html
<button x-h-chip data-variant="warning">
  <svg x-h-icon data-icon="circle-warning" role="presentation"></svg>
  <span>Chip</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
```

</LiveExample>

### Positive Variant

<LiveExample>

```html
<button x-h-chip data-variant="positive">
  <svg x-h-icon data-icon="circle-success" role="presentation"></svg>
  <span>Chip</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
```

</LiveExample>

### Negative Variant

<LiveExample>

```html
<button x-h-chip data-variant="negative">
  <svg x-h-icon data-icon="circle-error" role="presentation"></svg>
  <span>Chip</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
```

</LiveExample>

### With Popover

<LiveExample>

```html
<button x-h-chip x-h-popover-trigger data-variant="information">
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span class="text-muted-foreground">Chip:</span>
  <span>Enabled</span>
  <span x-h-chip-close aria-label="remove chip"></span>
</button>
<div class="w-64 p-4" x-h-popover>Chip Popover</div>
```

</LiveExample>
