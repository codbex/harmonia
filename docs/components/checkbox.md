# Checkbox

Allows users to select or deselect an option, representing a binary choice (true/false). Checkboxes indicate the current state of a setting or preference.

## Usage

Use checkboxes for independent options where multiple selections are allowed. For mutually exclusive choices, use a [Radio button](/components/radio).

## API Reference

### Component attribute(s)

```
x-h-checkbox
```

### Modifiers

#### x-h-checkbox

| Modifier | Description                                                                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tree     | Used when the checkbox is inside a [Tree](/components/tree) item. The checkbox is then disabled automatically whenever its item is. Throws when used elsewhere. |

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

### Data Slots

| Slot       | Element        |
| ---------- | -------------- |
| `checkbox` | `x-h-checkbox` |

## Examples

### Unchecked

<LiveExample>

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="unchecked" />
  </span>
  <label x-h-label for="unchecked">Unchecked</label>
</div>
```

</LiveExample>

### Checked

<LiveExample>

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="checked" checked />
  </span>
  <label x-h-label for="checked">Checked</label>
</div>
```

</LiveExample>

### Indeterminate

<LiveExample>

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="indeterminate" x-ref="inter" x-data="{ init() { this.$refs.inter.indeterminate = true } }" />
  </span>
  <label x-h-label for="indeterminate">Indeterminate</label>
</div>
```

</LiveExample>

### Invalid

<LiveExample>

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="invalidCheckbox" checked aria-invalid="true" />
  </span>
  <label x-h-label for="invalidCheckbox">Invalid</label>
</div>
```

</LiveExample>

### Disabled

<LiveExample>

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="disabledCheckbox" checked disabled />
  </span>
  <label x-h-label for="disabledCheckbox">Disabled</label>
</div>
```

</LiveExample>
