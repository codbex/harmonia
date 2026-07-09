# Range

Allows users to select a value, or a range of values, by dragging a handle along a track. The component is based on [noUiSlider](https://github.com/leongersen/noUiSlider) and an interactive control over numeric inputs.

## Usage

Use range sliders for selecting numeric values within a defined range, such as volume, price, or time intervals. Avoid using sliders for exact numeric input as precision can be difficult with dragging alone.

## API Reference

### Component attribute(s)

```
x-h-range
```

### Attributes

Please refer to the [noUiSlider documentation](https://refreshless.com/nouislider/)

## Examples

<LiveExample data-style="height: 6rem">

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

</LiveExample>

### Disabled

Set the native `disabled` attribute on the element to disable the slider.

<LiveExample data-style="height: 4rem">

```html
<div x-h-range="config" x-data="rangeDisabledData" disabled x-model="value"></div>
<script>
  Alpine.data('rangeDisabledData', () => ({
    value: [40],
    config: {
      orientation: 'horizontal',
      start: [40],
      connect: 'lower',
      range: { min: 0, max: 100 },
      step: 1,
    },
  }));
</script>
```

</LiveExample>
