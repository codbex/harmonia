# Bar Chart

`x-h-chart-bar` draws a bar chart from a single reactive configuration object. Bars can be oriented as columns or rows, grouped, or stacked. Charts inherit the active theme colors and adapt to light and dark mode automatically.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Give the chart a container with an explicit height (charts fill their parent). Provide one or more `series`, each a list of numeric `data` points, and a matching `labels` array naming the categories. Use multiple series to compare values side by side (grouped) or as parts of a total (`stacked`). Use a bar chart to compare discrete categories. For trends over an ordered sequence use a Line Chart, and for parts of a whole use a Pie Chart.

## Directive

- `x-h-chart-bar`

## API

### Attributes

| Attribute      | Type                                 | Required | Description                                                                                       |
| -------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| data-font-size | `xs`<br />`sm`<br />`base`<br />`lg` | false    | Changes the size of all chart text, such as labels, axis ticks, and the legend. Defaults to `xs`. |

### Configuration

| Key           | Type                                  | Default                | Description                                                                                              |
| ------------- | ------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| `series`      | `{ name?, color?, data: number[] }[]` | `[]`                   | One entry per series. Multiple series render as grouped bars. For `color` values, see Colors. |
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
| `palette`     | string[]                              | `color-1` to `color-9` | Chart colors cycled for series without an explicit `color`. See Colors for more information.  |
| `seriesLabel` | string                                | `Series {index}`       | Template naming a series that has no `name`. `{index}` is substituted.                                   |
| `tableLabels` | `{ category? }`                       | English defaults       | Column headers of the hidden data table read by screen readers.                                          |

#### Colors

A series `color` (and the `palette` entries) is one of the chart colors `color-1` to `color-12`. They paint with the theme's `--chart-color-1` to `--chart-color-12` variables (see Theme Customization). By default, they map to blue, red, green, orange, purple, teal, pink, indigo, yellow, gray, white and black. The standard color names (`red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`, `white` and `black`) are deprecated. They still work but they will be removed in the next major version.

### Accessibility

The chart is exposed to assistive technologies as a `figure` with a visually-hidden data table of its values, so screen-reader users get the underlying numbers (the visual bars, axes, and legend are marked decorative). It defaults to the accessible name "Bar chart". Set an `aria-label` attribute on the element to give it a more meaningful name.

### Events

When `tooltip` is enabled, hovering and clicking bars emit bubbling `CustomEvent`s on the chart element - `chart-hover`, `chart-leave`, and `chart-click`. See the events reference for the shared `detail` shape.

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

```html
<div style="height: 20rem" x-h-chart-bar="{ labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

### Grouped

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

### Stacked

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

### Horizontal

```html
<div style="height: 20rem" x-h-chart-bar="{ orientation: 'horizontal', labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

### Value labels

```html
<div style="height: 20rem" x-h-chart-bar="{ dataLabels: true, labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

### Custom colors

The chart colors are theme variables, so one chart (or any ancestor) can override them with an inline style. Here the first series follows the theme's primary color and the second gets a custom one.

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

### Handling events

```html
<div class="vbox items-center gap-2" x-data="{ lastClicked: 'Click on a bar' }">
  <span x-text="lastClicked"></span>
  <div style="height: 18rem" x-h-chart-bar="{ labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }" @chart-click="lastClicked = $event.detail.label + ': ' + $event.detail.value"></div>
</div>
```

Full docs: https://www.codbex.com/harmonia/charts/bar.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
