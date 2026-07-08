# Input

Provides a single-line field for users to enter text or color values. Inputs should always be paired with a label to clearly communicate the expected content and ensure accessibility.

## Usage

Use input fields for capturing user data, such as names, emails, or color. If you need a numeric input, use the [Input Number](/components/input-number) instead. Avoid leaving inputs unlabeled, as this can confuse users and reduce accessibility.

## API Reference

### Component attribute(s)

```
x-h-input
```

### Attributes

| Attribute | Values             | Required | Description                    |
| --------- | ------------------ | -------- | ------------------------------ |
| data-size | `sm`<br/>`default` | false    | Changes the size of the input. |

### Modifiers

| Modifier | Description                                  |
| -------- | -------------------------------------------- |
| group    | Used when the input is inside an input group |
| table    | Used when the input is inside a table        |

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

### Text Input

<LiveExample data-class="flex flex-col gap-4" data-exclude="generator">

<!-- prettier-ignore -->
```html
<input x-h-input type="text" placeholder="Search..." />
<input x-h-input data-size="sm" type="text" placeholder="Search..." />
```

</LiveExample>

### Color Input

<LiveExample>

```html
<input x-h-input type="color" value="#26a269" />
```

</LiveExample>

### Invalid Input

<LiveExample>

```html
<input x-h-input type="text" aria-invalid="true" />
```

</LiveExample>
