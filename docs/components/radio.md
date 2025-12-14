# Radio

Native radio control with custom styles.

## API Reference

### Component attubute(s)

```
x-h-radio
```

## Examples

<ClientOnly>
<component-container>
<form class="flex flex-col gap-3">
  <div x-h-field data-orientation="horizontal">
    <span x-h-radio>
      <input type="radio" name="size" id="r_small" value="small" checked />
    </span>
    <label x-h-label for="r_small">Small</label>
  </div>
  <div x-h-field data-orientation="horizontal">
    <span x-h-radio>
      <input type="radio" name="size" id="r_medium" value="medium" />
    </span>
    <label x-h-label for="r_medium">Medium</label>
  </div>
  <div x-h-field data-orientation="horizontal">
    <span x-h-radio>
      <input type="radio" name="size" id="r_large" value="large" />
    </span>
    <label x-h-label for="r_large">Large</label>
  </div>
</form>
</component-container>
</ClientOnly>

```html
<form class="flex flex-col gap-3">
  <div x-h-field data-orientation="horizontal">
    <span x-h-radio>
      <input type="radio" name="size" id="r_small" value="small" checked />
    </span>
    <label x-h-label for="r_small">Small</label>
  </div>
  <div x-h-field data-orientation="horizontal">
    <span x-h-radio>
      <input type="radio" name="size" id="r_medium" value="medium" />
    </span>
    <label x-h-label for="r_medium">Medium</label>
  </div>
  <div x-h-field data-orientation="horizontal">
    <span x-h-radio>
      <input type="radio" name="size" id="r_large" value="large" />
    </span>
    <label x-h-label for="r_large">Large</label>
  </div>
</form>
```
