# Polar Area Chart

`x-h-chart-polar-area` draws a polar area chart from a single reactive configuration object. Every slice spans an equal angle and its value sets how far it reaches from the center. Charts inherit the active theme colors and adapt to light and dark mode automatically.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Give the chart a container with an explicit height (charts fill their parent). Provide the `slices` to draw, each with a `label` and a `value`. Use a polar area chart to compare magnitudes across categories in a compact circular layout. To show parts of a whole use a Pie Chart, and to compare categories along an axis use a Bar Chart.

## Directive

- `x-h-chart-polar-area`

## API

### Attributes

| Attribute      | Type                                 | Required | Description                                                                                       |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| data-font-size | `xs`<br />`sm`<br />`base`<br />`lg` | false    | Changes the size of all chart text, such as labels, axis ticks, and the legend. Defaults to `xs`. |

### Configuration

| Key           | Type                              | Default       | Description                                                                         |
| ------------- | --------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| `slices`      | `{ label, value, color? }[]`      | required      | The slices to draw. Only positive values are shown.                                 |
| `series`      | `{ data: number[] }[]` + `labels` | required      | Alternative to `slices`: the first series' values become slices, named by `labels`. |
| `legend`      | boolean                           | `true`        | Show the color/label key.                                                           |
| `axes`        | boolean                           | `true`        | Show the numeric tick labels along the vertical.                                    |
| `gridlines`   | boolean                           | `true`        | Show the concentric grid rings.                                                     |
| `tooltip`     | boolean                           | `true`        | Show a tooltip on hover and emit interaction events.                                |
| `dataLabels`  | boolean                           | `true`        | Draw each slice's value on the slice (hidden for small slices).                     |
| `tickCount`   | number                            | `5`           | Target number of grid rings.                                                        |
| `valueFormat` | `(value) => string`               | locale number | Formats values in tooltips, tick labels, and data labels.                           |
| `palette`     | string[]                          | theme tokens  | Color tokens cycled for slices without an explicit `color`.                         |

A slice `color` (and the `palette` entries) is one of the standard color names: `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`, `white`, or `black`.

### Accessibility

The chart is exposed to assistive technologies as a `figure` with a visually-hidden data table of its segments and values, so screen-reader users get the underlying numbers (the visual slices, rings, and legend are marked decorative). It defaults to the accessible name "Polar area chart". Set an `aria-label` attribute on the element to give it a more meaningful name.

### Events

When `tooltip` is enabled, hovering and clicking slices emit bubbling `CustomEvent`s on the chart element: `chart-hover`, `chart-leave`, and `chart-click`. See the events reference for the shared `detail` shape.

## Examples

### Basic

```html
<div
  class="aspect-square h-full"
  style="max-height: 20rem"
  x-h-chart-polar-area="{
    slices: [
      { label: 'Sales', value: 14 },
      { label: 'Marketing', value: 8 },
      { label: 'Support', value: 11 },
      { label: 'Engineering', value: 16 },
      { label: 'Design', value: 6 }
    ]
  }"
></div>
```

### Without grid rings

```html
<div
  class="aspect-square h-full"
  style="max-height: 20rem"
  x-h-chart-polar-area="{
    gridlines: false,
    axes: false,
    slices: [
      { label: 'Sales', value: 14 },
      { label: 'Marketing', value: 8 },
      { label: 'Support', value: 11 },
      { label: 'Engineering', value: 16 },
      { label: 'Design', value: 6 }
    ]
  }"
></div>
```

Full docs: https://www.codbex.com/harmonia/charts/polar-area.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
