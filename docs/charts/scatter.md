# Scatter Chart

`x-h-chart-scatter` draws a scatter chart from a single reactive configuration object. It is the same plot as a line chart, but with no connecting lines. Multiple series are overlaid on a shared axis. Charts inherit the active theme colors and adapt to light and dark mode automatically.

## Usage

Give the chart a container with an explicit height (charts fill their parent). Provide one or more `series`, each a list of numeric `data` points, and a matching `labels` array naming the points along the axis. Use a scatter chart to show individual data points without implying a connection between them. When a trend across an ordered sequence matters, use a [Line Chart](/charts/line).

## API Reference

### Component attribute(s)

```
x-h-chart-scatter
```

### Attributes

| Attribute      | Type                                 | Required | Description                                                                                       |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| data-font-size | `xs`<br />`sm`<br />`base`<br />`lg` | false    | Changes the size of all chart text, such as labels, axis ticks, and the legend. Defaults to `xs`. |

### Configuration

| Key           | Type                                  | Default                | Description                                                                                             |
| ------------- | ------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `series`      | `{ name?, color?, data: number[] }[]` | `[]`                   | One entry per series. Multiple series are overlaid. For `color` values, see [Colors](#colors).          |
| `labels`      | string[]                              | `[]`                   | Label for each data index.                                                                              |
| `legend`      | boolean                               | `true`                 | Show the color/label key.                                                                               |
| `axes`        | boolean                               | `true`                 | Show the numeric axis ticks and labels.                                                                 |
| `gridlines`   | boolean                               | `true`                 | Show gridlines behind the points.                                                                       |
| `tooltip`     | boolean                               | `true`                 | Show a tooltip on hover and emit interaction events.                                                    |
| `dataLabels`  | boolean                               | `false`                | Draw each point's value next to it.                                                                     |
| `tickCount`   | number                                | `5`                    | Target number of numeric axis ticks.                                                                    |
| `valueFormat` | `(value) => string`                   | locale number          | Formats values in tooltips and numeric axis ticks.                                                      |
| `palette`     | string[]                              | `color-1` to `color-9` | Chart colors cycled for series without an explicit `color`. See [Colors](#colors) for more information. |
| `seriesLabel` | string                                | `Series {index}`       | Template naming a series that has no `name`. `{index}` is substituted.                                  |
| `tableLabels` | `{ category? }`                       | English defaults       | Column headers of the hidden data table read by screen readers.                                         |

#### Colors

A series `color` (and the `palette` entries) is one of the chart colors `color-1` to `color-12`. They paint with the theme's `--chart-color-1` to `--chart-color-12` variables (see [Theme Customization](/custom-themes#colors)). By default, they map to blue, red, green, orange, purple, teal, pink, indigo, yellow, gray, white and black. The standard color names (`red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`, `white` and `black`) are deprecated. They still work but they will be removed in the next major version.

### Accessibility

The chart is exposed to assistive technologies as a `figure` with a visually-hidden data table of its values, so screen-reader users get the underlying numbers (the visual points, axes, and legend are marked decorative). It defaults to the accessible name "Scatter chart". Set an `aria-label` attribute on the element to give it a more meaningful name.

### Events

When `tooltip` is enabled, hovering and clicking points emit bubbling `CustomEvent`s on the chart element - `chart-hover`, `chart-leave`, and `chart-click`. See [the events reference](/charts/pie#events) for the shared `detail` shape.

### Data Slots

| Slot                  | Element                                   |
| --------------------- | ----------------------------------------- |
| `chart`               | `x-h-chart-scatter`                       |
| `chart-svg`           | The chart drawing                         |
| `chart-plot`          | The plot area                             |
| `chart-point`         | A data point                              |
| `chart-label`         | A value label                             |
| `chart-legend`        | The legend                                |
| `chart-legend-swatch` | A legend color swatch                     |
| `chart-tooltip`       | The hover tooltip                         |
| `chart-table`         | The data table for assistive technologies |
| `chart-empty`         | The message shown when there is no data   |

## Examples

### Basic

<LiveExample data-exclude="generator">

```html
<div style="height: 20rem" x-h-chart-scatter="{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], series: [{ name: 'Visitors', data: [120, 200, 150, 280, 240] }] }"></div>
```

</LiveExample>

### Multiple series

<LiveExample>

```html
<div
  style="height: 20rem"
  x-h-chart-scatter="{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    series: [
      { name: 'Visitors', data: [120, 200, 150, 280, 240] },
      { name: 'Signups', data: [40, 60, 55, 90, 80] }
    ]
  }"
></div>
```

</LiveExample>
