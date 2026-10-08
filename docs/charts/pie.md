# Pie Chart

`x-h-chart-pie` draws a pie chart from a single reactive configuration object. Charts inherit the active theme colors and adapt to light and dark mode automatically.

## Usage

Give the chart a container with an explicit height (charts fill their parent). Provide the `slices` to draw, each with a `label` and a `value`. Use a pie chart to show how parts make up a whole. To compare discrete categories use a [Bar Chart](/charts/bar), and for trends over an ordered sequence use a [Line Chart](/charts/line).

## API Reference

### Component attribute(s)

```
x-h-chart-pie
```

### Attributes

| Attribute      | Type                                 | Required | Description                                                                                       |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| data-font-size | `xs`<br />`sm`<br />`base`<br />`lg` | false    | Changes the size of all chart text, such as labels, axis ticks, and the legend. Defaults to `xs`. |

### Configuration

| Key             | Type                              | Default                | Description                                                                                             |
| --------------- | --------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `slices`        | `{ label, value, color? }[]`      | required               | The slices to draw. Only positive values are shown. For `color` values, see [Colors](#colors).          |
| `series`        | `{ data: number[] }[]` + `labels` | required               | Alternative to `slices`. Тhe first series' values become slices, named by `labels`.                     |
| `legend`        | boolean                           | `true`                 | Show the color/label key.                                                                               |
| `tooltip`       | boolean                           | `true`                 | Show a tooltip on hover and emit interaction events.                                                    |
| `dataLabels`    | boolean                           | `true`                 | Draw each slice's percentage on the slice (hidden for slices under 5%).                                 |
| `labelPosition` | `'inside'` \| `'outside'`         | `'inside'`             | Place the percentage labels inside each slice or just outside the slice edge.                           |
| `valueFormat`   | `(value) => string`               | locale number          | Formats values in tooltips.                                                                             |
| `palette`       | string[]                          | `color-1` to `color-9` | Chart colors cycled for slices without an explicit `color`. See [Colors](#colors) for more information. |
| `tableLabels`   | `{ segment?, value? }`            | English defaults       | Column headers of the hidden data table read by screen readers.                                         |

#### Colors

A slice `color` (and the `palette` entries) is one of the chart colors `color-1` to `color-12`. They paint with the theme's `--chart-color-1` to `--chart-color-12` variables (see [Theme Customization](/custom-themes#colors)). By default, they map to blue, red, green, orange, purple, teal, pink, indigo, yellow, gray, white and black. The standard color names (`red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`, `white` and `black`) are deprecated. They still work but they will be removed in the next major version.

### Accessibility

The chart is exposed to assistive technologies as a `figure` with a visually-hidden data table of its segments and values, so screen-reader users get the underlying numbers (the visual slices and legend are marked decorative). It defaults to the accessible name "Pie chart". Set an `aria-label` attribute on the element to give it a more meaningful name.

### Events

When `tooltip` is enabled, hovering and clicking data emit bubbling `CustomEvent`s on the chart element. These events are shared by all chart types.

| Event         | Fired when                            |
| ------------- | ------------------------------------- |
| `chart-hover` | The pointer enters a bar/point/slice. |
| `chart-leave` | The pointer leaves a bar/point/slice. |
| `chart-click` | A bar/point/slice is clicked.         |

Each event's `detail` is:

```js
{
  type: 'bar' | 'point' | 'slice',
  seriesName: string | undefined,
  seriesIndex: number,
  categoryIndex: number, // data index (bar/line) or slice index (pie)
  label: string,
  value: number,
  color: string          // 'color-1' to 'color-12', or a deprecated standard color name
}
```

Clicking or tapping a data point pins its tooltip open (useful on touchscreens, where there is no hover). The pinned tooltip stays until another point is clicked or a press lands elsewhere.

### Data Slots

| Slot                  | Element                                   |
| --------------------- | ----------------------------------------- |
| `chart`               | `x-h-chart-pie`                           |
| `chart-svg`           | The chart drawing                         |
| `chart-pie`           | A slice                                   |
| `chart-label`         | A value label                             |
| `chart-legend`        | The legend                                |
| `chart-legend-swatch` | A legend color swatch                     |
| `chart-tooltip`       | The hover tooltip                         |
| `chart-table`         | The data table for assistive technologies |
| `chart-empty`         | The message shown when there is no data   |

## Examples

### Basic

<LiveExample>

```html
<div
  class="aspect-square h-full"
  style="max-height: 20rem"
  x-h-chart-pie="{
    slices: [
      { label: 'Direct', value: 4120 },
      { label: 'Referral', value: 2580 },
      { label: 'Social', value: 2060 },
      { label: 'Other', value: 1540 }
    ]
  }"
></div>
```

</LiveExample>

### Labels outside the slices

<LiveExample>

```html
<div
  class="aspect-square h-full"
  style="max-height: 20rem"
  x-h-chart-pie="{
    labelPosition: 'outside',
    slices: [
      { label: 'Direct', value: 40 },
      { label: 'Referral', value: 25 },
      { label: 'Social', value: 20 },
      { label: 'Other', value: 15 }
    ]
  }"
></div>
```

</LiveExample>
