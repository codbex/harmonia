# Include

The include directive makes it easy to fetch and insert an external HTML fragment inside an element. The request is restricted to the same domain, protocol and port as the application.

::: warning

- Only use on trusted content and never on dynamic/user-provided content!<br />
- Dynamically rendering HTML from third parties can easily lead to XSS vulnerabilities.<br />
- Executing untrusted JavaScript code poses significant security risks and should be strictly avoided.
  :::

::: info
The directive executes before any binding.
:::

## API Reference

### Component attubute(s)

```
x-h-include
```

### Arguments

| Attribute | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| `self`    | string | true     | Relative path to the HTML fragment. |

### Modifiers

| Modifier | Description                                                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| js       | By default, the directive does not execute any JavaScript code.<br />If the fragment includes a script that should execute, use this modifirer. |

## Examples

<ClientOnly>
<component-container>
  <div x-h-include="'/harmonia/components/include/fragment.html'"></div>
</component-container>
</ClientOnly>

```html
<div x-h-include="'/harmonia/components/include/fragment.html'"></div>
```
