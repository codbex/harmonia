# Input Number

Allows users to enter numeric values with built-in validation and step controls. This component should be paired with a label to clearly communicate the expected value and improve accessibility.

## API Reference

### Component attubute(s)

```
x-h-input-number
```

### Attributes

| Attribute | Values             | Required | Description                    |
| --------- | ------------------ | -------- | ------------------------------ |
| data-size | `sm`<br/>`default` | false    | Changes the size of the input. |

### Modifiers

| Modifier | Description                           |
| -------- | ------------------------------------- |
| table    | Used when the input is inside a table |

## Examples

### Number Input

<br />

<ClientOnly>
<component-container>
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="4" />
</div>
</component-container>
</ClientOnly>

```html
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="4" />
</div>
```

### Invalid Number Input

<br />

<ClientOnly>
<component-container>
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="12" aria-invalid="true" />
</div>
</component-container>
</ClientOnly>

```html
<input x-h-input type="text" aria-invalid="true" />
```
