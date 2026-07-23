# Z-Index

Utilities for controlling the stacking order of positioned elements. A higher `z-index` sits on top of a lower one.

## Class names

| Class | Description                                                               |
| ----- | ------------------------------------------------------------------------- |
| z-1   | `z-index: 1;`                                                             |
| z-10  | `z-index: 10;` Raised elements above normal flow.                         |
| z-50  | `z-index: 50;` Overlays such as popovers, dropdowns, and dialogs.         |
| z-60  | `z-index: 60;` The topmost layer, above overlays (used by notifications). |

`z-index` only affects positioned elements, so combine these with `absolute`, `fixed`, `relative`, or `sticky`.

## Examples

### Stacking order

<LiveExample>

```html
<div class="relative" style="height:6rem">
  <div class="absolute top-0 left-0 z-10 rounded-control border bg-secondary p-4">Behind</div>
  <div class="absolute z-50 rounded-control border bg-primary p-4 text-primary-foreground" style="top:1.5rem;left:3rem">In front</div>
</div>
```

</LiveExample>
