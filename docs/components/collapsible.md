# Collapsible

Provides expand-and-collapse functionality for any element, allowing content to be shown or hidden based on user interaction. This is a "behavioral" component, it does not include its own visual presentation and can be applied to a variety of UI elements.

## Usage

Use the Collapsible to add toggleable visibility to content areas without imposing a specific layout or style. Ideal for hiding optional details, advanced settings, or expandable sections within custom components. The interactive triggers must be clearly indicated to users, so the toggle behavior is discoverable.

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
