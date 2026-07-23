# Tooltip

A small pop-up that provides additional information or context about an interface element, displayed on hover. Tooltips offer brief guidance without taking up permanent space in the layout.

## Usage

Use tooltips to clarify controls, explain icons, or provide contextual hints. Keep the content concise and relevant, and avoid placing critical information exclusively in tooltips, as they may be inaccessible on touch devices or overlooked by users.

## Keyboard Handling

The tooltip is shown when the trigger is hovered or receives focus, so keyboard users reach it by tabbing to the trigger. Moving focus away (or the pointer leaving) hides it again.

- `Esc` - Dismisses the tooltip while the trigger keeps focus.

## Accessibility

The trigger is linked to the tooltip through `aria-describedby`, so assistive technologies announce the tooltip content as a description of the trigger. The tooltip itself has `role="tooltip"`, and its show and hide transitions respect the user's `prefers-reduced-motion` setting.

## API Reference

### Component attribute(s)

```
x-h-tooltip
x-h-tooltip-trigger
```

::: info Trigger and menu placement
The `x-h-tooltip` element must be placed somewhere AFTER the `x-h-tooltip-trigger` and they must have the same direct parent. Otherwise, the tooltip will not be able to find the trigger.
:::

## Examples

<LiveExample data-class="flex items-center">

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

</LiveExample>
