# Badge

The badge is a short text that represents the semantic status of an object. It has a semantic color and an optional icon.

## API Reference

### Component attubute(s)

```
x-h-badge
```

### Attributes

| Attribute    | Type                                                                                       | Required | Description          |
| ------------ | ------------------------------------------------------------------------------------------ | -------- | -------------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`<br />`outline` | false    | Semantic color state |

## Examples

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col gap-4">
<div x-h-badge>Badge</div>
<div x-h-badge data-variant="primary">Primary</div>
<div x-h-badge data-variant="positive"><i role="img" data-lucide="check"></i>Positive</div>
<div x-h-badge data-variant="negative"><i role="img" data-lucide="x"></i>Negative</div>
<div x-h-badge data-variant="warning"><i role="img" data-lucide="siren"></i>Warning</div>
<div x-h-badge data-variant="information"><i role="img" data-lucide="info"></i>Information</div>
<div x-h-badge data-variant="outline">Outline</div>
<a x-h-badge href="#">Link</a>
</component-container>
</ClientOnly>

```html
<div x-h-badge>Badge</div>
<div x-h-badge data-variant="primary">Primary</div>
<div x-h-badge data-variant="positive"><i role="img" data-lucide="check"></i>Positive</div>
<div x-h-badge data-variant="negative"><i role="img" data-lucide="x"></i>Negative</div>
<div x-h-badge data-variant="warning"><i role="img" data-lucide="siren"></i>Warning</div>
<div x-h-badge data-variant="information"><i role="img" data-lucide="info"></i>Information</div>
<div x-h-badge data-variant="outline">Outline</div>
<a x-h-badge href="#">Link</a>
```
