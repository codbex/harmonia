# Radio

A single-choice input that allows users to select one option from a set.

## Usage

Use radio buttons when users must choose only one option from a group. All options must be clearly labeled and grouped logically. Avoid using radio buttons for independent yes/no choices as [checkboxes](/components/checkbox) are more appropriate in that case.

## API Reference

### Component attribute(s)

```
x-h-radio
```

## Examples

<LiveExample>

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

</LiveExample>
