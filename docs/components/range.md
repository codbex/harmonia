# Range

Allows users to select a value—or a range of values—by dragging a handle along a track. The component is based on [noUiSlider](https://github.com/leongersen/noUiSlider) and an interactive control over numeric inputs.

## Usage

Use range sliders for selecting numeric values within a defined range, such as volume, price, or time intervals. Avoid using sliders for exact numeric input as precision can be difficult with dragging alone.

## API Reference

### Component attubute(s)

```
x-h-range
```

### Attributes

Please refer to the [noUiSlider documentation](https://refreshless.com/nouislider/)

## Examples

<ClientOnly>
<component-container>
<div class="mb-8" x-h-range="config" x-data="{
    range: [20, 80],
    config: {
      orientation: 'horizontal',
      start: [3, 6],
      connect: true,
      range: { min: 1, max: 8 },
      step: 1,
      tooltips: true,
      pips: { mode: 'steps' },
    },
  }" auto-hide-tips="true" x-model="range"></div>
</component-container>
</ClientOnly>

```html
<div x-h-range="config" x-data="rangeData" auto-hide-tips="true" x-model="range"></div>
<script>
  Alpine.data('rangeData', () => ({
    range: [20, 80],
    config: {
      orientation: 'horizontal',
      start: [3, 6],
      connect: true,
      range: { min: 1, max: 8 },
      step: 1,
      tooltips: true,
      pips: { mode: 'steps' },
    },
  }));
</script>
```
