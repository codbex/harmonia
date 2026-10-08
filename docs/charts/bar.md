# Bar Chart

`x-h-chart-bar` draws a bar chart from a single reactive configuration object. Bars can be oriented as columns or rows, grouped, or stacked. Charts inherit the active theme colors and adapt to light and dark mode automatically.

## Usage

Give the chart a container with an explicit height (charts fill their parent). Provide one or more `series`, each a list of numeric `data` points, and a matching `labels` array naming the categories. Use multiple series to compare values side by side (grouped) or as parts of a total (`stacked`). Use a bar chart to compare discrete categories. For trends over an ordered sequence use a [Line Chart](/charts/line), and for parts of a whole use a [Pie Chart](/charts/pie).

## API Reference

### Component attribute(s)

```
x-h-chart-bar
```

### Attributes

| Attribute      | Type                                 | Required | Description                                                                                       |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| data-font-size | `xs`<br />`sm`<br />`base`<br />`lg` | false    | Changes the size of all chart text, such as labels, axis ticks, and the legend. Defaults to `xs`. |

### Configuration

| Key           | Type                                  | Default                | Description                                                                                              |
| ------------- | ------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| `series`      | `{ name?, color?, data: number[] }[]` | `[]`                   | One entry per series. Multiple series render as grouped bars. For `color` values, see [Colors](#colors). |
| `labels`      | string[]                              | `[]`                   | Category label for each data index.                                                                      |
| `orientation` | `'vertical'` \| `'horizontal'`        | `'vertical'`           | `vertical` draws columns, `horizontal` draws rows.                                                       |
| `stacked`     | boolean                               | `false`                | Stack series on top of one another instead of grouping them.                                             |
| `legend`      | boolean                               | `true`                 | Show the color/label key.                                                                                |
| `axes`        | boolean                               | `true`                 | Show the numeric axis ticks and category labels.                                                         |
| `gridlines`   | boolean                               | `true`                 | Show gridlines behind the bars.                                                                          |
| `tooltip`     | boolean                               | `true`                 | Show a tooltip on hover and emit interaction events.                                                     |
| `dataLabels`  | boolean                               | `false`                | Draw each bar's value on the bar.                                                                        |
| `tickCount`   | number                                | `5`                    | Target number of numeric axis ticks.                                                                     |
| `valueFormat` | `(value) => string`                   | locale number          | Formats values in tooltips and numeric axis ticks.                                                       |
| `palette`     | string[]                              | `color-1` to `color-9` | Chart colors cycled for series without an explicit `color`. See [Colors](#colors) for more information.  |
| `seriesLabel` | string                                | `Series {index}`       | Template naming a series that has no `name`. `{index}` is substituted.                                   |
| `tableLabels` | `{ category? }`                       | English defaults       | Column headers of the hidden data table read by screen readers.                                          |

#### Colors

A series `color` (and the `palette` entries) is one of the chart colors `color-1` to `color-12`. They paint with the theme's `--chart-color-1` to `--chart-color-12` variables (see [Theme Customization](/custom-themes#colors)). By default, they map to blue, red, green, orange, purple, teal, pink, indigo, yellow, gray, white and black. The standard color names (`red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`, `white` and `black`) are deprecated. They still work but they will be removed in the next major version.

### Accessibility

The chart is exposed to assistive technologies as a `figure` with a visually-hidden data table of its values, so screen-reader users get the underlying numbers (the visual bars, axes, and legend are marked decorative). It defaults to the accessible name "Bar chart". Set an `aria-label` attribute on the element to give it a more meaningful name.

### Events

When `tooltip` is enabled, hovering and clicking bars emit bubbling `CustomEvent`s on the chart element - `chart-hover`, `chart-leave`, and `chart-click`. See [the events reference](/charts/pie#events) for the shared `detail` shape.

### Data Slots

| Slot                  | Element                                   |
| --------------------- | ----------------------------------------- |
| `chart`               | `x-h-chart-bar`                           |
| `chart-svg`           | The chart drawing                         |
| `chart-plot`          | The plot area                             |
| `chart-bar`           | A bar                                     |
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
<div style="height: 20rem" x-h-chart-bar="{ labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

</LiveExample>

### Grouped

<LiveExample>

```html
<div
  style="height: 20rem"
  x-h-chart-bar="{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Revenue', data: [12, 19, 7, 15] },
      { name: 'Cost', data: [8, 11, 5, 9] }
    ]
  }"
></div>
```

</LiveExample>

### Stacked

<LiveExample>

```html
<div
  style="height: 20rem"
  x-h-chart-bar="{
    stacked: true,
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Revenue', data: [12, 19, 7, 15] },
      { name: 'Cost', data: [8, 11, 5, 9] }
    ]
  }"
></div>
```

</LiveExample>

### Horizontal

<LiveExample>

```html
<div style="height: 20rem" x-h-chart-bar="{ orientation: 'horizontal', labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

</LiveExample>

### Value labels

<LiveExample>

```html
<div style="height: 20rem" x-h-chart-bar="{ dataLabels: true, labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

</LiveExample>

### Custom colors

The chart colors are theme variables, so one chart (or any ancestor) can override them with an inline style. Here the first series follows the theme's primary color and the second gets a custom one.

<LiveExample data-exclude="generator">

```html
<div
  style="height: 20rem; --chart-color-1: var(--primary); --chart-color-2: oklch(0.75 0.15 70)"
  x-h-chart-bar="{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Revenue', data: [12, 19, 7, 15] },
      { name: 'Cost', data: [8, 11, 5, 9] }
    ]
  }"
></div>
```

</LiveExample>

### Handling events

<LiveExample data-exclude="generator">

```html
<div class="vbox items-center gap-2" x-data="{ lastClicked: 'Click on a bar' }">
  <span x-text="lastClicked"></span>
  <div style="height: 18rem" x-h-chart-bar="{ labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }" @chart-click="lastClicked = $event.detail.label + ': ' + $event.detail.value"></div>
</div>
```

</LiveExample>
