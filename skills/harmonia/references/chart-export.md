# Chart Export

Utility functions for exporting a chart as an image. Charts are rendered as vector graphics, so the preferred export is a scalable SVG file that looks identical to the on-screen chart at any size. A raster export is also available for tools that require a bitmap.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Pass the element carrying the `x-h-chart-*` directive to `chartToSvg` to get standalone SVG markup with all theme colors baked in, or to `chartToImage` to get a PNG (or JPEG/WebP) data URL. The export captures the chart exactly as currently rendered, including the active light or dark theme colors.

> **Note:** Fonts
> Exported text renders with the fonts available on the viewing machine. Font files are not embedded, so when the page uses a web font, a viewer without that font sees the closest fallback from the font stack.

## API

### Functions

| Property     | Arguments   | Returns           | Description                                               |
| ------------ | ----------- | ----------------- | --------------------------------------------------------- |
| chartToSvg   | el, options | string            | Serializes the chart into standalone SVG markup.          |
| chartToImage | el, options | `Promise<string>` | Rasterizes the chart and resolves with an image data URL. |

### Options

| Key          | Type   | Default          | Description                                                                                  |
| ------------ | ------ | ---------------- | -------------------------------------------------------------------------------------------- |
| `background` | string | theme background | Color painted behind the chart. Pass `null` or `'transparent'` for a transparent export.     |
| `scale`      | number | `2`              | Pixel density multiplier of the raster image. Only used by `chartToImage`.                   |
| `type`       | string | `'image/png'`    | Raster format passed to the canvas, for example `'image/jpeg'`. Only used by `chartToImage`. |
| `quality`    | number | browser default  | Compression quality for lossy formats (`0`-`1`). Only used by `chartToImage`.                |

## Examples

### In plain JS

```js
const chart = document.getElementById('revenue-chart');

const svgMarkup = Harmonia.chartToSvg(chart);

const pngDataUrl = await Harmonia.chartToImage(chart, { scale: 3 });
```

### In a module

```js
import { chartToImage, chartToSvg } from '@codbex/harmonia';

const svgMarkup = chartToSvg(chart);
const pngDataUrl = await chartToImage(chart, { background: null });
```

### Download buttons

```html
<div
  class="vbox w-full items-start gap-4"
  x-data="{
    downloadSvg() {
      const markup = Harmonia.chartToSvg(this.$refs.chart);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
      link.download = 'revenue.svg';
      link.click();
      URL.revokeObjectURL(link.href);
    },
    async downloadPng() {
      const link = document.createElement('a');
      link.href = await Harmonia.chartToImage(this.$refs.chart);
      link.download = 'revenue.png';
      link.click();
    }
  }"
>
  <div x-ref="chart" class="w-full" style="height: 16rem" x-h-chart-bar="{ labels: ['Q1', 'Q2', 'Q3', 'Q4'], series: [{ name: 'Revenue', data: [12, 19, 14, 22] }] }"></div>
  <div class="hbox gap-2">
    <button x-h-button @click="downloadSvg">Download SVG</button>
    <button x-h-button data-variant="secondary" @click="downloadPng">Download PNG</button>
  </div>
</div>
```

Full docs: https://www.codbex.com/harmonia/utilities/chart-export.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
