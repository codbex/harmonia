# Button Group

A container that groups buttons together.

## API Reference

### Component attubute(s)

```
x-h-button-group
x-h-button-group-separator
```

### Attributes

| Attribute        | Type                         | Required | Description                                  |
| ---------------- | ---------------------------- | -------- | -------------------------------------------- |
| data-orientation | `horizontal`<br />`vertical` | false    | Changes the orientation of the button group. |

## Horizontal

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-wrap justify-evenly gap-4">
<div x-h-button-group>
  <button x-h-button data-variant="outline">Action</button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Add button">
    <i role="img" data-lucide="plus"></i>
  </button>
</div>
<div x-h-button-group>
  <button x-h-button>Left</button>
  <div x-h-button-group-separator></div>
  <button x-h-button>Right</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-button-group>
  <button x-h-button data-variant="outline">Action</button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Add button">
    <i role="img" data-lucide="plus"></i>
  </button>
</div>
<div x-h-button-group>
  <button x-h-button>Left</button>
  <div x-h-button-group-separator></div>
  <button x-h-button>Right</button>
</div>
```

## Vertical

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex justify-evenly gap-4">
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-variant="outline">Top</button>
  <button x-h-button data-variant="outline">Center</button>
  <button x-h-button data-variant="outline">Bottom</button>
</div>
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom in">
    <i role="img" data-lucide="zoom-in"></i>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Fit to screen">
    <i role="img" data-lucide="fullscreen"></i>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom out">
    <i role="img" data-lucide="zoom-out"></i>
  </button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-variant="outline">Top</button>
  <button x-h-button data-variant="outline">Center</button>
  <button x-h-button data-variant="outline">Bottom</button>
</div>
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom in">
    <i role="img" data-lucide="zoom-in"></i>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Fit to screen">
    <i role="img" data-lucide="fullscreen"></i>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom out">
    <i role="img" data-lucide="zoom-out"></i>
  </button>
</div>
```
