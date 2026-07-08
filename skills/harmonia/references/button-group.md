# Button Group

Groups related buttons into a single container to present them as a unified set of actions. This helps establish visual relationships and improves clarity when multiple actions are closely related.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use button groups to organize actions that share a common context or hierarchy. Choose a horizontal or vertical layout based on available space and the flow of the interface. Avoid grouping unrelated or loosely related actions.

## Directives

`x-h-button-group` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-button-group`
- `x-h-button-group-separator`

## API

### Attributes

| Attribute        | Type                         | Required | Description                                  |
| ---------------- | ---------------------------- | -------- | -------------------------------------------- |
| data-orientation | `horizontal`<br />`vertical` | false    | Changes the orientation of the button group. |

## Examples

### Horizontal

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

### Vertical

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

Full docs: https://www.codbex.com/harmonia/components/button-group.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
