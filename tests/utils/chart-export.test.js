import { beforeEach, describe, expect, it } from 'vitest';

import chartPlugin from '../../src/components/chart.js';
import { chartToImage, chartToSvg } from '../../src/utils/chart-export.js';
import { mountDirective } from '../test-utils.js';

function makeEl() {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({ width: 600, height: 400, top: 0, left: 0, right: 600, bottom: 400, x: 0, y: 0 });
  document.body.appendChild(el);
  return el;
}

function mountChart(directive, config, el) {
  return mountDirective(chartPlugin, directive, el, { original: directive, expression: 'cfg' }, { evaluateLater: () => (cb) => cb(config) });
}

describe('chartToSvg', () => {
  let el;

  beforeEach(() => {
    el = makeEl();
    mountChart(
      'h-chart-pie',
      {
        slices: [
          { label: 'A', value: 30 },
          { label: 'B', value: 70 },
        ],
      },
      el
    );
  });

  it('serializes the chart into standalone SVG markup', () => {
    const markup = chartToSvg(el);
    expect(markup.startsWith('<svg')).toBe(true);
    expect(markup).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(markup).toContain('viewBox="0 0 600 400"');
    expect(markup).toContain('<path');
    expect(markup).toContain('<text');
  });

  it('resolves classes away so the markup needs no stylesheet', () => {
    const markup = chartToSvg(el);
    expect(markup).not.toContain('class=');
    expect(markup).not.toContain('aria-hidden');
  });

  it('prepends an opaque background by default and omits it when background is null', () => {
    expect(chartToSvg(el)).toContain('width="100%"');
    expect(chartToSvg(el, { background: null })).not.toContain('width="100%"');
    expect(chartToSvg(el, { background: 'transparent' })).not.toContain('width="100%"');
  });

  it('uses a custom background color', () => {
    expect(chartToSvg(el, { background: '#123456' })).toContain('fill="#123456"');
  });

  it('rejects elements that are not charts', () => {
    expect(() => chartToSvg(document.createElement('div'))).toThrow(/chart element/);
    expect(() => chartToSvg(null)).toThrow(/chart element/);
    expect(() => chartToImage(document.createElement('div'))).toThrow(/chart element/);
  });

  it('rejects a chart with nothing drawn', () => {
    const empty = makeEl();
    mountChart('h-chart-pie', { slices: [] }, empty);
    expect(() => chartToSvg(empty)).toThrow(/no drawn content/);
  });
});
