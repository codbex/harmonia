# Collapsible

The collapsible component is used when an element`s visibility must be toggled based on a click.

## API Reference

### Component attubute(s)

```
x-h-collapsible
x-h-collapsible-trigger
x-h-collapsible-content
```

### Attributes

#### x-h-collapsible

| Attribute | Type    | Required | Description                               |
| --------- | ------- | -------- | ----------------------------------------- |
| `self`    | boolean | false    | Sets the default state on the collapsible |

### Modifiers

#### x-h-collapsible-trigger

| Modifier | Description                                        |
| -------- | -------------------------------------------------- |
| chevron  | Rotates the icon inside the trigger at 180 degrees |
| 90       | Rotates the icon inside the trigger at 90 degrees  |

## Examples

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-collapsible="true">
  <button x-h-button x-h-collapsible-trigger.chevron>
    Click
    <i role="img" data-lucide="chevron-down"></i>
  </button>
  <div x-h-collapsible-content>Collapsable content</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-collapsible="true">
  <button x-h-button x-h-collapsible-trigger.chevron>
    Click
    <i role="img" data-lucide="chevron-down"></i>
  </button>
  <div x-h-collapsible-content>Collapsable content</div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-collapsible="false">
  <button x-h-button x-h-collapsible-trigger.chevron.90>
    Click
    <i role="img" data-lucide="chevron-right"></i>
  </button>
  <div x-h-collapsible-content>Collapsable content</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-collapsible="false">
  <button x-h-button x-h-collapsible-trigger.chevron.90>
    Click
    <i role="img" data-lucide="chevron-right"></i>
  </button>
  <div x-h-collapsible-content>Collapsable content</div>
</div>
```
