# Tooltip

The tooltip (aka hint) is a small pop-up that displays extra information about an element on hover.

## API Reference

### Component attubute(s)

```
x-h-tooltip
x-h-tooltip-trigger
```

::: info Trigger and menu placement
The `x-h-tooltip` element must be placed somewhere AFTER the `x-h-tooltip-trigger` and they must have the same direct parent. Otherwise, the tooltip will not be able to find the trigger.
:::

## Examples

<ClientOnly>
<component-container data-class="flex items-center">
<button x-h-button x-h-tooltip-trigger>Button</button>
<div x-h-tooltip>
  Buttons are clickable
  <div x-h-tag-group>
    <div x-h-tag>Ctrl</div>
    <span>+</span>
    <div x-h-tag>B</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<button x-h-button x-h-tooltip-trigger>Button</button>
<div x-h-tooltip>
  Buttons are clickable
  <div x-h-tag-group>
    <div x-h-tag>Ctrl</div>
    <span>+</span>
    <div x-h-tag>B</div>
  </div>
</div>
```
