# Radar Chart

`x-h-chart-radar` draws a radar chart from a single reactive configuration object. Each category gets its own axis arranged around a center, and every series is drawn as a closed shape across those axes. Multiple series are overlaid. Charts inherit the active theme colors and adapt to light and dark mode automatically.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Give the chart a container with an explicit height (charts fill their parent). Provide one or more `series`, each a list of numeric `data` points, and a matching `labels` array naming the axes. Use a radar chart to compare several quantitative dimensions at once, for example skill profiles or feature scores. To show a trend across an ordered sequence use a Line Chart, and to compare discrete categories use a Bar Chart.

## Directive

- `x-h-chart-radar`

## API

### Configuration

| Key           | Type                                  | Default       | Description                                                 |
| ------------- | ------------------------------------- | ------------- | ----------------------------------------------------------- |
| `series`      | `{ name?, color?, data: number[] }[]` | `[]`          | One entry per shape. Multiple series are overlaid.          |
| `labels`      | string[]                              | `[]`          | Label for each axis around the chart.                       |
| `legend`      | boolean                               | `true`        | Show the color/label key.                                   |
| `axes`        | boolean                               | `true`        | Show the numeric tick labels along the vertical.            |
| `gridlines`   | boolean                               | `true`        | Show the spokes and the polygonal web rings.                |
| `tooltip`     | boolean                               | `true`        | Show a tooltip on hover and emit interaction events.        |
| `dataLabels`  | boolean                               | `false`       | Draw each point's value next to it.                         |
| `tickCount`   | number                                | `5`           | Target number of web rings.                                 |
| `valueFormat` | `(value) => string`                   | locale number | Formats values in tooltips and tick labels.                 |
| `palette`     | string[]                              | theme tokens  | Color tokens cycled for series without an explicit `color`. |

A series `color` (and the `palette` entries) is one of the standard color names: `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`, `white`, or `black`.

### Accessibility

The chart is exposed to assistive technologies as a `figure` with a visually-hidden data table of its values, so screen-reader users get the underlying numbers (the visual shapes, web, and legend are marked decorative). It defaults to the accessible name "Radar chart". Set an `aria-label` attribute on the element to give it a more meaningful name.

### Events

When `tooltip` is enabled, hovering and clicking points emit bubbling `CustomEvent`s on the chart element: `chart-hover`, `chart-leave`, and `chart-click`. See the events reference for the shared `detail` shape.

## Examples

### Basic

```html
<div
  class="aspect-square h-full"
  style="max-height: 20rem"
  x-h-chart-radar="{
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
    series: [{ name: 'Model A', data: [70, 90, 60, 85, 75] }]
  }"
></div>
```

### Multiple series

```html
<div
  class="aspect-square h-full"
  style="max-height: 20rem"
  x-h-chart-radar="{
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
    series: [
      { name: 'Model A', data: [70, 90, 60, 85, 75] },
      { name: 'Model B', data: [85, 65, 80, 70, 90] }
    ]
  }"
></div>
```

Full docs: https://www.codbex.com/harmonia/charts/radar.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
