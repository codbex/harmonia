import { DEFAULT_PALETTE, attachHover, buildDataTable, createTooltip, defaultFormat, fillClass, fitText, make, makeSvg, measureText, niceScale, noData, normalizeSeries, normalizeSlices, strokeClass, valueToPct } from '../common/chart';

// Mark the chart root as a labeled figure for assistive tech. The visual layer
// (the SVG) is decorative (`aria-hidden`); the real data is exposed via a
// hidden table. Respect an author-provided `aria-label`, only falling back to
// the default. Returns the effective label (used as the data table caption).
function labelChart(root, defaultLabel) {
  root.setAttribute('role', 'figure');
  if (!root.hasAttribute('aria-label')) root.setAttribute('aria-label', defaultLabel);
  return root.getAttribute('aria-label');
}

// Chart text presets selectable with `data-font-size` on the chart element.
// `fallback` is the size used when computed styles are unavailable.
const FONT_SIZES = {
  xs: { class: 'text-xs', fallback: 12 },
  sm: { class: 'text-sm', fallback: 14 },
  base: { class: 'text-base', fallback: 16 },
  lg: { class: 'text-lg', fallback: 18 },
};

// Layout constants (pixels).
const TICK_GAP = 6;
const BAR_RADIUS = 4;
const BAR_INSET = 2;
// A dot's 2px card-colored stroke straddles the radius, so r = 5 leaves the
// same 8px colored core and 12px overall size as the previous size-2 + ring-2.
const DOT_RADIUS = 5;
const LABEL_GAP = 6;
const EDGE_CLAMP = 16;
const LEGEND_SWATCH = 10;
const LEGEND_ITEM_GAP = 16;
const LEGEND_TEXT_GAP = 6;
const LEGEND_TOP_GAP = 6;

// Read the shared chart options that every chart type understands.
function commonOptions(cfg) {
  return {
    palette: Array.isArray(cfg.palette) && cfg.palette.length ? cfg.palette : DEFAULT_PALETTE,
    legend: cfg.legend !== false,
    tooltip: cfg.tooltip !== false,
    format: typeof cfg.valueFormat === 'function' ? cfg.valueFormat : defaultFormat,
  };
}

// Text metrics of the chart, from the `data-font-size` preset on the chart
// element ("xs", "sm", "base" or "lg", default "xs"). The size is measured
// from a probe carrying the preset's class, because the `text-*` utilities
// resolve `--text-*` theme variables the user may have overridden, and the
// layout math must reserve exactly what the text renders at. `row` is the
// height of an axis or legend row, `font` the CSS font string used for text
// measurement.
function chartText(root) {
  const preset = FONT_SIZES[root.getAttribute('data-font-size')] || FONT_SIZES.xs;
  let size = preset.fallback;
  let family = 'sans-serif';
  if (typeof getComputedStyle === 'function') {
    const probe = make('span', [preset.class]);
    root.appendChild(probe);
    const style = getComputedStyle(probe);
    size = parseFloat(style.fontSize) || size;
    family = style.fontFamily || family;
    probe.remove();
  }
  return { class: preset.class, size, row: size + 4, font: `${size}px ${family}` };
}

// A text node. Coordinates are the anchor point; `title` adds a native tooltip
// carrying the untruncated string.
function svgText(text, x, y, { anchor = 'start', baseline = 'central', classes = ['fill-muted-foreground'], slot, title } = {}) {
  const node = makeSvg('text', classes, { slot, text, attrs: { x: x.toFixed(2), y: y.toFixed(2), 'text-anchor': anchor, 'dominant-baseline': baseline } });
  if (title) node.appendChild(makeSvg('title', [], { text: title }));
  return node;
}

// Data label drawn on top of a colored shape (white text + dark outline for contrast).
function onColorText(text, x, y, anchor = 'middle') {
  const node = svgText(text, x, y, { anchor, classes: ['fill-white', 'font-medium'], slot: 'chart-label' });
  node.setAttribute('paint-order', 'stroke');
  node.setAttribute('stroke', 'rgba(0, 0, 0, 0.35)');
  node.setAttribute('stroke-width', '2');
  node.setAttribute('stroke-linejoin', 'round');
  return node;
}

// Data label drawn on the chart background.
function dataText(text, x, y, anchor = 'middle') {
  return svgText(text, x, y, { anchor, classes: ['fill-foreground'], slot: 'chart-label' });
}

// A rectangle path with per-corner rounding (stacked bars round only their outer end).
function roundedRectPath(x, y, w, h, radius, corners) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  const tl = corners.tl ? r : 0;
  const tr = corners.tr ? r : 0;
  const br = corners.br ? r : 0;
  const bl = corners.bl ? r : 0;
  return (
    `M ${(x + tl).toFixed(2)} ${y.toFixed(2)}` +
    ` H ${(x + w - tr).toFixed(2)}${tr ? ` A ${tr} ${tr} 0 0 1 ${(x + w).toFixed(2)} ${(y + tr).toFixed(2)}` : ''}` +
    ` V ${(y + h - br).toFixed(2)}${br ? ` A ${br} ${br} 0 0 1 ${(x + w - br).toFixed(2)} ${(y + h).toFixed(2)}` : ''}` +
    ` H ${(x + bl).toFixed(2)}${bl ? ` A ${bl} ${bl} 0 0 1 ${x.toFixed(2)} ${(y + h - bl).toFixed(2)}` : ''}` +
    ` V ${(y + tl).toFixed(2)}${tl ? ` A ${tl} ${tl} 0 0 1 ${(x + tl).toFixed(2)} ${y.toFixed(2)}` : ''}` +
    ' Z'
  );
}

// A pie/doughnut/polar wedge between two angles (radians). `innerR > 0` leaves
// a hole. A full turn is drawn as two half arcs (a single arc with identical
// endpoints collapses to nothing).
function wedgePath(cx, cy, innerR, outerR, a0, a1) {
  const pt = (a, r) => `${(cx + Math.cos(a) * r).toFixed(3)} ${(cy + Math.sin(a) * r).toFixed(3)}`;
  const span = a1 - a0;
  if (span >= 2 * Math.PI - 0.0001) {
    const mid = a0 + Math.PI;
    let d = `M ${pt(a0, outerR)} A ${outerR} ${outerR} 0 1 1 ${pt(mid, outerR)} A ${outerR} ${outerR} 0 1 1 ${pt(a0, outerR)}`;
    if (innerR > 0) d += ` M ${pt(a0, innerR)} A ${innerR} ${innerR} 0 1 0 ${pt(mid, innerR)} A ${innerR} ${innerR} 0 1 0 ${pt(a0, innerR)}`;
    return `${d} Z`;
  }
  const large = span > Math.PI ? 1 : 0;
  let d = `M ${pt(a0, outerR)} A ${outerR} ${outerR} 0 ${large} 1 ${pt(a1, outerR)}`;
  if (innerR > 0) d += ` L ${pt(a1, innerR)} A ${innerR} ${innerR} 0 ${large} 0 ${pt(a0, innerR)}`;
  else d += ` L ${cx.toFixed(3)} ${cy.toFixed(3)}`;
  return `${d} Z`;
}

// The chart's SVG canvas, sized to the measured chart area.
function chartSvg(width, height, text) {
  return makeSvg('svg', [text.class, 'shrink-0'], { slot: 'chart-svg', attrs: { width: Math.max(0, width), height: Math.max(0, height), 'aria-hidden': 'true' } });
}

// Wrapped, centered legend rows at the bottom of the SVG. Returns the height
// it consumed (rows + the gap above them).
function buildLegendSvg(svg, items, width, height, text) {
  const measured = items.map((it) => ({ ...it, w: LEGEND_SWATCH + LEGEND_TEXT_GAP + measureText(it.label, text.font) }));
  const rows = [];
  let row = [];
  let rowWidth = 0;
  for (const it of measured) {
    const extra = (row.length ? LEGEND_ITEM_GAP : 0) + it.w;
    if (row.length && rowWidth + extra > width) {
      rows.push({ items: row, width: rowWidth });
      row = [it];
      rowWidth = it.w;
    } else {
      row.push(it);
      rowWidth += extra;
    }
  }
  if (row.length) rows.push({ items: row, width: rowWidth });

  const legend = makeSvg('g', [], { slot: 'chart-legend' });
  rows.forEach((r, ri) => {
    const rowY = height - (rows.length - ri) * text.row;
    let x = Math.max(0, (width - r.width) / 2);
    r.items.forEach((it) => {
      legend.appendChild(makeSvg('circle', [fillClass(it.color)], { slot: 'chart-legend-swatch', attrs: { cx: (x + LEGEND_SWATCH / 2).toFixed(2), cy: (rowY + text.row / 2).toFixed(2), r: LEGEND_SWATCH / 2 } }));
      legend.appendChild(svgText(it.label, x + LEGEND_SWATCH + LEGEND_TEXT_GAP, rowY + text.row / 2, {}));
      x += it.w + LEGEND_ITEM_GAP;
    });
  });
  svg.appendChild(legend);
  return rows.length * text.row + LEGEND_TOP_GAP;
}

// Snap a coordinate to the pixel center so a 1px stroke fills exactly one
// pixel row (unsnapped strokes antialias across two rows and look faded).
const crisp = (v) => Math.round(v) + 0.5;

// Cartesian scaffold: numeric ticks, category labels, gridlines, and the two
// plot borders. Returns the plot rectangle and the group shapes render into.
function buildCartesianSvg(svg, { width, height, scale, categories, horizontal, axes, gridlines, format, text }) {
  const showCats = categories.some((c) => c);
  const plot = makeSvg('g', [], { slot: 'chart-plot' });
  let px;
  let py;
  let pw;
  let ph;

  if (!horizontal) {
    px = axes ? Math.max(...scale.ticks.map((t) => measureText(format(t), text.font))) + TICK_GAP : 1;
    py = text.size / 2;
    // Right margin so edge points, their labels, and the last category fit.
    pw = Math.max(0, width - px - text.size);
    ph = Math.max(0, height - py - (showCats ? text.row : 4));
    const tickY = (t) => py + ph - (valueToPct(t, scale) / 100) * ph;
    if (axes) scale.ticks.forEach((t) => svg.appendChild(svgText(format(t), px - TICK_GAP, tickY(t), { anchor: 'end' })));
    if (gridlines) scale.ticks.forEach((t) => plot.appendChild(makeSvg('line', ['stroke-border/50'], { attrs: { x1: px, y1: crisp(tickY(t)), x2: px + pw, y2: crisp(tickY(t)) } })));
    if (showCats) {
      const slotW = pw / categories.length;
      categories.forEach((c, i) => {
        if (!c) return;
        const fitted = fitText(c, Math.max(0, slotW - 4), text.font);
        svg.appendChild(svgText(fitted.text, px + (i + 0.5) * slotW, py + ph + text.row / 2 + 2, { anchor: 'middle', title: fitted.truncated ? c : undefined }));
      });
    }
  } else {
    const catWidth = showCats ? Math.min(Math.max(...categories.map((c) => measureText(c, text.font))), width * 0.3) : 0;
    px = showCats ? catWidth + TICK_GAP : 1;
    py = 2;
    pw = Math.max(0, width - px - text.size);
    ph = Math.max(0, height - py - (axes ? text.row : 4));
    const tickX = (t) => px + (valueToPct(t, scale) / 100) * pw;
    if (showCats) {
      const slotH = ph / categories.length;
      categories.forEach((c, i) => {
        if (!c) return;
        const fitted = fitText(c, catWidth, text.font);
        svg.appendChild(svgText(fitted.text, px - TICK_GAP, py + (i + 0.5) * slotH, { anchor: 'end', title: fitted.truncated ? c : undefined }));
      });
    }
    if (axes) scale.ticks.forEach((t) => svg.appendChild(svgText(format(t), tickX(t), py + ph + text.row / 2 + 2, { anchor: 'middle' })));
    if (gridlines) scale.ticks.forEach((t) => plot.appendChild(makeSvg('line', ['stroke-border/50'], { attrs: { x1: crisp(tickX(t)), y1: py, x2: crisp(tickX(t)), y2: py + ph } })));
  }

  plot.appendChild(makeSvg('line', ['stroke-border'], { attrs: { x1: crisp(px) - 1, y1: py, x2: crisp(px) - 1, y2: crisp(py + ph) } }));
  plot.appendChild(makeSvg('line', ['stroke-border'], { attrs: { x1: crisp(px) - 1, y1: crisp(py + ph), x2: px + pw, y2: crisp(py + ph) } }));
  svg.appendChild(plot);
  return { plot, px, py, pw, ph };
}

function renderBar(root, cfg, ctx) {
  const { palette, legend, tooltip, format } = commonOptions(cfg);
  const horizontal = cfg.orientation === 'horizontal';
  const stacked = cfg.stacked === true;
  const showAxes = cfg.axes !== false;
  const showGrid = cfg.gridlines !== false;
  const showLabels = cfg.dataLabels === true;
  const tickCount = Number.isInteger(cfg.tickCount) ? cfg.tickCount : 5;
  const labels = Array.isArray(cfg.labels) ? cfg.labels : [];
  const series = normalizeSeries(cfg, palette);
  const ariaLabel = labelChart(root, 'Bar chart');

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0']);

  const values = series.flatMap((s) => s.data);
  if (!series.length || !values.length) {
    out.appendChild(noData());
    return out;
  }

  const catCount = Math.max(labels.length, ...series.map((s) => s.data.length));
  const categories = Array.from({ length: catCount }, (_, i) => (labels[i] != null ? String(labels[i]) : ''));
  const text = chartText(root);
  const svg = chartSvg(ctx.width, ctx.height, text);

  // Value domain - bars always include the 0 baseline.
  let dataMin = Math.min(0, ...values);
  let dataMax = Math.max(0, ...values);
  if (stacked) {
    dataMin = 0;
    dataMax = 0;
    for (let i = 0; i < catCount; i++) {
      let pos = 0;
      let neg = 0;
      series.forEach((s) => {
        const v = s.data[i] || 0;
        if (v >= 0) pos += v;
        else neg += v;
      });
      dataMax = Math.max(dataMax, pos);
      dataMin = Math.min(dataMin, neg);
    }
  }
  const scale = niceScale(dataMin, dataMax, tickCount);

  const legendHeight = legend
    ? buildLegendSvg(
        svg,
        series.map((s) => ({ label: s.name, color: s.color })),
        ctx.width,
        ctx.height,
        text
      )
    : 0;
  const { plot, px, py, pw, ph } = buildCartesianSvg(svg, { width: ctx.width, height: ctx.height - legendHeight, scale, categories, horizontal, axes: showAxes, gridlines: showGrid, format, text });

  // Distance of a value from the plot's min edge, along the value axis.
  const valueSize = (v) => (valueToPct(v, scale) / 100) * (horizontal ? pw : ph);
  const slotSize = (horizontal ? ph : pw) / catCount;

  for (let i = 0; i < catCount; i++) {
    const slotStart = (horizontal ? py : px) + i * slotSize;
    let posCursor = 0;
    let negCursor = 0;
    const stackSegs = [];

    series.forEach((s, si) => {
      const v = s.data[i];
      if (typeof v !== 'number' || Number.isNaN(v)) return;
      const payload = { type: 'bar', seriesName: s.name, seriesIndex: si, categoryIndex: i, label: categories[i] || s.name, value: v, color: s.color, showSeries: series.length > 1 };

      let startVal;
      let endVal;
      let cross;
      let crossSize;
      if (stacked) {
        if (v >= 0) {
          startVal = posCursor;
          endVal = posCursor + v;
          posCursor = endVal;
        } else {
          startVal = negCursor + v;
          endVal = negCursor;
          negCursor = startVal;
        }
        cross = slotStart + slotSize * 0.2;
        crossSize = slotSize * 0.6;
      } else {
        startVal = Math.min(0, v);
        endVal = Math.max(0, v);
        // The group fills 85% of the category slot, so the gap between groups
        // stays clearly larger than the small fixed gap between grouped bars.
        const groupSize = slotSize * 0.85;
        const subSize = groupSize / series.length;
        const inset = series.length > 1 ? BAR_INSET : 0;
        cross = slotStart + (slotSize - groupSize) / 2 + si * subSize + inset;
        crossSize = Math.max(1, subSize - 2 * inset);
      }

      const lo = Math.min(valueSize(startVal), valueSize(endVal));
      const hi = Math.max(valueSize(startVal), valueSize(endVal));
      // Bar rectangle in svg coordinates.
      const rect = horizontal ? { x: px + lo, y: cross, w: hi - lo, h: crossSize } : { x: cross, y: py + ph - hi, w: crossSize, h: hi - lo };

      if (stacked) {
        if (hi - lo > 0.01) stackSegs.push({ rect, lo, hi, color: s.color, payload, v });
        if (showLabels && hi - lo >= EDGE_CLAMP) {
          svg.appendChild(onColorText(format(v), rect.x + rect.w / 2, rect.y + rect.h / 2));
        }
        if (!(hi - lo > 0.01)) return;
      } else {
        const radius = Math.min(BAR_RADIUS, rect.w / 2, rect.h / 2);
        const bar = makeSvg('rect', [fillClass(s.color)], { slot: 'chart-bar', attrs: { x: rect.x.toFixed(2), y: rect.y.toFixed(2), width: rect.w.toFixed(2), height: rect.h.toFixed(2), rx: radius.toFixed(2) } });
        ctx.addListeners(attachHover(bar, payload, { tooltip: ctx.tooltip, root, format, enabled: tooltip }));
        plot.appendChild(bar);

        if (showLabels) {
          // A bar whose end (nearly) reaches the plot edge gets its label
          // inside the bar instead, so it cannot land on the axis labels.
          const positive = v >= 0;
          if (horizontal) {
            const yc = rect.y + rect.h / 2;
            const end = positive ? rect.x + rect.w : rect.x;
            const clamped = positive ? end > px + pw - EDGE_CLAMP : end < px + EDGE_CLAMP;
            if (clamped) svg.appendChild(onColorText(format(v), end + (positive ? -LABEL_GAP : LABEL_GAP), yc, positive ? 'end' : 'start'));
            else svg.appendChild(dataText(format(v), end + (positive ? LABEL_GAP : -LABEL_GAP), yc, positive ? 'start' : 'end'));
          } else {
            const xc = rect.x + rect.w / 2;
            const end = positive ? rect.y : rect.y + rect.h;
            const clamped = positive ? end < py + EDGE_CLAMP : end > py + ph - EDGE_CLAMP;
            if (clamped) svg.appendChild(onColorText(format(v), xc, end + (positive ? 1 : -1) * (text.size + 4)));
            else svg.appendChild(dataText(format(v), xc, end + (positive ? -LABEL_GAP - 2 : LABEL_GAP + 2)));
          }
        }
      }
    });

    // Round only the outer ends of the stack (a lone segment gets both).
    if (stackSegs.length) {
      let minIdx = 0;
      let maxIdx = 0;
      stackSegs.forEach((seg, k) => {
        if (seg.lo < stackSegs[minIdx].lo) minIdx = k;
        if (seg.hi > stackSegs[maxIdx].hi) maxIdx = k;
      });
      stackSegs.forEach((seg, k) => {
        const corners = { tl: false, tr: false, br: false, bl: false };
        if (horizontal) {
          if (k === minIdx) corners.tl = corners.bl = true;
          if (k === maxIdx) corners.tr = corners.br = true;
        } else {
          if (k === minIdx) corners.bl = corners.br = true;
          if (k === maxIdx) corners.tl = corners.tr = true;
        }
        const bar = makeSvg('path', [fillClass(seg.color)], { slot: 'chart-bar', attrs: { d: roundedRectPath(seg.rect.x, seg.rect.y, seg.rect.w, seg.rect.h, BAR_RADIUS, corners) } });
        ctx.addListeners(attachHover(bar, seg.payload, { tooltip: ctx.tooltip, root, format, enabled: tooltip }));
        plot.appendChild(bar);
      });
    }
  }

  out.appendChild(svg);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Category', ...series.map((s) => s.name)],
      categories.map((c, i) => [c || String(i + 1), ...series.map((s) => (typeof s.data[i] === 'number' && !Number.isNaN(s.data[i]) ? format(s.data[i]) : ''))])
    )
  );
  return out;
}

function renderLine(root, cfg, ctx, scatter = false) {
  const { palette, legend, tooltip, format } = commonOptions(cfg);
  const showAxes = cfg.axes !== false;
  const showGrid = cfg.gridlines !== false;
  const showLabels = cfg.dataLabels === true;
  const tickCount = Number.isInteger(cfg.tickCount) ? cfg.tickCount : 5;
  const labels = Array.isArray(cfg.labels) ? cfg.labels : [];
  const series = normalizeSeries(cfg, palette);
  const ariaLabel = labelChart(root, scatter ? 'Scatter chart' : 'Line chart');

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0']);

  const values = series.flatMap((s) => s.data);
  if (!series.length || !values.length) {
    out.appendChild(noData());
    return out;
  }

  const catCount = Math.max(labels.length, ...series.map((s) => s.data.length));
  const categories = Array.from({ length: catCount }, (_, i) => (labels[i] != null ? String(labels[i]) : ''));
  const scale = niceScale(Math.min(...values), Math.max(...values), tickCount);
  const text = chartText(root);
  const svg = chartSvg(ctx.width, ctx.height, text);

  const legendHeight = legend
    ? buildLegendSvg(
        svg,
        series.map((s) => ({ label: s.name, color: s.color })),
        ctx.width,
        ctx.height,
        text
      )
    : 0;
  const { plot, px, py, pw, ph } = buildCartesianSvg(svg, { width: ctx.width, height: ctx.height - legendHeight, scale, categories, horizontal: false, axes: showAxes, gridlines: showGrid, format, text });

  series.forEach((s, si) => {
    const n = s.data.length;
    const points = s.data.map((v, k) => ({
      x: px + (n === 1 ? pw / 2 : (k / (n - 1)) * pw),
      y: py + ph - (valueToPct(v, scale) / 100) * ph,
      v,
      k,
    }));

    if (!scatter && points.length > 1) {
      plot.appendChild(
        makeSvg('polyline', ['fill-none', strokeClass(s.color)], {
          slot: 'chart-segment',
          attrs: { points: points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '), 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' },
        })
      );
    }

    points.forEach((p) => {
      const dot = makeSvg('circle', [fillClass(s.color), 'stroke-card'], { slot: 'chart-point', attrs: { cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: DOT_RADIUS, 'stroke-width': 2 } });
      ctx.addListeners(
        attachHover(
          dot,
          { type: 'point', seriesName: s.name, seriesIndex: si, categoryIndex: p.k, label: categories[p.k] || s.name, value: p.v, color: s.color, showSeries: series.length > 1 },
          { tooltip: ctx.tooltip, root, format, enabled: tooltip }
        )
      );
      plot.appendChild(dot);
      if (showLabels) svg.appendChild(dataText(format(p.v), p.x, p.y - DOT_RADIUS - LABEL_GAP));
    });
  });

  out.appendChild(svg);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Category', ...series.map((s) => s.name)],
      categories.map((c, i) => [c || String(i + 1), ...series.map((s) => (typeof s.data[i] === 'number' && !Number.isNaN(s.data[i]) ? format(s.data[i]) : ''))])
    )
  );
  return out;
}

function renderPie(root, cfg, ctx, doughnut = false) {
  const { palette, legend, tooltip, format } = commonOptions(cfg);
  const slices = normalizeSlices(cfg, palette);
  const ariaLabel = labelChart(root, doughnut ? 'Doughnut chart' : 'Pie chart');

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0']);

  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (!slices.length || total <= 0) {
    out.appendChild(noData());
    return out;
  }

  const showLabels = cfg.dataLabels !== false;
  const outsideLabels = cfg.labelPosition === 'outside';
  // Hole radius as a fraction of the pie radius (0 = solid pie).
  const cutout = doughnut ? Math.min(0.9, Math.max(0.2, typeof cfg.cutout === 'number' ? cfg.cutout : 0.6)) : 0;

  const text = chartText(root);
  const svg = chartSvg(ctx.width, ctx.height, text);
  const legendHeight = legend
    ? buildLegendSvg(
        svg,
        slices.map((s) => ({ label: s.label, color: s.color })),
        ctx.width,
        ctx.height,
        text
      )
    : 0;

  const cx = ctx.width / 2;
  const cy = (ctx.height - legendHeight) / 2;
  // Outside labels need room around the circle, so shrink the pie.
  const radius = Math.max(0, Math.min(ctx.width, ctx.height - legendHeight) / 2 - 2) * (showLabels && outsideLabels ? 0.8 : 1);

  let acc = 0;
  slices.forEach((s, i) => {
    const start = acc / total;
    acc += s.value;
    const end = acc / total;
    const a0 = start * 2 * Math.PI - Math.PI / 2;
    const a1 = end * 2 * Math.PI - Math.PI / 2;

    const wedge = makeSvg('path', [fillClass(s.color), 'cursor-pointer'], { slot: 'chart-pie', attrs: { d: wedgePath(cx, cy, cutout * radius, radius, a0, a1) } });
    ctx.addListeners(
      attachHover(
        wedge,
        { type: 'slice', seriesName: undefined, seriesIndex: 0, categoryIndex: i, label: s.label, value: s.value, color: s.color, showSeries: false },
        { tooltip: ctx.tooltip, root, format, enabled: tooltip, followCursor: true }
      )
    );
    svg.appendChild(wedge);

    // Percentage label for the slice (skip slivers too small to fit one).
    const pct = (s.value / total) * 100;
    if (showLabels && pct >= 5) {
      const angle = ((start + end) / 2) * 2 * Math.PI - Math.PI / 2;
      const insideOffset = cutout > 0 ? ((cutout + 1) / 2) * radius : radius * 0.62;
      const offset = outsideLabels ? radius * 1.16 : insideOffset;
      const lx = cx + Math.cos(angle) * offset;
      const ly = cy + Math.sin(angle) * offset;
      svg.appendChild(outsideLabels ? dataText(`${s.value}%`, lx, ly) : onColorText(`${s.value}%`, lx, ly));
    }
  });

  out.appendChild(svg);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Segment', 'Value'],
      slices.map((s) => [s.label, format(s.value)])
    )
  );
  return out;
}

// Numeric tick labels along the upward vertical of a radial chart, left of the
// axis to keep clear of the data drawn on the top spoke. The outline in the
// theme background color keeps them legible on top of colored slices and fills.
function radialTicks(svg, cx, cy, radius, scale, format) {
  scale.ticks.forEach((t) => {
    const r = (valueToPct(t, scale) / 100) * radius;
    const label = svgText(format(t), cx - 4, cy - r, { anchor: 'end', classes: ['fill-muted-foreground', 'font-medium', 'stroke-background'], slot: 'chart-tick' });
    label.setAttribute('paint-order', 'stroke');
    label.setAttribute('stroke-width', '2');
    label.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(label);
  });
}

function renderPolarArea(root, cfg, ctx) {
  const { palette, legend, tooltip, format } = commonOptions(cfg);
  const showAxes = cfg.axes !== false;
  const showGrid = cfg.gridlines !== false;
  const showLabels = cfg.dataLabels !== false;
  const tickCount = Number.isInteger(cfg.tickCount) ? cfg.tickCount : 5;
  const slices = normalizeSlices(cfg, palette);
  const ariaLabel = labelChart(root, 'Polar area chart');

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0']);

  if (!slices.length) {
    out.appendChild(noData());
    return out;
  }

  const scale = niceScale(0, Math.max(...slices.map((s) => s.value)), tickCount);
  const text = chartText(root);
  const svg = chartSvg(ctx.width, ctx.height, text);
  const legendHeight = legend
    ? buildLegendSvg(
        svg,
        slices.map((s) => ({ label: s.label, color: s.color })),
        ctx.width,
        ctx.height,
        text
      )
    : 0;

  const cx = ctx.width / 2;
  const cy = (ctx.height - legendHeight) / 2;
  // Leave room above for the outermost tick label.
  const radius = Math.max(0, Math.min(ctx.width, ctx.height - legendHeight) / 2 - text.size / 2 - 2);

  // Every slice spans an equal angle; the value sets how far it reaches.
  const step = (2 * Math.PI) / slices.length;
  slices.forEach((s, i) => {
    const a0 = i * step - Math.PI / 2;
    const outer = (valueToPct(s.value, scale) / 100) * radius;
    const wedge = makeSvg('path', [fillClass(s.color), 'cursor-pointer'], { slot: 'chart-polar-slice', attrs: { d: wedgePath(cx, cy, 0, outer, a0, a0 + step), opacity: '0.75' } });
    ctx.addListeners(
      attachHover(
        wedge,
        { type: 'slice', seriesName: undefined, seriesIndex: 0, categoryIndex: i, label: s.label, value: s.value, color: s.color, showSeries: false },
        { tooltip: ctx.tooltip, root, format, enabled: tooltip, followCursor: true }
      )
    );
    svg.appendChild(wedge);

    // Value label at mid-angle, mid-radius (skip slices too small to fit one).
    if (showLabels && outer >= radius * 0.25) {
      const angle = a0 + step / 2;
      const r = outer / 2 + radius * 0.12;
      svg.appendChild(onColorText(format(s.value), cx + Math.cos(angle) * r, cy + Math.sin(angle) * r));
    }
  });

  if (showGrid) {
    scale.ticks.forEach((t) => {
      const r = (valueToPct(t, scale) / 100) * radius;
      if (r <= 0) return;
      svg.appendChild(makeSvg('circle', ['fill-none', 'stroke-border/50'], { slot: 'chart-ring', attrs: { cx: cx.toFixed(2), cy: cy.toFixed(2), r: r.toFixed(2) } }));
    });
  }
  if (showAxes) radialTicks(svg, cx, cy, radius, scale, format);

  out.appendChild(svg);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Segment', 'Value'],
      slices.map((s) => [s.label, format(s.value)])
    )
  );
  return out;
}

function renderRadar(root, cfg, ctx) {
  const { palette, legend, tooltip, format } = commonOptions(cfg);
  const showAxes = cfg.axes !== false;
  const showGrid = cfg.gridlines !== false;
  const showLabels = cfg.dataLabels === true;
  const tickCount = Number.isInteger(cfg.tickCount) ? cfg.tickCount : 5;
  const labels = Array.isArray(cfg.labels) ? cfg.labels : [];
  const series = normalizeSeries(cfg, palette);
  const ariaLabel = labelChart(root, 'Radar chart');

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0']);

  const values = series.flatMap((s) => s.data);
  if (!series.length || !values.length) {
    out.appendChild(noData());
    return out;
  }

  const catCount = Math.max(labels.length, ...series.map((s) => s.data.length));
  const categories = Array.from({ length: catCount }, (_, i) => (labels[i] != null ? String(labels[i]) : ''));
  const scale = niceScale(Math.min(0, ...values), Math.max(0, ...values), tickCount);
  const text = chartText(root);
  const svg = chartSvg(ctx.width, ctx.height, text);
  const legendHeight = legend
    ? buildLegendSvg(
        svg,
        series.map((s) => ({ label: s.name, color: s.color })),
        ctx.width,
        ctx.height,
        text
      )
    : 0;

  const cx = ctx.width / 2;
  const cy = (ctx.height - legendHeight) / 2;
  // Reserve room around the web for the category labels.
  const maxLabel = categories.length ? Math.max(...categories.map((c) => measureText(c, text.font))) : 0;
  const reserveX = Math.min(maxLabel + 16, ctx.width * 0.25);
  const reserveY = text.size + 12;
  const radius = Math.max(10, Math.min(cx - reserveX, (ctx.height - legendHeight) / 2 - reserveY));

  // Category `i` sits at this angle, starting at the top and going clockwise.
  const angleAt = (i) => (i / catCount) * 2 * Math.PI - Math.PI / 2;
  const pointAt = (i, r) => ({ x: cx + Math.cos(angleAt(i)) * r, y: cy + Math.sin(angleAt(i)) * r });
  const ringPoints = (r) =>
    Array.from({ length: catCount }, (_, i) => pointAt(i, r))
      .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');

  if (showGrid) {
    for (let i = 0; i < catCount; i++) {
      const p = pointAt(i, radius);
      svg.appendChild(makeSvg('line', ['stroke-border/50'], { slot: 'chart-spoke', attrs: { x1: cx.toFixed(2), y1: cy.toFixed(2), x2: p.x.toFixed(2), y2: p.y.toFixed(2) } }));
    }
    scale.ticks.forEach((t) => {
      const r = (valueToPct(t, scale) / 100) * radius;
      if (r <= 0) return;
      svg.appendChild(makeSvg('polygon', ['fill-none', 'stroke-border/50'], { slot: 'chart-ring', attrs: { points: ringPoints(r) } }));
    });
  }

  // Category labels just past the web, anchored away from the circle.
  categories.forEach((c, i) => {
    if (!c) return;
    const angle = angleAt(i);
    const p = pointAt(i, radius + 12);
    const cos = Math.cos(angle);
    const anchor = Math.abs(cos) < 0.35 ? 'middle' : cos > 0 ? 'start' : 'end';
    svg.appendChild(svgText(c, p.x, p.y, { anchor }));
  });

  if (showAxes) radialTicks(svg, cx, cy, radius, scale, format);

  series.forEach((s, si) => {
    const points = s.data.map((v, k) => ({ ...pointAt(k, (valueToPct(v, scale) / 100) * radius), v, k }));
    const pointsAttr = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

    svg.appendChild(makeSvg('polygon', [fillClass(s.color)], { slot: 'chart-area', attrs: { points: pointsAttr, opacity: '0.2' } }));
    if (points.length > 1) {
      svg.appendChild(makeSvg('polygon', ['fill-none', strokeClass(s.color)], { slot: 'chart-segment', attrs: { points: pointsAttr, 'stroke-width': 2, 'stroke-linejoin': 'round' } }));
    }

    points.forEach((p) => {
      const dot = makeSvg('circle', [fillClass(s.color), 'stroke-card'], { slot: 'chart-point', attrs: { cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: DOT_RADIUS, 'stroke-width': 2 } });
      ctx.addListeners(
        attachHover(
          dot,
          { type: 'point', seriesName: s.name, seriesIndex: si, categoryIndex: p.k, label: categories[p.k] || s.name, value: p.v, color: s.color, showSeries: series.length > 1 },
          { tooltip: ctx.tooltip, root, format, enabled: tooltip }
        )
      );
      svg.appendChild(dot);
      // Up-right of the dot, on the opposite side of the axis from the ticks.
      if (showLabels) svg.appendChild(dataText(format(p.v), p.x + LABEL_GAP, p.y - DOT_RADIUS - LABEL_GAP, 'start'));
    });
  });

  out.appendChild(svg);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Category', ...series.map((s) => s.name)],
      categories.map((c, i) => [c || String(i + 1), ...series.map((s) => (typeof s.data[i] === 'number' && !Number.isNaN(s.data[i]) ? format(s.data[i]) : ''))])
    )
  );
  return out;
}

// Shared directive wiring: host setup, reactive config, full re-render on
// config change or container resize, teardown.
function defineChart(Alpine, name, render) {
  Alpine.directive(name, (el, { expression }, { effect, evaluateLater, cleanup }) => {
    el.classList.add('relative', 'flex', 'flex-col', 'w-full', 'h-full', 'min-h-0', 'text-foreground');
    el.setAttribute('data-slot', 'chart');

    const tooltip = createTooltip(el);
    let body = null;
    let listeners = [];
    let config = {};
    let drawnWidth = -1;
    let drawnHeight = -1;

    const clear = () => {
      listeners.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
      listeners = [];
      if (body) {
        body.remove();
        body = null;
      }
      tooltip.release();
    };

    const draw = () => {
      clear();
      const rect = el.getBoundingClientRect();
      drawnWidth = rect.width;
      drawnHeight = rect.height;
      const ctx = {
        tooltip,
        width: rect.width,
        height: rect.height,
        addListeners(records) {
          listeners.push(...records);
        },
      };

      // A press anywhere that isn't a data element (data elements stop propagation)
      // dismisses a pinned tooltip.
      const dismiss = () => tooltip.release();
      document.addEventListener('pointerdown', dismiss);
      listeners.push({ target: document, type: 'pointerdown', fn: dismiss });
      body = render(el, config, ctx);
      if (body) el.appendChild(body);
    };

    if (expression) {
      const getConfig = evaluateLater(expression);
      effect(() =>
        getConfig((cfg) => {
          config = cfg && typeof cfg === 'object' ? cfg : {};
          draw();
        })
      );
    } else {
      draw();
    }

    // SVG coordinates are pixels, so a resized container needs a redraw.
    if (typeof ResizeObserver !== 'undefined') {
      let frame = 0;
      const observer = new ResizeObserver(() => {
        const rect = el.getBoundingClientRect();
        if (rect.width === drawnWidth && rect.height === drawnHeight) return;
        if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame);
        if (typeof requestAnimationFrame === 'function') frame = requestAnimationFrame(() => draw());
        else draw();
      });
      observer.observe(el);
      cleanup(() => observer.disconnect());
    }

    cleanup(() => {
      clear();
      tooltip.remove();
    });
  });
}

export default function (Alpine) {
  defineChart(Alpine, 'h-chart-bar', renderBar);
  defineChart(Alpine, 'h-chart-line', renderLine);
  defineChart(Alpine, 'h-chart-scatter', (root, cfg, ctx) => renderLine(root, cfg, ctx, true));
  defineChart(Alpine, 'h-chart-pie', renderPie);
  defineChart(Alpine, 'h-chart-doughnut', (root, cfg, ctx) => renderPie(root, cfg, ctx, true));
  defineChart(Alpine, 'h-chart-polar-area', renderPolarArea);
  defineChart(Alpine, 'h-chart-radar', renderRadar);
}
