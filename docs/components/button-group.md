# Button Group

Groups related buttons into a single container to present them as a unified set of actions. This helps establish visual relationships and improves clarity when multiple actions are closely related.

## Usage

Use button groups to organize actions that share a common context or hierarchy. Choose a horizontal or vertical layout based on available space and the flow of the interface. Avoid grouping unrelated or loosely related actions.

## API Reference

### Component attribute(s)

```
x-h-button-group
x-h-button-group-separator
```

### Attributes

| Attribute        | Type                         | Required | Description                                  |
| ---------------- | ---------------------------- | -------- | -------------------------------------------- |
| data-orientation | `horizontal`<br />`vertical` | false    | Changes the orientation of the button group. |

## Examples

### Horizontal

<LiveExample data-class="flex flex-wrap justify-evenly gap-4">

```html
<div x-h-button-group>
  <button x-h-button data-variant="outline">Action</button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Add button">
    <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
  </button>
</div>
<div x-h-button-group>
  <button x-h-button>Left</button>
  <div x-h-button-group-separator></div>
  <button x-h-button>Right</button>
</div>
```

</LiveExample>

### Vertical

<LiveExample data-class="flex justify-evenly gap-4">

```html
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-variant="outline">Top</button>
  <button x-h-button data-variant="outline">Center</button>
  <button x-h-button data-variant="outline">Bottom</button>
</div>
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom in">
    <svg x-h-lucide role="presentation" data-lucide="zoom-in"></svg>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Fit to screen">
    <svg x-h-lucide role="presentation" data-lucide="fullscreen"></svg>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom out">
    <svg x-h-lucide role="presentation" data-lucide="zoom-out"></svg>
  </button>
</div>
```

</LiveExample>
