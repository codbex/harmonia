# Input Number

Allows users to enter numeric values with built-in validation and step controls. This component should be paired with a label to clearly communicate the expected value and improve accessibility.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use the number input when users need to enter a bounded numeric value, such as a quantity, age, or step-based setting. Set `min`, `max`, and `step` on the native `<input type="number">` to constrain the value and drive the increment/decrement controls. Always pair it with a label so the expected value is clear.

## Behavior

Decimal separators follow the browser's regional settings. When a typed separator is not accepted there, the browser drops the keystroke without any signal, so the digits around it would silently merge into a different number. The component detects the dropped keystroke and marks the input as invalid until the entry is revised by deleting or otherwise changing the value, stepping, or entering a separator that is accepted. The invalid state uses native custom validity, so it shows through the invalid styling and blocks form submission. Grouping separators (for example the comma in `1,000`) are not supported by native number inputs and are treated the same way. The reported message can be changed with `data-invalid-label`.

## Directive

- `x-h-input-number`

## API

### Attributes

| Attribute          | Values             | Required | Description                                                                                                                      |
| ------------------ | ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| data-size          | `sm`<br/>`default` | false    | Changes the size of the input.                                                                                                   |
| data-invalid-label | string             | false    | Message reported when a typed decimal separator is not recognized (Defaults to `A typed decimal separator was not recognized.`). |

### Modifiers

| Modifier | Description                           |
| -------- | ------------------------------------- |
| table    | Used when the input is inside a table |

### Model

Bind a number with `x-model.number` on the inner native input. While an in-progress entry is not yet a valid number (for example a partially typed decimal), the browser exposes no value, so the model is `null` until the entry becomes valid. The text typed so far stays visible in the field.

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

### Number Input

```html
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="4" />
</div>
```

### With a model

```html
<div x-data="{ amount: 4 }" class="flex flex-col gap-3">
  <div x-h-input-number>
    <input type="number" min="0" max="10" x-model.number="amount" />
  </div>
  <span x-text="amount"></span>
</div>
```

### Invalid

Reacts to the native invalid state or to the `aria-invalid` attribute.

```html
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="12" aria-invalid="true" />
</div>
```

### Disabled

```html
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="4" disabled />
</div>
```

### Read-only

The value is shown with a muted background, and the step controls are hidden.

```html
<div x-h-input-number>
  <input type="number" min="0" max="10" step="2" value="4" readonly />
</div>
```

Full docs: https://www.codbex.com/harmonia/components/input-number.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
