# Tooltip

A small pop-up that provides additional information or context about an interface element, displayed on hover. Tooltips offer brief guidance without taking up permanent space in the layout.

## Usage

Use tooltips to clarify controls, explain icons, or provide contextual hints. Keep the content concise and relevant, and avoid placing critical information exclusively in tooltips, as they may be inaccessible on touch devices or overlooked by users.

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
