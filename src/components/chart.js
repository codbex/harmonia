import {
  DEFAULT_PALETTE,
  attachHover,
  buildDataTable,
  buildLegend,
  colorClass,
  colorVar,
  createTooltip,
  defaultFormat,
  dispatchChartEvent,
  make,
  niceScale,
  noData,
  normalizeSeries,
  normalizeSlices,
  tooltipContent,
  valueToPct,
} from '../common/chart';

// Mark the chart root as a labeled figure for assistive tech. The visual layers
// are decorative (`aria-hidden`); the real data is exposed via a hidden table.
// Respect an author-provided `aria-label`, only falling back to the default.
// Returns the effective label (used as the data table caption).
function labelChart(root, defaultLabel) {
  root.setAttribute('role', 'figure');
  if (!root.hasAttribute('aria-label')) root.setAttribute('aria-label', defaultLabel);
  return root.getAttribute('aria-label');
}

// Root font size used to express measured pixel lengths in rem.
const REM = 16;

// Size and rotate connecting segments (thin divs between two percent-coordinate
// points). Percent coordinates only translate to a length/angle once the
// container's pixel size is known, so callers rerun this on mount and resize.
function layoutSegments(container, segments) {
  const rect = container.getBoundingClientRect();
  segments.forEach(({ el, a, b }) => {
    const dx = ((b.x - a.x) / 100) * rect.width;
    const dy = ((b.y - a.y) / 100) * rect.height;
    const len = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    el.style.width = `${len / REM}rem`;
    el.style.transform = `rotate(${angle}deg)`;
  });
}

// Read the shared chart options that every chart type understands.
function commonOptions(cfg) {
  return {
    palette: Array.isArray(cfg.palette) && cfg.palette.length ? cfg.palette : DEFAULT_PALETTE,
    legend: cfg.legend !== false,
    tooltip: cfg.tooltip !== false,
    format: typeof cfg.valueFormat === 'function' ? cfg.valueFormat : defaultFormat,
  };
}

// Build the cartesian scaffold (axes + gridlines) shared by bar and line charts.
// Returns the grid wrapper and the plot area to fill with bars/points.
function buildCartesian({ scale, categories, horizontal, axes, gridlines, format }) {
  const grid = make('div', ['grid', 'flex-1', 'min-h-0', 'gap-1'], {
    style: { gridTemplateColumns: 'auto 1fr', gridTemplateRows: '1fr auto' },
  });

  const gutter = make('div', ['flex', 'shrink-0', 'text-xs', 'text-muted-foreground', 'overflow-hidden']);
  const plot = make('div', ['relative', 'min-h-0', 'min-w-0', 'border-l', 'border-b', 'border-border'], { slot: 'chart-plot' });
  const corner = make('div', []);
  const axisRow = make('div', ['flex', 'text-xs', 'text-muted-foreground', 'overflow-hidden']);

  const numericTicks = axes ? scale.ticks : [];

  if (!horizontal) {
    // Numeric axis on the left (top = max), categories along the bottom.
    gutter.classList.add('flex-col', 'justify-between', 'text-right', 'pr-1');
    [...numericTicks].reverse().forEach((t) => gutter.appendChild(make('div', ['leading-none'], { text: format(t) })));
    axisRow.classList.add('flex-row');
    categories.forEach((c) => axisRow.appendChild(make('div', ['flex-1', 'min-w-0', 'text-center', 'truncate', 'px-0.5'], { text: c, attrs: { title: c } })));
    if (gridlines) {
      scale.ticks.forEach((t) => {
        const line = make('div', ['absolute', 'left-0', 'right-0', 'border-t', 'border-border/50']);
        line.style.bottom = `${valueToPct(t, scale)}%`;
        plot.appendChild(line);
      });
    }
  } else {
    // Numeric axis along the bottom, categories down the left.
    gutter.classList.add('flex-col', 'justify-around', 'text-right', 'pr-1');
    categories.forEach((c) => gutter.appendChild(make('div', ['truncate'], { text: c, attrs: { title: c } })));
    axisRow.classList.add('flex-row', 'justify-between');
    numericTicks.forEach((t) => axisRow.appendChild(make('div', ['leading-none'], { text: format(t) })));
    if (gridlines) {
      scale.ticks.forEach((t) => {
        const line = make('div', ['absolute', 'top-0', 'bottom-0', 'border-l', 'border-border/50']);
        line.style.left = `${valueToPct(t, scale)}%`;
        plot.appendChild(line);
      });
    }
  }

  grid.append(gutter, plot, corner, axisRow);
  return { wrap: grid, plot };
}

// Position a bar along the value axis between two value-percentages.
function placeValue(bar, loPct, hiPct, horizontal) {
  const a = Math.min(loPct, hiPct);
  const size = Math.abs(hiPct - loPct);
  if (horizontal) {
    bar.style.left = `${a}%`;
    bar.style.width = `${size}%`;
  } else {
    bar.style.bottom = `${a}%`;
    bar.style.height = `${size}%`;
  }
}

// Position a bar along the cross (category) axis within its slot, leaving a small gap.
function placeCross(bar, startPct, sizePct, horizontal) {
  if (horizontal) {
    bar.style.top = `calc(${startPct}% + 0.125rem)`;
    bar.style.height = `calc(${sizePct}% - 0.25rem)`;
  } else {
    bar.style.left = `calc(${startPct}% + 0.125rem)`;
    bar.style.width = `calc(${sizePct}% - 0.25rem)`;
  }
}

// Place a value label just past the value-end of a bar (above/right for positive).
function placeBarLabel(label, horizontal, positive) {
  if (horizontal) {
    label.style.top = '50%';
    if (positive) {
      label.style.left = '100%';
      label.style.transform = 'translate(0.25rem, -50%)';
    } else {
      label.style.left = '0';
      label.style.transform = 'translate(calc(-100% - 0.25rem), -50%)';
    }
  } else {
    label.style.left = '50%';
    if (positive) {
      label.style.top = '0';
      label.style.transform = 'translate(-50%, calc(-100% - 0.25rem))';
    } else {
      label.style.bottom = '0';
      label.style.transform = 'translate(-50%, calc(100% + 0.25rem))';
    }
  }
}

// Place a value label inside a bar at its value-end. Used when the bar (nearly)
// reaches the plot edge, where an outside label would land on the axis labels.
function placeBarLabelInside(label, horizontal, positive) {
  if (horizontal) {
    label.style.top = '50%';
    if (positive) {
      label.style.right = '0';
      label.style.transform = 'translate(-0.25rem, -50%)';
    } else {
      label.style.left = '0';
      label.style.transform = 'translate(0.25rem, -50%)';
    }
  } else {
    label.style.left = '50%';
    if (positive) {
      label.style.top = '0';
      label.style.transform = 'translate(-50%, 0.25rem)';
    } else {
      label.style.bottom = '0';
      label.style.transform = 'translate(-50%, -0.25rem)';
    }
  }
}

// Round only the outer end of a stacked segment (the two ends where bars meet stay square).
function roundStackEnd(bar, end, horizontal) {
  if (horizontal) {
    bar.classList.add(...(end === 'min' ? ['rounded-tl-sm', 'rounded-bl-sm'] : ['rounded-tr-sm', 'rounded-br-sm']));
  } else {
    bar.classList.add(...(end === 'min' ? ['rounded-bl-sm', 'rounded-br-sm'] : ['rounded-tl-sm', 'rounded-tr-sm']));
  }
}

// Small data-label element drawn on top of a slice/bar (white text + shadow for contrast).
function onColorLabel(text) {
  const label = make('div', ['absolute', 'text-xs', 'font-medium', 'text-white', 'pointer-events-none', 'whitespace-nowrap'], { slot: 'chart-label', text });
  label.style.textShadow = '0 0.0625rem 0.125rem rgba(0, 0, 0, 0.6)';
  return label;
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

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2']);

  const values = series.flatMap((s) => s.data);
  if (!series.length || !values.length) {
    out.appendChild(noData());
    return out;
  }

  const catCount = Math.max(labels.length, ...series.map((s) => s.data.length));
  const categories = Array.from({ length: catCount }, (_, i) => (labels[i] != null ? String(labels[i]) : ''));
  const visual = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2'], { attrs: { 'aria-hidden': 'true' } });

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
  const basePct = valueToPct(0, scale);

  const { wrap, plot } = buildCartesian({ scale, categories, horizontal, axes: showAxes, gridlines: showGrid, format });

  const slots = make('div', ['absolute', 'inset-0', 'flex', horizontal ? 'flex-col' : 'flex-row']);
  for (let i = 0; i < catCount; i++) {
    const slot = make('div', ['relative', 'flex-1', horizontal ? 'w-full' : 'h-full']);
    let posCursor = 0;
    let negCursor = 0;
    const stackSegs = [];
    series.forEach((s, si) => {
      const v = s.data[i];
      if (typeof v !== 'number' || Number.isNaN(v)) return;
      const bar = make('div', ['absolute', colorClass(s.color)], { slot: 'chart-bar' });

      if (stacked) {
        let startVal;
        let endVal;
        if (v >= 0) {
          startVal = posCursor;
          endVal = posCursor + v;
          posCursor = endVal;
        } else {
          startVal = negCursor + v;
          endVal = negCursor;
          negCursor = startVal;
        }
        const lo = Math.min(valueToPct(startVal, scale), valueToPct(endVal, scale));
        const hi = Math.max(valueToPct(startVal, scale), valueToPct(endVal, scale));
        placeValue(bar, lo, hi, horizontal);
        placeCross(bar, 20, 60, horizontal);
        // Only the outer ends of the stack are rounded; skip zero-height segments.
        if (hi - lo > 0.001) stackSegs.push({ bar, lo, hi });
        // Stacked segments have no outside edge, so center the label inside if it fits.
        if (showLabels && Math.abs(valueToPct(v, scale) - basePct) >= 10) {
          const label = onColorLabel(format(v));
          label.classList.add('left-1/2', 'top-1/2', '-translate-x-1/2', '-translate-y-1/2');
          bar.appendChild(label);
        }
      } else {
        bar.classList.add('rounded-sm');
        const vPct = valueToPct(v, scale);
        placeValue(bar, basePct, vPct, horizontal);
        placeCross(bar, (si * 100) / series.length, 100 / series.length, horizontal);
        if (showLabels) {
          // A bar whose end (nearly) reaches the plot edge gets its label inside
          // the bar instead, so it cannot land on the axis labels.
          const clamped = v >= 0 ? Math.max(basePct, vPct) > 92 : Math.min(basePct, vPct) < 8;
          const label = clamped ? onColorLabel(format(v)) : make('div', ['absolute', 'text-xs', 'text-foreground', 'pointer-events-none', 'whitespace-nowrap'], { slot: 'chart-label', text: format(v) });
          (clamped ? placeBarLabelInside : placeBarLabel)(label, horizontal, v >= 0);
          bar.appendChild(label);
        }
      }

      ctx.addListeners(
        attachHover(
          bar,
          { type: 'bar', seriesName: s.name, seriesIndex: si, categoryIndex: i, label: categories[i] || s.name, value: v, color: s.color, showSeries: series.length > 1 },
          { tooltip: ctx.tooltip, root, format, enabled: tooltip }
        )
      );
      slot.appendChild(bar);
    });

    // Round the lowest and highest edges of the whole stack (a lone segment gets both).
    if (stackSegs.length) {
      let minIdx = 0;
      let maxIdx = 0;
      stackSegs.forEach((seg, k) => {
        if (seg.lo < stackSegs[minIdx].lo) minIdx = k;
        if (seg.hi > stackSegs[maxIdx].hi) maxIdx = k;
      });
      roundStackEnd(stackSegs[minIdx].bar, 'min', horizontal);
      roundStackEnd(stackSegs[maxIdx].bar, 'max', horizontal);
    }

    slots.appendChild(slot);
  }
  plot.appendChild(slots);
  visual.appendChild(wrap);

  if (legend) visual.appendChild(buildLegend(series.map((s) => ({ label: s.name, color: s.color }))));
  out.appendChild(visual);
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

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2']);

  const values = series.flatMap((s) => s.data);
  if (!series.length || !values.length) {
    out.appendChild(noData());
    return out;
  }

  const catCount = Math.max(labels.length, ...series.map((s) => s.data.length));
  const categories = Array.from({ length: catCount }, (_, i) => (labels[i] != null ? String(labels[i]) : ''));
  const scale = niceScale(Math.min(...values), Math.max(...values), tickCount);
  const visual = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2'], { attrs: { 'aria-hidden': 'true' } });

  const { wrap, plot } = buildCartesian({ scale, categories, horizontal: false, axes: showAxes, gridlines: showGrid, format });

  const xPct = (k, n) => (n === 1 ? 50 : (k / (n - 1)) * 100);
  const segments = [];

  series.forEach((s, si) => {
    const n = s.data.length;
    const points = s.data.map((v, k) => ({ x: xPct(k, n), y: 100 - valueToPct(v, scale), v, k }));

    if (!scatter) {
      for (let k = 0; k < points.length - 1; k++) {
        const seg = make('div', ['absolute', 'origin-left', colorClass(s.color)], { slot: 'chart-segment' });
        seg.style.left = `${points[k].x}%`;
        seg.style.top = `${points[k].y}%`;
        seg.style.height = '0.125rem';
        segments.push({ el: seg, a: points[k], b: points[k + 1] });
        plot.appendChild(seg);
      }
    }

    points.forEach((p) => {
      const dot = make('div', ['absolute', 'size-2', 'rounded-full', 'ring-2', 'ring-card', '-translate-x-1/2', '-translate-y-1/2', colorClass(s.color)], { slot: 'chart-point' });
      dot.style.left = `${p.x}%`;
      dot.style.top = `${p.y}%`;
      ctx.addListeners(
        attachHover(
          dot,
          { type: 'point', seriesName: s.name, seriesIndex: si, categoryIndex: p.k, label: categories[p.k] || s.name, value: p.v, color: s.color, showSeries: series.length > 1 },
          { tooltip: ctx.tooltip, root, format, enabled: tooltip }
        )
      );
      plot.appendChild(dot);

      if (showLabels) {
        const label = make('div', ['absolute', 'text-xs', 'text-foreground', 'pointer-events-none', 'whitespace-nowrap'], { slot: 'chart-label', text: format(p.v) });
        label.style.left = `${p.x}%`;
        label.style.top = `${p.y}%`;
        label.style.transform = 'translate(-50%, calc(-100% - 0.375rem))';
        plot.appendChild(label);
      }
    });
  });

  // Connecting segments need the plot's pixel size; recompute on mount and resize.
  if (!scatter) {
    const relayout = () => layoutSegments(plot, segments);
    ctx.onMount(relayout);
    ctx.observe(plot, relayout);
  }

  visual.appendChild(wrap);
  if (legend) visual.appendChild(buildLegend(series.map((s) => ({ label: s.name, color: s.color }))));
  out.appendChild(visual);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Category', ...series.map((s) => s.name)],
      categories.map((c, i) => [c || String(i + 1), ...series.map((s) => (typeof s.data[i] === 'number' && !Number.isNaN(s.data[i]) ? format(s.data[i]) : ''))])
    )
  );
  return out;
}

// Map a pointer event to a slice index from its angle around the pie center,
// or -1 when the pointer is outside the ring. The hit region is the actual
// drawn wedge, so even thin slices are reliably hoverable. `cutout` (0..1)
// excludes the doughnut hole; a range's own `radius` (0..1) caps its wedge
// (polar area slices each stop at a different distance from the center).
function sliceAtPointer(pie, ranges, event, cutout = 0) {
  const rect = pie.getBoundingClientRect();
  const radius = Math.min(rect.width, rect.height) / 2;
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const dist = Math.hypot(dx, dy);
  // Turn fraction measured clockwise from the top, matching the conic-gradient.
  let turn = (Math.atan2(dy, dx) + Math.PI / 2) / (2 * Math.PI);
  turn = ((turn % 1) + 1) % 1;
  const idx = ranges.findIndex((r) => turn >= r.start && turn < r.end);
  if (idx === -1) return -1;
  if (radius > 0 && (dist > radius * (ranges[idx].radius ?? 1) || dist < radius * cutout)) return -1;
  return idx;
}

// A floating-ui virtual reference at the cursor, so the tooltip follows the pointer.
function cursorReference(event) {
  const { clientX: x, clientY: y } = event;
  return { getBoundingClientRect: () => ({ width: 0, height: 0, x, y, top: y, bottom: y, left: x, right: x }) };
}

// Cursor-following hover/click handling shared by the pie-family charts.
// `hitTest` maps a pointer event to a slice index (-1 = miss); `ranges` holds
// the event payload per slice.
function attachSliceInteraction(target, ranges, hitTest, { root, ctx, enabled, format }) {
  let current = -1;
  const leave = () => {
    if (current === -1) return;
    ctx.tooltip.hide();
    dispatchChartEvent(root, 'chart-leave', ranges[current].payload);
    current = -1;
  };
  const move = (event) => {
    const idx = hitTest(event);
    if (idx === -1) {
      leave();
      return;
    }
    if (idx !== current) {
      if (current !== -1) dispatchChartEvent(root, 'chart-leave', ranges[current].payload);
      current = idx;
      dispatchChartEvent(root, 'chart-hover', ranges[idx].payload);
    }
    if (enabled && !ctx.tooltip.pinned) ctx.tooltip.show(cursorReference(event), tooltipContent(ranges[idx].payload, format));
  };
  // Stop the press from reaching the document dismiss handler when it lands on a slice.
  const down = (event) => {
    if (hitTest(event) !== -1) event.stopPropagation();
  };
  const click = (event) => {
    const idx = hitTest(event);
    if (idx === -1) return;
    if (enabled) {
      ctx.tooltip.show(cursorReference(event), tooltipContent(ranges[idx].payload, format));
      ctx.tooltip.pin();
    }
    dispatchChartEvent(root, 'chart-click', ranges[idx].payload);
  };
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerleave', leave);
  target.addEventListener('pointerdown', down);
  target.addEventListener('click', click);
  ctx.addListeners([
    { target, type: 'pointermove', fn: move },
    { target, type: 'pointerleave', fn: leave },
    { target, type: 'pointerdown', fn: down },
    { target, type: 'click', fn: click },
  ]);
}

function renderPie(root, cfg, ctx, doughnut = false) {
  const { palette, legend, tooltip, format } = commonOptions(cfg);
  const slices = normalizeSlices(cfg, palette);
  const ariaLabel = labelChart(root, doughnut ? 'Doughnut chart' : 'Pie chart');

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2']);

  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (!slices.length || total <= 0) {
    out.appendChild(noData());
    return out;
  }

  const showLabels = cfg.dataLabels !== false;
  const outsideLabels = cfg.labelPosition === 'outside';
  // Hole radius as a fraction of the pie radius (0 = solid pie).
  const cutout = doughnut ? Math.min(0.9, Math.max(0.2, typeof cfg.cutout === 'number' ? cfg.cutout : 0.6)) : 0;

  const visual = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2'], { attrs: { 'aria-hidden': 'true' } });
  const box = make('div', ['flex', 'flex-1', 'min-h-0', 'items-center', 'justify-center']);
  // `disc` is the circle-sized positioning context (holds labels); `pie` paints
  // the gradient and owns hover. Keeping labels off `pie` means the doughnut
  // mask never clips them.
  const disc = make('div', ['relative', 'rounded-full', 'aspect-square', 'h-full', 'max-h-full', 'max-w-full']);
  const pie = make('div', ['absolute', 'inset-0', 'rounded-full', 'cursor-pointer'], { slot: 'chart-pie' });
  disc.appendChild(pie);
  // Outside labels need room around the circle, so shrink the disc within its box.
  if (showLabels && outsideLabels) {
    disc.style.maxWidth = '80%';
    disc.style.maxHeight = '80%';
  }

  const stops = [];
  const ranges = [];
  let acc = 0;
  slices.forEach((s, i) => {
    const start = acc / total;
    acc += s.value;
    const end = acc / total;
    stops.push(`${colorVar(s.color)} ${(start * 100).toFixed(4)}% ${(end * 100).toFixed(4)}%`);
    ranges.push({ start, end, payload: { type: 'slice', seriesName: undefined, seriesIndex: 0, categoryIndex: i, label: s.label, value: s.value, color: s.color, showSeries: false } });

    // Percentage label for the slice (skip slivers too small to fit one).
    const pct = (s.value / total) * 100;
    if (showLabels && pct >= 5) {
      const angle = ((start + end) / 2) * 2 * Math.PI - Math.PI / 2;
      // 50% = center, 50 = the slice edge. Inside labels sit mid-ring; outside
      // labels sit just past the edge (the shrunken disc leaves room).
      const insideOffset = cutout > 0 ? ((cutout + 1) / 2) * 50 : 31;
      const offset = outsideLabels ? 58 : insideOffset;
      const label = outsideLabels ? make('div', ['absolute', 'text-xs', 'font-medium', 'text-foreground', 'pointer-events-none', 'whitespace-nowrap'], { slot: 'chart-label', text: `${s.value}%` }) : onColorLabel(`${s.value}%`);
      label.classList.add('-translate-x-1/2', '-translate-y-1/2');
      label.style.left = `${50 + Math.cos(angle) * offset}%`;
      label.style.top = `${50 + Math.sin(angle) * offset}%`;
      disc.appendChild(label);
    }
  });
  pie.style.background = `conic-gradient(${stops.join(', ')})`;
  if (cutout > 0) {
    // Punch a transparent hole with a radial mask (closest-side = the pie radius).
    const stop = (cutout * 100).toFixed(2);
    const mask = `radial-gradient(circle closest-side, transparent ${stop}%, #000 ${stop}%)`;
    pie.style.webkitMask = mask;
    pie.style.mask = mask;
  }

  // Angle-based hover detection on the whole pie (no per-slice overlay elements).
  attachSliceInteraction(pie, ranges, (event) => sliceAtPointer(pie, ranges, event, cutout), { root, ctx, enabled: tooltip, format });

  box.appendChild(disc);
  visual.appendChild(box);
  if (legend) visual.appendChild(buildLegend(slices.map((s) => ({ label: s.label, color: s.color }))));
  out.appendChild(visual);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Segment', 'Value'],
      slices.map((s) => [s.label, format(s.value)])
    )
  );
  return out;
}

// Center-anchored square canvas for the radial charts (radar, polar area).
// Percent geometry is only circular in a square box, which the disc guarantees.
// `maxSize` shrinks the disc within its box, leaving room for labels placed on
// or past the circle's edge so they stay inside the chart element.
function buildDisc(maxSize) {
  const box = make('div', ['flex', 'flex-1', 'min-h-0', 'items-center', 'justify-center']);
  const disc = make('div', ['relative', 'aspect-square', 'h-full', 'max-h-full', 'max-w-full']);
  if (maxSize) {
    disc.style.maxWidth = maxSize;
    disc.style.maxHeight = maxSize;
  }
  box.appendChild(disc);
  return { box, disc };
}

// A point on the disc: `angle` in radians, `r` as a percentage of the box
// (0 = center, 50 = the circle's edge, beyond 50 = outside the circle).
function discPoint(angle, r) {
  return { x: 50 + Math.cos(angle) * r, y: 50 + Math.sin(angle) * r };
}

// Numeric tick labels along the upward vertical of a radial chart. The halo
// shadow in the theme background keeps them readable on colored slices and fills.
function radialTicks(disc, ticks, scale, format) {
  ticks.forEach((t) => {
    const label = make('div', ['absolute', 'text-xs', 'text-muted-foreground', 'pointer-events-none', 'whitespace-nowrap', 'leading-none', 'font-medium'], { slot: 'chart-tick', text: format(t) });
    label.style.left = '50%';
    label.style.top = `${50 - valueToPct(t, scale) / 2}%`;
    // Left of the axis, keeping clear of the data drawn on the top spoke.
    label.style.transform = 'translate(calc(-100% - 0.25rem), -50%)';
    disc.appendChild(label);
  });
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

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2']);

  const values = series.flatMap((s) => s.data);
  if (!series.length || !values.length) {
    out.appendChild(noData());
    return out;
  }

  const catCount = Math.max(labels.length, ...series.map((s) => s.data.length));
  const categories = Array.from({ length: catCount }, (_, i) => (labels[i] != null ? String(labels[i]) : ''));
  const scale = niceScale(Math.min(0, ...values), Math.max(0, ...values), tickCount);
  const visual = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2'], { attrs: { 'aria-hidden': 'true' } });
  const { box, disc } = buildDisc('80%');

  // Category `i` sits at this angle, starting at the top and going clockwise.
  const angleAt = (i) => (i / catCount) * 2 * Math.PI - Math.PI / 2;
  const segments = [];
  const addSegment = (a, b, classes, slotName) => {
    const seg = make('div', ['absolute', 'origin-left', ...classes], { slot: slotName });
    seg.style.left = `${a.x}%`;
    seg.style.top = `${a.y}%`;
    segments.push({ el: seg, a, b });
    disc.appendChild(seg);
    return seg;
  };
  const gridClasses = ['border-t', 'border-border/50', 'pointer-events-none'];

  if (showGrid) {
    // Spokes from the center to the outer ring, then a polygonal web ring per tick.
    for (let i = 0; i < catCount; i++) {
      addSegment(discPoint(angleAt(i), 0), discPoint(angleAt(i), 50), gridClasses, 'chart-spoke');
    }
    scale.ticks.forEach((t) => {
      const r = valueToPct(t, scale) / 2;
      if (r <= 0) return;
      for (let i = 0; i < catCount; i++) {
        addSegment(discPoint(angleAt(i), r), discPoint(angleAt((i + 1) % catCount), r), gridClasses, 'chart-ring');
      }
    });
  }

  // Category labels just past the circle's edge (the shrunken disc leaves room).
  categories.forEach((c, i) => {
    if (!c) return;
    const p = discPoint(angleAt(i), 58);
    const label = make('div', ['absolute', 'text-xs', 'text-muted-foreground', 'pointer-events-none', 'whitespace-nowrap', '-translate-x-1/2', '-translate-y-1/2'], { text: c, attrs: { title: c } });
    label.style.left = `${p.x}%`;
    label.style.top = `${p.y}%`;
    disc.appendChild(label);
  });

  if (showAxes) radialTicks(disc, scale.ticks, scale, format);

  series.forEach((s, si) => {
    const points = s.data.map((v, k) => ({ ...discPoint(angleAt(k), valueToPct(v, scale) / 2), v, k }));

    // Translucent area fill; percent-based clip-path needs no measurement.
    const fill = make('div', ['absolute', 'inset-0', 'pointer-events-none', colorClass(s.color)], { slot: 'chart-area' });
    fill.style.clipPath = `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(', ')})`;
    fill.style.opacity = '0.2';
    disc.appendChild(fill);

    // Outline segments closing the loop, drawn like line-chart segments.
    if (points.length > 1) {
      points.forEach((p, k) => {
        // Two points would draw the same closing edge twice.
        if (points.length === 2 && k === 1) return;
        const seg = addSegment(p, points[(k + 1) % points.length], [colorClass(s.color)], 'chart-segment');
        seg.style.height = '0.125rem';
      });
    }

    points.forEach((p) => {
      const dot = make('div', ['absolute', 'size-2', 'rounded-full', 'ring-2', 'ring-card', '-translate-x-1/2', '-translate-y-1/2', colorClass(s.color)], { slot: 'chart-point' });
      dot.style.left = `${p.x}%`;
      dot.style.top = `${p.y}%`;
      ctx.addListeners(
        attachHover(
          dot,
          { type: 'point', seriesName: s.name, seriesIndex: si, categoryIndex: p.k, label: categories[p.k] || s.name, value: p.v, color: s.color, showSeries: series.length > 1 },
          { tooltip: ctx.tooltip, root, format, enabled: tooltip }
        )
      );
      disc.appendChild(dot);

      if (showLabels) {
        const label = make('div', ['absolute', 'text-xs', 'text-foreground', 'pointer-events-none', 'whitespace-nowrap'], { slot: 'chart-label', text: format(p.v) });
        label.style.left = `${p.x}%`;
        label.style.top = `${p.y}%`;
        // Up-right of the dot, on the opposite side of the axis from the ticks.
        label.style.transform = 'translate(0.375rem, calc(-100% - 0.125rem))';
        disc.appendChild(label);
      }
    });
  });

  // Web rings, spokes, and outlines need the disc's pixel size; recompute on mount and resize.
  if (segments.length) {
    const relayout = () => layoutSegments(disc, segments);
    ctx.onMount(relayout);
    ctx.observe(disc, relayout);
  }

  visual.appendChild(box);
  if (legend) visual.appendChild(buildLegend(series.map((s) => ({ label: s.name, color: s.color }))));
  out.appendChild(visual);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Category', ...series.map((s) => s.name)],
      categories.map((c, i) => [c || String(i + 1), ...series.map((s) => (typeof s.data[i] === 'number' && !Number.isNaN(s.data[i]) ? format(s.data[i]) : ''))])
    )
  );
  return out;
}

function renderPolarArea(root, cfg, ctx) {
  const { palette, legend, tooltip, format } = commonOptions(cfg);
  const showAxes = cfg.axes !== false;
  const showGrid = cfg.gridlines !== false;
  const showLabels = cfg.dataLabels !== false;
  const tickCount = Number.isInteger(cfg.tickCount) ? cfg.tickCount : 5;
  const slices = normalizeSlices(cfg, palette);
  const ariaLabel = labelChart(root, 'Polar area chart');

  const out = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2']);

  if (!slices.length) {
    out.appendChild(noData());
    return out;
  }

  const scale = niceScale(0, Math.max(...slices.map((s) => s.value)), tickCount);
  const visual = make('div', ['flex', 'flex-col', 'flex-1', 'min-h-0', 'gap-2'], { attrs: { 'aria-hidden': 'true' } });
  const { box, disc } = buildDisc('92%');
  disc.classList.add('cursor-pointer');

  // Every slice spans an equal angle; the value sets how far it reaches.
  const step = 1 / slices.length;
  const ranges = [];
  slices.forEach((s, i) => {
    const start = i * step;
    const sizePct = valueToPct(s.value, scale);
    const slice = make('div', ['absolute', 'rounded-full', '-translate-x-1/2', '-translate-y-1/2', 'pointer-events-none'], { slot: 'chart-polar-slice' });
    slice.style.left = '50%';
    slice.style.top = '50%';
    slice.style.width = `${sizePct}%`;
    slice.style.height = `${sizePct}%`;
    slice.style.background = `conic-gradient(from ${start.toFixed(4)}turn, ${colorVar(s.color)} 0 ${step.toFixed(4)}turn, transparent 0)`;
    // Slightly translucent so the grid rings stay visible through the slices.
    slice.style.opacity = '0.75';
    disc.appendChild(slice);
    ranges.push({ start, end: start + step, radius: sizePct / 100, payload: { type: 'slice', seriesName: undefined, seriesIndex: 0, categoryIndex: i, label: s.label, value: s.value, color: s.color, showSeries: false } });

    // Value label at mid-angle, mid-radius (skip slices too small to fit one).
    if (showLabels && sizePct >= 25) {
      const angle = (start + step / 2) * 2 * Math.PI - Math.PI / 2;
      const p = discPoint(angle, sizePct / 4 + 6);
      const label = onColorLabel(format(s.value));
      label.classList.add('-translate-x-1/2', '-translate-y-1/2');
      label.style.left = `${p.x}%`;
      label.style.top = `${p.y}%`;
      disc.appendChild(label);
    }
  });

  if (showGrid) {
    // Concentric rings above the slices (visible through their translucency).
    scale.ticks.forEach((t) => {
      const sizePct = valueToPct(t, scale);
      if (sizePct <= 0) return;
      const ring = make('div', ['absolute', 'rounded-full', 'border', 'border-border/50', '-translate-x-1/2', '-translate-y-1/2', 'pointer-events-none'], { slot: 'chart-ring' });
      ring.style.left = '50%';
      ring.style.top = '50%';
      ring.style.width = `${sizePct}%`;
      ring.style.height = `${sizePct}%`;
      disc.appendChild(ring);
    });
  }

  if (showAxes) radialTicks(disc, scale.ticks, scale, format);

  attachSliceInteraction(disc, ranges, (event) => sliceAtPointer(disc, ranges, event), { root, ctx, enabled: tooltip, format });

  visual.appendChild(box);
  if (legend) visual.appendChild(buildLegend(slices.map((s) => ({ label: s.label, color: s.color }))));
  out.appendChild(visual);
  out.appendChild(
    buildDataTable(
      ariaLabel,
      ['Segment', 'Value'],
      slices.map((s) => [s.label, format(s.value)])
    )
  );
  return out;
}

// Shared directive wiring: host setup, reactive config, full re-render, teardown.
function defineChart(Alpine, name, render) {
  Alpine.directive(name, (el, { expression }, { effect, evaluateLater, cleanup }) => {
    el.classList.add('relative', 'flex', 'flex-col', 'gap-2', 'w-full', 'h-full', 'min-h-0', 'text-foreground');
    el.setAttribute('data-slot', 'chart');

    const tooltip = createTooltip(el);
    let body = null;
    let listeners = [];
    let observers = [];

    const clear = () => {
      listeners.forEach(({ target, type, fn }) => target.removeEventListener(type, fn));
      listeners = [];
      observers.forEach((o) => o.disconnect());
      observers = [];
      if (body) {
        body.remove();
        body = null;
      }
      tooltip.release();
    };

    const draw = (cfg) => {
      clear();
      const mountFns = [];
      const ctx = {
        tooltip,
        addListeners(records) {
          listeners.push(...records);
        },
        onMount(fn) {
          mountFns.push(fn);
        },
        observe(target, fn) {
          if (typeof ResizeObserver === 'undefined') return;
          const observer = new ResizeObserver(fn);
          observer.observe(target);
          observers.push(observer);
        },
      };

      // A press anywhere that isn't a data element (data elements stop propagation)
      // dismisses a pinned tooltip.
      const dismiss = () => tooltip.release();
      document.addEventListener('pointerdown', dismiss);
      listeners.push({ target: document, type: 'pointerdown', fn: dismiss });
      body = render(el, cfg && typeof cfg === 'object' ? cfg : {}, ctx);
      if (body) {
        el.appendChild(body);
        mountFns.forEach((fn) => fn());
      }
    };

    if (expression) {
      const getConfig = evaluateLater(expression);
      effect(() => getConfig((cfg) => draw(cfg)));
    } else {
      draw({});
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
