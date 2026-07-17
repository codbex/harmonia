# Checkbox

Allows users to select or deselect an option, representing a binary choice (true/false). Checkboxes indicate the current state of a setting or preference.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use checkboxes for independent options where multiple selections are allowed. For mutually exclusive choices, use a Radio button.

## Directive

- `x-h-checkbox`

## Examples

### Unchecked

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="unchecked" />
  </span>
  <label x-h-label for="unchecked">Unchecked</label>
</div>
```

### Checked

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="checked" checked />
  </span>
  <label x-h-label for="checked">Checked</label>
</div>
```

### Indeterminate

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="indeterminate" x-ref="inter" x-data="{ init() { this.$refs.inter.indeterminate = true } }" />
  </span>
  <label x-h-label for="indeterminate">Indeterminate</label>
</div>
```

### Invalid

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="invalidCheckbox" checked aria-invalid="true" />
  </span>
  <label x-h-label for="invalidCheckbox">Invalid</label>
</div>
```

### Disabled

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-checkbox>
    <input type="checkbox" id="disabledCheckbox" checked disabled />
  </span>
  <label x-h-label for="disabledCheckbox">Disabled</label>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/checkbox.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
