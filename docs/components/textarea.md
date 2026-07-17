# Textarea

Provides a multi-line input field for users to enter longer text. Textareas should always be paired with a label to clearly communicate the expected content and ensure accessibility.

## Usage

Use textareas for capturing extended input, such as comments, descriptions, or messages. The label should be descriptive. Provide optional hints or validation to guide proper entry. Avoid leaving textareas unlabeled, as this can confuse users and reduce accessibility.

## API Reference

### Component attribute(s)

```
x-h-textarea
```

### Modifiers

| Modifier | Description                                     |
| -------- | ----------------------------------------------- |
| group    | Used when the textarea is inside an input group |

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

<LiveExample data-class="flex flex-col gap-4">

```html
<textarea x-h-textarea placeholder="Comment..."></textarea>
```

</LiveExample>

### Without resize handle

<LiveExample data-exclude="generator">

```html
<textarea x-h-textarea class="resize-none"></textarea>
```

</LiveExample>

### Invalid

<LiveExample>

```html
<textarea x-h-textarea aria-invalid="true">Invalid text</textarea>
```

</LiveExample>

### Disabled

<LiveExample>

```html
<textarea x-h-textarea disabled>Disabled text</textarea>
```

</LiveExample>

### Read-only

<LiveExample>

```html
<textarea x-h-textarea readonly>Read-only text</textarea>
```

</LiveExample>
