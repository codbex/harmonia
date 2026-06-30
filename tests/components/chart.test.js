import { beforeEach, describe, expect, it, vi } from 'vitest';

import chartPlugin from '../../src/components/chart.js';
import { mountDirective } from '../test-utils.js';

function makeEl() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

// Mount a chart directive with the given config object injected as the reactive expression.
function mount(directive, config, el) {
  const overrides = config === undefined ? {} : { evaluateLater: () => (cb) => cb(config) };
  return mountDirective(chartPlugin, directive, el, { original: directive, expression: config === undefined ? '' : 'cfg' }, overrides);
}

const slot = (el, name) => el.querySelectorAll(`[data-slot="${name}"]`);

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
  });

  it('sets host classes, data-slot, and a tooltip element', () => {
    mount('h-chart-bar', { series: [{ data: [1] }] }, el);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('chart');
    expect(slot(el, 'chart-tooltip').length).toBe(1);
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
      expect(bars[0].classList.contains('bg-blue-500')).toBe(true);
      expect(bars[0].style.height).toMatch(/%$/);
      expect(bars[0].style.bottom).not.toBe('');
    });

    it('renders grouped bars for multiple series with distinct colors', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ data: [10, 20] }, { data: [5, 8] }] }, el);
      const bars = slot(el, 'chart-bar');
      expect(bars.length).toBe(4);
      expect(bars[0].classList.contains('bg-blue-500')).toBe(true);
      expect(bars[1].classList.contains('bg-red-500')).toBe(true);
      // Grouped bars are fully rounded.
      expect(bars[0].classList.contains('rounded-sm')).toBe(true);
    });

    it('rounds only the outer ends of a stacked bar', () => {
      mount('h-chart-bar', { stacked: true, labels: ['A'], series: [{ data: [10] }, { data: [5] }] }, el);
      const [bottom, top] = slot(el, 'chart-bar');
      expect(bottom.classList.contains('rounded-bl-sm')).toBe(true);
      expect(bottom.classList.contains('rounded-br-sm')).toBe(true);
      expect(bottom.classList.contains('rounded-tl-sm')).toBe(false);
      expect(top.classList.contains('rounded-tl-sm')).toBe(true);
      expect(top.classList.contains('rounded-tr-sm')).toBe(true);
      expect(top.classList.contains('rounded-bl-sm')).toBe(false);
    });

    it('lays bars out along the x-axis when horizontal', () => {
      mount('h-chart-bar', { orientation: 'horizontal', labels: ['A'], series: [{ data: [10] }] }, el);
      const bar = slot(el, 'chart-bar')[0];
      expect(bar.style.left).not.toBe('');
      expect(bar.style.bottom).toBe('');
    });

    it('renders category labels and gridlines', () => {
      mount('h-chart-bar', { labels: ['Jan', 'Feb'], series: [{ data: [10, 20] }] }, el);
      const plot = slot(el, 'chart-plot')[0];
      expect(plot.querySelectorAll('.border-t').length).toBeGreaterThan(0);
      const labels = Array.from(el.querySelectorAll('div')).map((d) => d.textContent.trim());
      expect(labels).toContain('Jan');
      expect(labels).toContain('Feb');
    });

    it('keeps a bar per category for negative values', () => {
      mount('h-chart-bar', { labels: ['A', 'B'], series: [{ data: [-10, 20] }] }, el);
      expect(slot(el, 'chart-bar').length).toBe(2);
    });

    it('shows "No data" for empty series', () => {
      mount('h-chart-bar', { series: [] }, el);
      expect(slot(el, 'chart-empty').length).toBe(1);
      expect(slot(el, 'chart-bar').length).toBe(0);
    });
  });

  describe('line', () => {
    it('renders one point per value and one segment between points', () => {
      mount('h-chart-line', { series: [{ data: [1, 2, 3] }] }, el);
      expect(slot(el, 'chart-point').length).toBe(3);
      expect(slot(el, 'chart-segment').length).toBe(2);
    });

    it('centers a single point and draws no segments', () => {
      mount('h-chart-line', { series: [{ data: [5] }] }, el);
      const points = slot(el, 'chart-point');
      expect(points.length).toBe(1);
      expect(slot(el, 'chart-segment').length).toBe(0);
      expect(points[0].style.left).toBe('50%');
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
    it('renders a conic-gradient pie with a stop per slice', () => {
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
      const pie = slot(el, 'chart-pie')[0];
      expect(pie).toBeTruthy();
      expect(pie.style.background).toContain('conic-gradient(');
      expect(pie.style.background).toContain('var(--color-blue-500)');
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
      expect(slot(el, 'chart-legend-swatch').length).toBe(1);
    });

    it('has no axes or gridlines', () => {
      mount('h-chart-pie', { slices: [{ label: 'A', value: 1 }] }, el);
      expect(slot(el, 'chart-plot').length).toBe(0);
    });

    it('shows a percentage label on each slice by default', () => {
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
      const labels = Array.from(slot(el, 'chart-label')).map((l) => l.textContent);
      expect(labels).toEqual(['30%', '70%']);
    });

    it('omits slice labels when dataLabels is false', () => {
      mount(
        'h-chart-pie',
        {
          dataLabels: false,
          slices: [
            { label: 'A', value: 30 },
            { label: 'B', value: 70 },
          ],
        },
        el
      );
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
      expect(labels[0].classList.contains('text-foreground')).toBe(true);
      expect(labels[0].classList.contains('text-white')).toBe(false);
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
      const labels = Array.from(slot(el, 'chart-label')).map((l) => l.textContent);
      expect(labels).toEqual(['97%']);
    });
  });

  describe('doughnut', () => {
    it('renders a conic-gradient with a masked hole', () => {
      mount(
        'h-chart-doughnut',
        {
          slices: [
            { label: 'A', value: 30 },
            { label: 'B', value: 70 },
          ],
        },
        el
      );
      const pie = slot(el, 'chart-pie')[0];
      expect(pie.style.background).toContain('conic-gradient(');
      expect(pie.style.mask).toContain('radial-gradient(');
      expect(pie.style.mask).toContain('transparent');
    });

    it('honors a custom cutout', () => {
      mount('h-chart-doughnut', { cutout: 0.4, slices: [{ label: 'A', value: 1 }] }, el);
      expect(slot(el, 'chart-pie')[0].style.mask).toContain('40.00%');
    });

    it('leaves the pie chart solid (no mask)', () => {
      mount('h-chart-pie', { slices: [{ label: 'A', value: 1 }] }, el);
      expect(slot(el, 'chart-pie')[0].style.mask).toBe('');
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

    it('fires chart-click for the slice under the pointer', () => {
      const spy = vi.fn();
      el.addEventListener('chart-click', spy);
      mount('h-chart-pie', { slices: [{ label: 'A', value: 30 }] }, el);
      slot(el, 'chart-pie')[0].dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
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
      expect(slot(el, 'chart-plot')[0].closest('[aria-hidden="true"]')).toBeTruthy();
    });

    it('renders a hidden data table of the values (bar/line)', () => {
      mount('h-chart-bar', { labels: ['Jan', 'Feb'], series: [{ name: 'Revenue', data: [12, 19] }] }, el);
      const table = slot(el, 'chart-table')[0];
      expect(table).toBeTruthy();
      expect(table.classList.contains('sr-only')).toBe(true);
      expect(Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent)).toEqual(['Category', 'Revenue']);
      expect(Array.from(table.querySelectorAll('tbody tr')[0].children).map((c) => c.textContent)).toEqual(['Jan', '12']);
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
