# Separator

A simple visual divider used to separate content or sections within an interface. Separators help improve layout clarity and guide the user’s eye through the content.

## Usage

Use separators to distinguish between related groups of elements, such as menu items, form sections, or content blocks. Avoid overusing separators, as excessive dividers can clutter the interface and reduce visual hierarchy.

## API Reference

### Component attribute(s)

```
x-h-separator
```

### Attributes

| Attribute        | Type                         | Required | Description                               |
| ---------------- | ---------------------------- | -------- | ----------------------------------------- |
| data-orientation | `horizontal`<br />`vertical` | false    | Changes the orientation of the separator. |

## Examples

<LiveExample>

```html
<div class="flex flex-col gap-3">
  <div class="flex h-6 items-center gap-4">
    <p x-h-text>Text</p>
    <div x-h-separator data-orientation="vertical"></div>
    <p x-h-text>Text</p>
    <div x-h-separator data-orientation="vertical"></div>
    <p x-h-text>Text</p>
  </div>
  <div x-h-separator data-orientation="horizontal"></div>
  <div class="flex h-6 items-center gap-4">
    <p x-h-text>Text</p>
    <div x-h-separator data-orientation="vertical"></div>
    <p x-h-text>Text</p>
    <div x-h-separator data-orientation="vertical"></div>
    <p x-h-text>Text</p>
  </div>
</div>
```

</LiveExample>
