# Template

The template directive makes it easy to insert and initialize an Alpine.js snippet inside a referenced `<template>` element. When used in combination with Alpine’s `x-for` directive, it enables recursive template rendering on the client side.

## Usage

Use the template directive to reuse HTML snippets and generate repeated or nested content efficiently. The template should be clearly structured and maintainable. Avoid overcomplicating recursive structures, as deeply nested templates can impact performance and readability.

::: info
Similar to Alpine's `x-for` directive, the referenced `<template>` element MUST contain only one root element.
:::

## API Reference

### Component attribute(s)

```
x-h-template
```

### Arguments

| Attribute | Type              | Required | Description                                                                                      |
| --------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `self`    | `$ref.<template>` | true     | Reference to the template that contains the code that should be inserted and initialized.        |
| x-data    | object            | true     | The properties defined in an x-data directive will be available to the rendered tempate element. |

## Examples

### Tree with recursive rendering

<ClientOnly>
<component-container src="/components/template/tree.html">
</component-container>
</ClientOnly>

<<< @/public/components/template/tree.html
