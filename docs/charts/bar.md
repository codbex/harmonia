# Bar Chart

`x-h-chart-bar` draws a bar chart from a single reactive configuration object. Bars can be oriented as columns or rows, grouped, or stacked. Charts inherit the active theme colors and adapt to light and dark mode automatically.

## Usage

Give the chart a container with an explicit height (charts fill their parent). Provide one or more `series`, each a list of numeric `data` points, and a matching `labels` array naming the categories. Use multiple series to compare values side by side (grouped) or as parts of a total (`stacked`). Use a bar chart to compare discrete categories; for trends over an ordered sequence use a [Line Chart](/charts/line), and for parts of a whole use a [Pie Chart](/charts/pie).

## API Reference

### Component attribute(s)

```
x-h-chart-bar
```

### Configuration

| Key           | Type                                  | Default       | Description                                                   |
| ------------- | ------------------------------------- | ------------- | ------------------------------------------------------------- |
| `series`      | `{ name?, color?, data: number[] }[]` | `[]`          | One entry per series. Multiple series render as grouped bars. |
| `labels`      | string[]                              | `[]`          | Category label for each data index.                           |
| `orientation` | `'vertical'` \| `'horizontal'`        | `'vertical'`  | `vertical` draws columns, `horizontal` draws rows.            |
| `stacked`     | boolean                               | `false`       | Stack series on top of one another instead of grouping them.  |
| `legend`      | boolean                               | `true`        | Show the color/label key.                                     |
| `axes`        | boolean                               | `true`        | Show the numeric axis ticks and category labels.              |
| `gridlines`   | boolean                               | `true`        | Show gridlines behind the bars.                               |
| `tooltip`     | boolean                               | `true`        | Show a tooltip on hover and emit interaction events.          |
| `dataLabels`  | boolean                               | `false`       | Draw each bar's value on the bar.                             |
| `tickCount`   | number                                | `5`           | Target number of numeric axis ticks.                          |
| `valueFormat` | `(value) => string`                   | locale number | Formats values in tooltips and numeric axis ticks.            |
| `palette`     | string[]                              | theme tokens  | Color tokens cycled for series without an explicit `color`.   |

A series `color` (and the `palette` entries) is one of the standard color names: `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`, `white`, or `black`.

### Accessibility

The chart is exposed to assistive technologies as a `figure` with a visually-hidden data table of its values, so screen-reader users get the underlying numbers (the visual bars, axes, and legend are marked decorative). It defaults to the accessible name "Bar chart". Set an `aria-label` attribute on the element to give it a more meaningful name.

### Events

When `tooltip` is enabled, hovering and clicking bars emit bubbling `CustomEvent`s on the chart element: `chart-hover`, `chart-leave`, and `chart-click`. See [the events reference](/charts/pie#events) for the shared `detail` shape.

## Examples

### Basic

<ClientOnly>
<component-container>
<div style="height: 20rem" x-h-chart-bar="{ labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
</component-container>
</ClientOnly>

```html
<div style="height: 20rem" x-h-chart-bar="{ labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

### Grouped

<ClientOnly>
<component-container>
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
</component-container>
</ClientOnly>

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

<ClientOnly>
<component-container>
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
</component-container>
</ClientOnly>

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

<ClientOnly>
<component-container>
<div style="height: 20rem" x-h-chart-bar="{ orientation: 'horizontal', labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
</component-container>
</ClientOnly>

```html
<div style="height: 20rem" x-h-chart-bar="{ orientation: 'horizontal', labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

### Value labels

<ClientOnly>
<component-container>
<div style="height: 20rem" x-h-chart-bar="{ dataLabels: true, labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
</component-container>
</ClientOnly>

```html
<div style="height: 20rem" x-h-chart-bar="{ dataLabels: true, labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [{ name: 'Revenue', data: [12, 19, 7, 15] }] }"></div>
```

### Handling events

<ClientOnly>
<component-container src="/components/charts/bar-event.html">
</component-container>
</ClientOnly>

<<< @/public/components/charts/bar-event.html
