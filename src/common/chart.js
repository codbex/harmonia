import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { KNOWN_COLORS, colorClass, colorVar } from './colors';

// Re-exported so chart consumers keep importing these from `common/chart`.
export { KNOWN_COLORS, colorClass, colorVar };

// Curated, visually distinct order cycled for series without an explicit color.
export const DEFAULT_PALETTE = ['blue', 'red', 'green', 'orange', 'purple', 'teal', 'pink', 'indigo', 'yellow'];

const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

export function defaultFormat(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '';
  return numberFormatter.format(n);
}

/**
 * Small DOM builder. `opts` may set `text`, `slot` (data-slot), `attrs`, `style`.
 */
export function make(tag, classes = [], opts = {}) {
  const node = document.createElement(tag);
  if (classes.length) node.classList.add(...classes);
  if (opts.text != null) node.textContent = opts.text;
  if (opts.slot) node.setAttribute('data-slot', opts.slot);
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, String(v));
  if (opts.style) Object.assign(node.style, opts.style);
  return node;
}

function resolveColor(color, palette, index) {
  return KNOWN_COLORS.includes(color) ? color : palette[index % palette.length];
}

/** Canonicalize bar/line config into `[{ name, color, data: number[] }]`. */
export function normalizeSeries(cfg, palette) {
  let series = Array.isArray(cfg.series) ? cfg.series : [];
  if (!series.length && Array.isArray(cfg.data)) series = [{ data: cfg.data }];
  return series
    .filter((s) => s && Array.isArray(s.data))
    .map((s, i) => ({
      name: s.name != null ? String(s.name) : `Series ${i + 1}`,
      color: resolveColor(s.color, palette, i),
      data: s.data.map((v) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0)),
    }));
}

/** Canonicalize pie config into `[{ label, value, color }]` (positive values only). */
export function normalizeSlices(cfg, palette) {
  let raw;
  if (Array.isArray(cfg.slices)) {
    raw = cfg.slices.map((s, i) => ({
      label: s && s.label != null ? String(s.label) : String(i + 1),
      value: s && typeof s.value === 'number' && !Number.isNaN(s.value) ? s.value : 0,
      color: resolveColor(s && s.color, palette, i),
    }));
  } else {
    const labels = Array.isArray(cfg.labels) ? cfg.labels : [];
    const series = Array.isArray(cfg.series) ? cfg.series : [];
    const data = series[0] && Array.isArray(series[0].data) ? series[0].data : Array.isArray(cfg.data) ? cfg.data : [];
    raw = data.map((v, i) => ({
      label: labels[i] != null ? String(labels[i]) : String(i + 1),
      value: typeof v === 'number' && !Number.isNaN(v) ? v : 0,
      color: palette[i % palette.length],
    }));
  }
  return raw.filter((s) => s.value > 0);
}

// "Nice number" axis scaling (Heckbert). Produces human-friendly tick values.
export function niceNum(range, round) {
  const exp = Math.floor(Math.log10(range));
  const f = range / Math.pow(10, exp);
  let nf;
  if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * Math.pow(10, exp);
}

export function niceScale(min, max, maxTicks = 5) {
  if (min === max) max = min + 1;
  const range = niceNum(max - min || 1, false);
  const step = niceNum(range / Math.max(maxTicks - 1, 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = niceMin; v <= niceMax + step * 0.5; v += step) ticks.push(Number(v.toFixed(10)));
  return { min: niceMin, max: niceMax, step, ticks };
}

/** Position of a value within the scale, as a percentage (0 = min, 100 = max). */
export function valueToPct(v, scale) {
  if (scale.max === scale.min) return 0;
  return ((v - scale.min) / (scale.max - scale.min)) * 100;
}

/**
 * A tooltip controller. Builds one absolute element *inside* the chart root
 * (no document.body append) and anchors it to a hovered element via floating-ui.
 * `show` takes a DOM node as content; we never assign HTML strings.
 */
export function createTooltip(root) {
  const tip = make(
    'div',
    ['absolute', 'top-0', 'left-0', 'z-50', 'hidden', 'pointer-events-none', 'w-max', 'max-w-xs', 'rounded-md', 'border', 'border-border', 'bg-popover', 'text-popover-foreground', 'shadow-md', 'px-2', 'py-1', 'text-xs'],
    { slot: 'chart-tooltip', attrs: { 'aria-hidden': 'true' } }
  );
  root.appendChild(tip);
  // When pinned (after a click/tap) the tooltip stays open and ignores hover-out
  // until it is explicitly released, so it works on touch.
  let pinned = false;
  return {
    el: tip,
    get pinned() {
      return pinned;
    },
    show(reference, node) {
      tip.replaceChildren(node);
      tip.classList.remove('hidden');
      computePosition(reference, tip, {
        placement: 'top',
        strategy: 'absolute',
        middleware: [offset(8), flip(), shift({ padding: 4 })],
      }).then(({ x, y }) => {
        Object.assign(tip.style, { left: `${x}px`, top: `${y}px` });
      });
    },
    pin() {
      pinned = true;
    },
    hide() {
      if (pinned) return;
      tip.classList.add('hidden');
    },
    release() {
      pinned = false;
      tip.classList.add('hidden');
    },
    remove() {
      tip.remove();
    },
  };
}

export function dispatchChartEvent(root, name, detail) {
  root.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/** Build tooltip content (a fragment of elements) for a data point. */
export function tooltipContent(payload, format) {
  const frag = document.createDocumentFragment();
  if (payload.showSeries && payload.seriesName) {
    frag.appendChild(make('span', ['text-muted-foreground'], { text: `${payload.seriesName} · ` }));
  }
  frag.appendChild(make('span', ['font-medium'], { text: payload.label }));
  frag.appendChild(document.createTextNode(`: ${format(payload.value)}`));
  return frag;
}

/**
 * Wire pointer/click handlers on a data element (bar/point/slice).
 * Returns listener records so the caller can detach them on re-render.
 */
export function attachHover(target, payload, { tooltip, root, format, enabled }) {
  const records = [];
  const add = (type, fn) => {
    target.addEventListener(type, fn);
    records.push({ target, type, fn });
  };
  add('pointerenter', () => {
    if (enabled && !tooltip.pinned) tooltip.show(target, tooltipContent(payload, format));
    dispatchChartEvent(root, 'chart-hover', payload);
  });
  add('pointermove', () => {
    if (enabled && !tooltip.pinned) tooltip.show(target, tooltipContent(payload, format));
  });
  add('pointerleave', () => {
    if (enabled) tooltip.hide();
    dispatchChartEvent(root, 'chart-leave', payload);
  });
  // Keep the press from bubbling to the document-level dismiss handler.
  add('pointerdown', (event) => event.stopPropagation());
  add('click', () => {
    if (enabled) {
      tooltip.show(target, tooltipContent(payload, format));
      tooltip.pin();
    }
    dispatchChartEvent(root, 'chart-click', payload);
  });
  return records;
}

/** Legend strip mapping colors to labels. `items` is `[{ label, color }]`. */
export function buildLegend(items) {
  const legend = make('div', ['flex', 'flex-wrap', 'items-center', 'justify-center', 'gap-3', 'text-xs', 'text-muted-foreground', 'shrink-0'], { slot: 'chart-legend' });
  items.forEach((it) => {
    const item = make('span', ['inline-flex', 'items-center', 'gap-1.5']);
    item.appendChild(make('span', ['size-2.5', 'rounded-sm', colorClass(it.color)], { slot: 'chart-legend-swatch' }));
    item.appendChild(make('span', [], { text: it.label }));
    legend.appendChild(item);
  });
  return legend;
}

export function noData() {
  return make('div', ['flex', 'flex-1', 'items-center', 'justify-center', 'text-sm', 'text-muted-foreground'], { text: 'No data', slot: 'chart-empty' });
}

/**
 * A visually-hidden data table that conveys the chart's data to assistive tech.
 * `headers` is the column labels; `rows` is an array of string cell arrays whose
 * first cell is the row header.
 */
export function buildDataTable(caption, headers, rows) {
  const table = make('table', ['sr-only', 'inline-block'], { slot: 'chart-table' });
  table.appendChild(make('caption', [], { text: caption }));

  const thead = make('thead');
  const headRow = make('tr');
  headers.forEach((h) => headRow.appendChild(make('th', [], { text: h, attrs: { scope: 'col' } })));
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = make('tbody');
  rows.forEach((cells) => {
    const tr = make('tr');
    cells.forEach((cell, i) => tr.appendChild(i === 0 ? make('th', [], { text: cell, attrs: { scope: 'row' } }) : make('td', [], { text: cell })));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}
