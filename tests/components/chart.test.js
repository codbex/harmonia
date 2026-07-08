import { beforeEach, describe, expect, it, vi } from 'vitest';

import chartPlugin from '../../src/components/chart.js';
import { mountDirective } from '../test-utils.js';

// Charts lay out in pixel coordinates measured from the root element, so give
// the host a deterministic size (happy-dom reports zero rects).
function makeEl() {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({ width: 600, height: 400, top: 0, left: 0, right: 600, bottom: 400, x: 0, y: 0 });
  document.body.appendChild(el);
  return el;
}

// Mount a chart directive with the given config object injected as the reactive expression.
function mount(directive, config, el) {
  const overrides = config === undefined ? {} : { evaluateLater: () => (cb) => cb(config) };
  return mountDirective(chartPlugin, directive, el, { original: directive, expression: config === undefined ? '' : 'cfg' }, overrides);
}

const slot = (el, name) => el.querySelectorAll(`[data-slot="${name}"]`);
const texts = (el) => Array.from(el.querySelectorAll('text')).map((t) => t.textContent);
const attr = (node, name) => Number(node.getAttribute(name));

describe('chart directives', () => {
  let el;

  beforeEach(() => {
    el = makeEl();
  });

  it('registers all chart directives', () => {
    const { alpine } = mount('h-chart-bar', undefined, el);
    expect(alpine._directives['h-chart-bar']).toBeDefined();
    expect(alpine._directives['h-chart-line']).toBeDefined();
    expect(alpine._directives['h-chart-scatter']).toBeDefined();
    expect(alpine._directives['h-chart-pie']).toBeDefined();
    expect(alpine._directives['h-chart-doughnut']).toBeDefined();
    expect(alpine._directives['h-chart-polar-area']).toBeDefined();
    expect(alpine._directives['h-chart-radar']).toBeDefined();
  });

  it('sets host classes, data-slot, a tooltip element, and one SVG canvas', () => {
    mount('h-chart-bar', { series: [{ data: [1] }] }, el);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('chart');
    expect(slot(el, 'chart-tooltip').length).toBe(1);
    const svg = slot(el, 'chart-svg')[0];
    expect(svg).toBeTruthy();
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(attr(svg, 'width')).toBe(600);
    expect(attr(svg, 'height')).toBe(400);
  });

  it('calls cleanup', () => {
    const { ctx } = mount('h-chart-bar', { series: [{ data: [1] }] }, el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  describe('bar', () => {
    it('renders one bar per data point with the palette color', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ name: 'S1', data: [10, 20] }] }, el);
      const bars = slot(el, 'chart-bar');
      expect(bars.length).toBe(2);
      expect(bars[0].tagName.toLowerCase()).toBe('rect');
      expect(bars[0].classList.contains('fill-blue-500')).toBe(true);
      // Taller value, taller bar; both end on the shared baseline.
      expect(attr(bars[0], 'height')).toBeLessThan(attr(bars[1], 'height'));
      expect(attr(bars[0], 'y') + attr(bars[0], 'height')).toBeCloseTo(attr(bars[1], 'y') + attr(bars[1], 'height'), 1);
    });

    it('renders grouped bars for multiple series with distinct colors', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ data: [10, 20] }, { data: [5, 8] }] }, el);
      const bars = slot(el, 'chart-bar');
      expect(bars.length).toBe(4);
      expect(bars[0].classList.contains('fill-blue-500')).toBe(true);
      expect(bars[1].classList.contains('fill-red-500')).toBe(true);
      // Grouped bars are fully rounded rects.
      expect(attr(bars[0], 'rx')).toBeGreaterThan(0);
    });

    it('rounds only the outer ends of a stacked bar', () => {
      mount('h-chart-bar', { stacked: true, labels: ['A'], series: [{ data: [10] }, { data: [5] }, { data: [5] }] }, el);
      const [bottom, middle, top] = slot(el, 'chart-bar');
      expect(bottom.tagName.toLowerCase()).toBe('path');
      expect(bottom.getAttribute('d')).toContain('A ');
      expect(middle.getAttribute('d')).not.toContain('A ');
      expect(top.getAttribute('d')).toContain('A ');
    });

    it('lays bars out along the x-axis when horizontal', () => {
      mount('h-chart-bar', { orientation: 'horizontal', labels: ['A', 'B'], series: [{ data: [10, 20] }] }, el);
      const bars = slot(el, 'chart-bar');
      // Bars share the baseline x and grow in width with the value.
      expect(attr(bars[0], 'x')).toBeCloseTo(attr(bars[1], 'x'), 1);
      expect(attr(bars[0], 'width')).toBeLessThan(attr(bars[1], 'width'));
      expect(attr(bars[0], 'height')).toBeCloseTo(attr(bars[1], 'height'), 1);
    });

    it('renders category labels and gridlines', () => {
      mount('h-chart-bar', { labels: ['Jan', 'Feb'], series: [{ data: [10, 20] }] }, el);
      const plot = slot(el, 'chart-plot')[0];
      expect(plot.querySelectorAll('line.stroke-border\\/50').length).toBeGreaterThan(0);
      expect(texts(el)).toContain('Jan');
      expect(texts(el)).toContain('Feb');
    });

    it('keeps a bar per category for negative values', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ data: [-10, 20] }] }, el);
      expect(slot(el, 'chart-bar').length).toBe(2);
    });

    it('shows "No data" for empty series', () => {
      mount('h-chart-bar', { series: [] }, el);
      expect(slot(el, 'chart-empty').length).toBe(1);
      expect(slot(el, 'chart-bar').length).toBe(0);
      expect(slot(el, 'chart-svg').length).toBe(0);
    });
  });

  describe('line', () => {
    it('renders one point per value and one polyline per series', () => {
      mount('h-chart-line', { series: [{ data: [1, 2, 3] }] }, el);
      expect(slot(el, 'chart-point').length).toBe(3);
      const segments = slot(el, 'chart-segment');
      expect(segments.length).toBe(1);
      expect(segments[0].tagName.toLowerCase()).toBe('polyline');
      expect(segments[0].getAttribute('points').split(' ').length).toBe(3);
      expect(segments[0].classList.contains('stroke-blue-500')).toBe(true);
      expect(segments[0].classList.contains('fill-none')).toBe(true);
    });

    it('centers a single point and draws no segments', () => {
      mount('h-chart-line', { series: [{ data: [5] }] }, el);
      const points = slot(el, 'chart-point');
      expect(points.length).toBe(1);
      expect(slot(el, 'chart-segment').length).toBe(0);
      const svg = slot(el, 'chart-svg')[0];
      // Centered within the plot, right of the numeric gutter.
      expect(attr(points[0], 'cx')).toBeGreaterThan(attr(svg, 'width') / 2 - 30);
      expect(attr(points[0], 'cx')).toBeLessThan(attr(svg, 'width') / 2 + 30);
    });

    it('overlays multiple series', () => {
      mount('h-chart-line', { series: [{ data: [1, 2] }, { data: [3, 4] }] }, el);
      expect(slot(el, 'chart-point').length).toBe(4);
      expect(slot(el, 'chart-segment').length).toBe(2);
    });
  });

  describe('scatter', () => {
    it('draws points but no connecting segments', () => {
      mount('h-chart-scatter', { series: [{ data: [1, 2, 3] }] }, el);
      expect(slot(el, 'chart-point').length).toBe(3);
      expect(slot(el, 'chart-segment').length).toBe(0);
    });

    it('plots every point across multiple series', () => {
      mount('h-chart-scatter', { series: [{ data: [1, 2] }, { data: [3, 4] }] }, el);
      expect(slot(el, 'chart-point').length).toBe(4);
      expect(slot(el, 'chart-segment').length).toBe(0);
    });
  });

  describe('pie', () => {
    const slices = [
      { label: 'A', value: 30 },
      { label: 'B', value: 70 },
    ];

    it('renders one wedge path per slice with the palette color', () => {
      mount('h-chart-pie', { slices }, el);
      const wedges = slot(el, 'chart-pie');
      expect(wedges.length).toBe(2);
      expect(wedges[0].tagName.toLowerCase()).toBe('path');
      expect(wedges[0].getAttribute('d')).toContain('A ');
      expect(wedges[0].classList.contains('fill-blue-500')).toBe(true);
      expect(wedges[1].classList.contains('fill-red-500')).toBe(true);
      expect(slot(el, 'chart-legend-swatch').length).toBe(2);
    });

    it('ignores non-positive slices', () => {
      mount(
        'h-chart-pie',
        {
          slices: [
            { label: 'A', value: 30 },
            { label: 'B', value: 0 },
          ],
        },
        el
      );
      expect(slot(el, 'chart-pie').length).toBe(1);
      expect(slot(el, 'chart-legend-swatch').length).toBe(1);
    });

    it('draws a full circle for a single slice', () => {
      mount('h-chart-pie', { slices: [{ label: 'A', value: 1 }] }, el);
      const d = slot(el, 'chart-pie')[0].getAttribute('d');
      expect((d.match(/A /g) || []).length).toBe(2);
    });

    it('has no axes or gridlines', () => {
      mount('h-chart-pie', { slices: [{ label: 'A', value: 1 }] }, el);
      expect(slot(el, 'chart-plot').length).toBe(0);
    });

    it('shows a percentage label on each slice by default', () => {
      mount('h-chart-pie', { slices }, el);
      expect(Array.from(slot(el, 'chart-label')).map((l) => l.textContent)).toEqual(['30%', '70%']);
    });

    it('omits slice labels when dataLabels is false', () => {
      mount('h-chart-pie', { dataLabels: false, slices }, el);
      expect(slot(el, 'chart-label').length).toBe(0);
    });

    it('places labels outside the slices when labelPosition is outside', () => {
      mount(
        'h-chart-pie',
        {
          labelPosition: 'outside',
          slices: [
            { label: 'A', value: 50 },
            { label: 'B', value: 50 },
          ],
        },
        el
      );
      const labels = slot(el, 'chart-label');
      expect(labels.length).toBe(2);
      // Outside labels sit on the background, so they use the foreground color, not white-on-slice.
      expect(labels[0].classList.contains('fill-foreground')).toBe(true);
      expect(labels[0].classList.contains('fill-white')).toBe(false);
    });

    it('skips labels on slices smaller than 5%', () => {
      mount(
        'h-chart-pie',
        {
          slices: [
            { label: 'A', value: 97 },
            { label: 'B', value: 3 },
          ],
        },
        el
      );
      expect(Array.from(slot(el, 'chart-label')).map((l) => l.textContent)).toEqual(['97%']);
    });
  });

  describe('doughnut', () => {
    const slices = [
      { label: 'A', value: 30 },
      { label: 'B', value: 70 },
    ];

    // The radii of the arcs in a wedge path, outer first.
    const arcRadii = (d) => Array.from(d.matchAll(/A ([\d.]+)/g)).map((m) => Number(m[1]));

    it('renders wedges with an inner arc instead of a mask', () => {
      mount('h-chart-doughnut', { slices }, el);
      const radii = arcRadii(slot(el, 'chart-pie')[0].getAttribute('d'));
      expect(radii.length).toBe(2);
      expect(radii[1] / radii[0]).toBeCloseTo(0.6, 2);
    });

    it('honors a custom cutout', () => {
      mount('h-chart-doughnut', { cutout: 0.4, slices }, el);
      const radii = arcRadii(slot(el, 'chart-pie')[0].getAttribute('d'));
      expect(radii[1] / radii[0]).toBeCloseTo(0.4, 2);
    });

    it('leaves the pie chart solid (no inner arc)', () => {
      mount('h-chart-pie', { slices }, el);
      const radii = arcRadii(slot(el, 'chart-pie')[0].getAttribute('d'));
      expect(radii.length).toBe(1);
    });
  });

  describe('polar area', () => {
    const slices = [
      { label: 'A', value: 25 },
      { label: 'B', value: 100 },
    ];

    const wedgeRadius = (wedge) => Number(wedge.getAttribute('d').match(/A ([\d.]+)/)[1]);

    it('renders a translucent wedge per slice, sized by value', () => {
      mount('h-chart-polar-area', { slices }, el);
      const wedges = slot(el, 'chart-polar-slice');
      expect(wedges.length).toBe(2);
      expect(wedges[0].tagName.toLowerCase()).toBe('path');
      expect(wedges[0].getAttribute('opacity')).toBe('0.75');
      expect(wedgeRadius(wedges[0])).toBeLessThan(wedgeRadius(wedges[1]));
    });

    it('draws concentric grid rings and tick labels', () => {
      mount('h-chart-polar-area', { slices }, el);
      const rings = slot(el, 'chart-ring');
      expect(rings.length).toBeGreaterThan(0);
      expect(rings[0].tagName.toLowerCase()).toBe('circle');
      expect(rings[0].classList.contains('stroke-border/50')).toBe(true);
      expect(rings[0].classList.contains('fill-none')).toBe(true);
      expect(slot(el, 'chart-tick').length).toBeGreaterThan(0);
    });

    it('omits rings and ticks when gridlines and axes are false', () => {
      mount('h-chart-polar-area', { gridlines: false, axes: false, slices }, el);
      expect(slot(el, 'chart-ring').length).toBe(0);
      expect(slot(el, 'chart-tick').length).toBe(0);
    });

    it('labels large slices with their value and skips small ones', () => {
      mount(
        'h-chart-polar-area',
        {
          slices: [
            { label: 'A', value: 10 },
            { label: 'B', value: 100 },
          ],
        },
        el
      );
      expect(Array.from(slot(el, 'chart-label')).map((l) => l.textContent)).toEqual(['100']);
    });

    it('omits value labels when dataLabels is false', () => {
      mount('h-chart-polar-area', { dataLabels: false, slices }, el);
      expect(slot(el, 'chart-label').length).toBe(0);
    });

    it('ignores non-positive slices and shows a legend swatch per slice', () => {
      mount('h-chart-polar-area', { slices: [...slices, { label: 'C', value: 0 }] }, el);
      expect(slot(el, 'chart-polar-slice').length).toBe(2);
      expect(slot(el, 'chart-legend-swatch').length).toBe(2);
    });

    it('shows "No data" when every slice is non-positive', () => {
      mount('h-chart-polar-area', { slices: [{ label: 'A', value: 0 }] }, el);
      expect(slot(el, 'chart-empty').length).toBe(1);
    });

    it('fires chart-click for a clicked slice', () => {
      const spy = vi.fn();
      el.addEventListener('chart-click', spy);
      mount('h-chart-polar-area', { slices: [{ label: 'A', value: 30 }] }, el);
      slot(el, 'chart-polar-slice')[0].dispatchEvent(new Event('click'));
      expect(spy.mock.calls[0][0].detail).toMatchObject({ type: 'slice', label: 'A', value: 30 });
    });
  });

  describe('radar', () => {
    const cfg = { labels: ['Speed', 'Power', 'Range'], series: [{ name: 'S1', data: [10, 20, 30] }] };

    it('renders a dot per value and a closed outline polygon', () => {
      mount('h-chart-radar', cfg, el);
      expect(slot(el, 'chart-point').length).toBe(3);
      const outline = slot(el, 'chart-segment');
      expect(outline.length).toBe(1);
      expect(outline[0].tagName.toLowerCase()).toBe('polygon');
      expect(outline[0].getAttribute('points').split(' ').length).toBe(3);
      expect(outline[0].classList.contains('fill-none')).toBe(true);
    });

    it('fills the series area with a translucent polygon', () => {
      mount('h-chart-radar', cfg, el);
      const fill = slot(el, 'chart-area')[0];
      expect(fill.tagName.toLowerCase()).toBe('polygon');
      expect(fill.getAttribute('opacity')).toBe('0.2');
      expect(fill.classList.contains('fill-blue-500')).toBe(true);
    });

    it('draws a spoke per category and a web ring per tick', () => {
      mount('h-chart-radar', cfg, el);
      expect(slot(el, 'chart-spoke').length).toBe(3);
      const rings = slot(el, 'chart-ring');
      expect(rings.length).toBeGreaterThan(0);
      expect(rings[0].tagName.toLowerCase()).toBe('polygon');
      expect(rings[0].getAttribute('points').split(' ').length).toBe(3);
    });

    it('omits the web and ticks when gridlines and axes are false', () => {
      mount('h-chart-radar', { ...cfg, gridlines: false, axes: false }, el);
      expect(slot(el, 'chart-spoke').length).toBe(0);
      expect(slot(el, 'chart-ring').length).toBe(0);
      expect(slot(el, 'chart-tick').length).toBe(0);
    });

    it('renders the category labels around the web', () => {
      mount('h-chart-radar', cfg, el);
      expect(texts(el)).toContain('Speed');
      expect(texts(el)).toContain('Power');
      expect(texts(el)).toContain('Range');
    });

    it('overlays multiple series with distinct colors', () => {
      mount('h-chart-radar', { labels: ['A', 'B', 'C'], series: [{ data: [1, 2, 3] }, { data: [3, 2, 1] }] }, el);
      expect(slot(el, 'chart-point').length).toBe(6);
      expect(slot(el, 'chart-area').length).toBe(2);
      expect(slot(el, 'chart-area')[1].classList.contains('fill-red-500')).toBe(true);
      expect(slot(el, 'chart-legend-swatch').length).toBe(2);
    });

    it('labels each point when dataLabels is enabled', () => {
      mount('h-chart-radar', { ...cfg, dataLabels: true }, el);
      expect(Array.from(slot(el, 'chart-label')).map((l) => l.textContent)).toEqual(['10', '20', '30']);
    });

    it('fires chart-hover with the point payload', () => {
      const spy = vi.fn();
      el.addEventListener('chart-hover', spy);
      mount('h-chart-radar', cfg, el);
      slot(el, 'chart-point')[1].dispatchEvent(new Event('pointerenter'));
      expect(spy.mock.calls[0][0].detail).toMatchObject({ type: 'point', value: 20, label: 'Power', color: 'blue' });
    });

    it('shows "No data" for empty series', () => {
      mount('h-chart-radar', { series: [] }, el);
      expect(slot(el, 'chart-empty').length).toBe(1);
      expect(slot(el, 'chart-point').length).toBe(0);
    });
  });

  describe('data labels', () => {
    it('are off by default for bar and on with dataLabels', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ data: [10, 20] }] }, el);
      expect(slot(el, 'chart-label').length).toBe(0);

      const el2 = makeEl();
      mount('h-chart-bar', { dataLabels: true, labels: ['A', 'B'], series: [{ data: [10, 20] }] }, el2);
      expect(Array.from(slot(el2, 'chart-label')).map((l) => l.textContent)).toEqual(['10', '20']);
    });

    it('label each point on a line when enabled', () => {
      mount('h-chart-line', { dataLabels: true, series: [{ data: [1, 2, 3] }] }, el);
      expect(Array.from(slot(el, 'chart-label')).map((l) => l.textContent)).toEqual(['1', '2', '3']);
    });
  });

  describe('font size', () => {
    it('gives the SVG the xs text class by default', () => {
      mount('h-chart-bar', { series: [{ data: [1] }] }, el);
      expect(slot(el, 'chart-svg')[0].classList.contains('text-xs')).toBe(true);
    });

    it.each([
      ['xs', 'text-xs'],
      ['sm', 'text-sm'],
      ['base', 'text-base'],
      ['lg', 'text-lg'],
    ])('maps data-font-size="%s" to the %s class', (preset, cls) => {
      el.setAttribute('data-font-size', preset);
      mount('h-chart-pie', { slices: [{ label: 'A', value: 1 }] }, el);
      expect(slot(el, 'chart-svg')[0].classList.contains(cls)).toBe(true);
    });

    it('falls back to xs for an unknown preset', () => {
      el.setAttribute('data-font-size', 'huge');
      mount('h-chart-radar', { labels: ['A', 'B', 'C'], series: [{ data: [1, 2, 3] }] }, el);
      expect(slot(el, 'chart-svg')[0].classList.contains('text-xs')).toBe(true);
    });

    it('does not leave the measuring probe in the chart', () => {
      mount('h-chart-bar', { series: [{ data: [1] }] }, el);
      expect(el.querySelectorAll('span').length).toBe(0);
    });
  });

  describe('legend', () => {
    it('is shown by default with a swatch per series', () => {
      mount('h-chart-bar', { series: [{ data: [1] }, { data: [2] }] }, el);
      expect(slot(el, 'chart-legend').length).toBe(1);
      expect(slot(el, 'chart-legend-swatch').length).toBe(2);
    });

    it('is omitted when legend is false', () => {
      mount('h-chart-bar', { legend: false, series: [{ data: [1] }] }, el);
      expect(slot(el, 'chart-legend').length).toBe(0);
    });
  });

  describe('interaction', () => {
    it('fires chart-hover with the data payload and reveals the tooltip', () => {
      const spy = vi.fn();
      el.addEventListener('chart-hover', spy);
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ name: 'S1', data: [10, 20] }] }, el);
      const bar = slot(el, 'chart-bar')[0];
      bar.dispatchEvent(new Event('pointerenter'));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail).toMatchObject({ type: 'bar', value: 10, label: 'A', color: 'blue' });
      expect(slot(el, 'chart-tooltip')[0].classList.contains('hidden')).toBe(false);
    });

    it('fires chart-click for a clicked pie slice', () => {
      const spy = vi.fn();
      el.addEventListener('chart-click', spy);
      mount('h-chart-pie', { slices: [{ label: 'A', value: 30 }] }, el);
      slot(el, 'chart-pie')[0].dispatchEvent(new Event('click'));
      expect(spy.mock.calls[0][0].detail).toMatchObject({ type: 'slice', label: 'A', value: 30 });
    });

    it('pins the tooltip on click and keeps it through pointerleave', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ name: 'S1', data: [10, 20] }] }, el);
      const bar = slot(el, 'chart-bar')[0];
      const tip = slot(el, 'chart-tooltip')[0];
      bar.dispatchEvent(new Event('click'));
      expect(tip.classList.contains('hidden')).toBe(false);
      bar.dispatchEvent(new Event('pointerleave'));
      expect(tip.classList.contains('hidden')).toBe(false);
    });

    it('dismisses a pinned tooltip on an outside press', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ name: 'S1', data: [10, 20] }] }, el);
      const bar = slot(el, 'chart-bar')[0];
      const tip = slot(el, 'chart-tooltip')[0];
      bar.dispatchEvent(new Event('click'));
      expect(tip.classList.contains('hidden')).toBe(false);
      document.dispatchEvent(new Event('pointerdown'));
      expect(tip.classList.contains('hidden')).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('exposes the chart as a labeled figure', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ name: 'Revenue', data: [10, 20] }] }, el);
      expect(el.getAttribute('role')).toBe('figure');
      expect(el.getAttribute('aria-label')).toBe('Bar chart');
    });

    it('uses a type-specific default label and respects an author-set aria-label', () => {
      mount('h-chart-doughnut', { slices: [{ label: 'A', value: 1 }] }, el);
      expect(el.getAttribute('aria-label')).toBe('Doughnut chart');

      const el2 = makeEl();
      el2.setAttribute('aria-label', 'Traffic sources');
      mount('h-chart-pie', { slices: [{ label: 'A', value: 1 }] }, el2);
      expect(el2.getAttribute('aria-label')).toBe('Traffic sources');
    });

    it('hides the visual layer and tooltip from assistive tech', () => {
      mount('h-chart-bar', { labels: ['A'], series: [{ data: [1] }] }, el);
      expect(slot(el, 'chart-tooltip')[0].getAttribute('aria-hidden')).toBe('true');
      expect(slot(el, 'chart-svg')[0].getAttribute('aria-hidden')).toBe('true');
    });

    it('renders a hidden data table of the values (bar/line)', () => {
      mount('h-chart-bar', { labels: ['Jan', 'Feb'], series: [{ name: 'Revenue', data: [12, 19] }] }, el);
      const table = slot(el, 'chart-table')[0];
      expect(table).toBeTruthy();
      expect(table.classList.contains('sr-only')).toBe(true);
      expect(Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent)).toEqual(['Category', 'Revenue']);
      expect(Array.from(table.querySelectorAll('tbody tr')[0].children).map((c) => c.textContent)).toEqual(['Jan', '12']);
    });

    it('labels the radial charts and renders their data tables', () => {
      mount('h-chart-radar', { labels: ['A'], series: [{ name: 'S1', data: [5] }] }, el);
      expect(el.getAttribute('aria-label')).toBe('Radar chart');
      expect(Array.from(slot(el, 'chart-table')[0].querySelectorAll('thead th')).map((th) => th.textContent)).toEqual(['Category', 'S1']);

      const el2 = makeEl();
      mount('h-chart-polar-area', { slices: [{ label: 'A', value: 5 }] }, el2);
      expect(el2.getAttribute('aria-label')).toBe('Polar area chart');
      expect(Array.from(slot(el2, 'chart-table')[0].querySelectorAll('thead th')).map((th) => th.textContent)).toEqual(['Segment', 'Value']);
    });

    it('renders a segment/value table for pie', () => {
      mount(
        'h-chart-pie',
        {
          slices: [
            { label: 'A', value: 30 },
            { label: 'B', value: 70 },
          ],
        },
        el
      );
      const table = slot(el, 'chart-table')[0];
      expect(Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent)).toEqual(['Segment', 'Value']);
      expect(table.querySelectorAll('tbody tr').length).toBe(2);
    });
  });
});
