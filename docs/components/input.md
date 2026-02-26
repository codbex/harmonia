# Input

Provides a single-line field for users to enter text or color values. Inputs should always be paired with a label to clearly communicate the expected content and ensure accessibility.

## Usage

Use input fields for capturing user data, such as names, emails, or color. If you need a numeric input, use the [Input Number](/components/input-number) instead. Avoid leaving inputs unlabeled, as this can confuse users and reduce accessibility.

## API Reference

### Component attubute(s)

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

## Examples

### Text Input

<br />

<ClientOnly>
<component-container data-class="flex flex-col gap-4">
<input x-h-input type="text" placeholder="Search..." />
<input x-h-input data-size="sm" type="text" placeholder="Search..." />
</component-container>
</ClientOnly>

```html
<input x-h-input type="text" placeholder="Search..." /> <input x-h-input data-size="sm" type="text" placeholder="Search..." />
```

### Color Input

<br />

<ClientOnly>
<component-container>
<input x-h-input type="color" value="#26a269" />
</component-container>
</ClientOnly>

```html
<input x-h-input type="color" value="#26a269" />
```

### Invalid Input

<br />

<ClientOnly>
<component-container>
<input x-h-input type="text" aria-invalid="true" />
</component-container>
</ClientOnly>

```html
<input x-h-input type="text" aria-invalid="true" />
```
