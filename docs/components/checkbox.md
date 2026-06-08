# Checkbox

Allows users to select or deselect an option, representing a binary choice (true/false). Checkboxes indicate the current state of a setting or preference.

## Usage

Use checkboxes for independent options where multiple selections are allowed. For mutually exclusive choices, use a [Radio button](/components/radio).

## API Reference

### Component attribute(s)

```
x-h-checkbox
```

## Examples

<ClientOnly>
<component-container data-class="flex items-center gap-3 justify-center">
<span x-h-checkbox>
  <input type="checkbox" id="unchecked" />
</span>
<label x-h-label for="unchecked">Unchecked</label>
</component-container>
</ClientOnly>

```html
<div class="flex items-center gap-3">
  <span x-h-checkbox>
    <input type="checkbox" id="unchecked" />
  </span>
  <label x-h-label for="unchecked">Unchecked</label>
</div>
```

<ClientOnly>
<component-container data-class="flex items-center gap-3 justify-center">
<span x-h-checkbox>
  <input type="checkbox" id="checked" checked />
</span>
<label x-h-label for="checked">Checked</label>
</component-container>
</ClientOnly>

```html
<div class="flex items-center gap-3">
  <span x-h-checkbox>
    <input type="checkbox" id="checked" checked />
  </span>
  <label x-h-label for="checked">Checked</label>
</div>
```

<ClientOnly>
<component-container data-class="flex items-center gap-3 justify-center">
<span x-h-checkbox>
  <input type="checkbox" id="checked" x-ref="inter" x-data="{ init() { this.$refs.inter.indeterminate = true } }" />
</span>
<label x-h-label for="checked">Indeterminate</label>
</component-container>
</ClientOnly>

```html
<div class="flex items-center gap-3">
  <span x-h-checkbox>
    <input type="checkbox" id="checked" x-ref="inter" x-data="{ init() { this.$refs.inter.indeterminate = true } }" />
  </span>
  <label x-h-label for="checked">Indeterminate</label>
</div>
```
