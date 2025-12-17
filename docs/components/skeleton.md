# Skeleton

Placeholder component while content is loading.

## API Reference

### Component attubute(s)

```
x-h-skeleton
```

### Modifiers

| Modifier | Description                                             |
| -------- | ------------------------------------------------------- |
| control  | Takes the shape of a control (like inputs and buttons). |
| card     | Takes the shape of a card or tile.                      |
| avatar   | Takes the shape of an avatar component.                 |

### Attributes

| Attribute | Type           | Required | Description                                                                   |
| --------- | -------------- | -------- | ----------------------------------------------------------------------------- |
| data-size | `xs`<br />`sm` | false    | Height of the skeleton. Works only when combined with the `control` modifier. |

## Examples

<ClientOnly>
<component-container>
<div class="flex flex-col gap-2">
  <div x-h-skeleton.avatar></div>
  <div x-h-skeleton.card class="tile-xs"></div>
  <div x-h-skeleton.control class="w-1/2"></div>
  <div x-h-skeleton class="h-12 w-full"></div>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex flex-col gap-2">
  <div x-h-skeleton.avatar></div>
  <div x-h-skeleton.card class="tile-xs"></div>
  <div x-h-skeleton.control class="w-1/2"></div>
  <div x-h-skeleton class="h-12 w-full"></div>
</div>
```
