# Checkbox

Checkboxes allow the user to set a binary value such as “true/false”.

## API Reference

### Component attubute(s)

```
x-h-checkbox
```

## Examples

<ClientOnly>
<component-container data-class="flex items-center gap-3 justify-center">
<span x-h-checkbox>
  <input type="checkbox" id="terms" />
</span>
<label x-h-label for="terms">Accept terms</label>
</component-container>
</ClientOnly>

```html
<div class="flex items-center gap-3">
  <span x-h-checkbox>
    <input x-h-checkbox type="checkbox" id="terms" />
  </span>
  <label x-h-label for="terms">Just accept</label>
</div>
```
