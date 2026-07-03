# Input Number

Allows users to enter numeric values with built-in validation and step controls. This component should be paired with a label to clearly communicate the expected value and improve accessibility.

## Usage

Use the number input when users need to enter a bounded numeric value, such as a quantity, age, or step-based setting. Set `min`, `max`, and `step` on the native `<input type="number">` to constrain the value and drive the increment/decrement controls. Always pair it with a label so the expected value is clear.

## API Reference

### Component attribute(s)

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

<LiveExample>

```html
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="4" />
</div>
```

</LiveExample>

### Invalid Number Input

<LiveExample>

```html
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="12" aria-invalid="true" />
</div>
```

</LiveExample>
