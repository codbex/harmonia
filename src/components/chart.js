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
        placeValue(bar, basePct, valueToPct(v, scale), horizontal);
        placeCross(bar, (si * 100) / series.length, 100 / series.length, horizontal);
        if (showLabels) {
          const label = make('div', ['absolute', 'text-xs', 'text-foreground', 'pointer-events-none', 'whitespace-nowrap'], { slot: 'chart-label', text: format(v) });
          placeBarLabel(label, horizontal, v >= 0);
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
    const layoutSegments = () => {
      const rect = plot.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      segments.forEach(({ el, a, b }) => {
        const dx = ((b.x - a.x) / 100) * w;
        const dy = ((b.y - a.y) / 100) * h;
        const len = Math.hypot(dx, dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        el.style.width = `${len / REM}rem`;
        el.style.transform = `rotate(${angle}deg)`;
      });
    };
    ctx.onMount(layoutSegments);
    ctx.observe(plot, layoutSegments);
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
// excludes the doughnut hole.
function sliceAtPointer(pie, ranges, event, cutout = 0) {
  const rect = pie.getBoundingClientRect();
  const radius = Math.min(rect.width, rect.height) / 2;
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const dist = Math.hypot(dx, dy);
  if (radius > 0 && (dist > radius || dist < radius * cutout)) return -1;
  // Turn fraction measured clockwise from the top, matching the conic-gradient.
  let turn = (Math.atan2(dy, dx) + Math.PI / 2) / (2 * Math.PI);
  turn = ((turn % 1) + 1) % 1;
  return ranges.findIndex((r) => turn >= r.start && turn < r.end);
}

// A floating-ui virtual reference at the cursor, so the tooltip follows the pointer.
function cursorReference(event) {
  const { clientX: x, clientY: y } = event;
  return { getBoundingClientRect: () => ({ width: 0, height: 0, x, y, top: y, bottom: y, left: x, right: x }) };
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
  let current = -1;
  const leave = () => {
    if (current === -1) return;
    ctx.tooltip.hide();
    dispatchChartEvent(root, 'chart-leave', ranges[current].payload);
    current = -1;
  };
  const move = (event) => {
    const idx = sliceAtPointer(pie, ranges, event, cutout);
    if (idx === -1) {
      leave();
      return;
    }
    if (idx !== current) {
      if (current !== -1) dispatchChartEvent(root, 'chart-leave', ranges[current].payload);
      current = idx;
      dispatchChartEvent(root, 'chart-hover', ranges[idx].payload);
    }
    if (tooltip && !ctx.tooltip.pinned) ctx.tooltip.show(cursorReference(event), tooltipContent(ranges[idx].payload, format));
  };
  // Stop the press from reaching the document dismiss handler when it lands on a slice.
  const down = (event) => {
    if (sliceAtPointer(pie, ranges, event, cutout) !== -1) event.stopPropagation();
  };
  const click = (event) => {
    const idx = sliceAtPointer(pie, ranges, event, cutout);
    if (idx === -1) return;
    if (tooltip) {
      ctx.tooltip.show(cursorReference(event), tooltipContent(ranges[idx].payload, format));
      ctx.tooltip.pin();
    }
    dispatchChartEvent(root, 'chart-click', ranges[idx].payload);
  };
  pie.addEventListener('pointermove', move);
  pie.addEventListener('pointerleave', leave);
  pie.addEventListener('pointerdown', down);
  pie.addEventListener('click', click);
  ctx.addListeners([
    { target: pie, type: 'pointermove', fn: move },
    { target: pie, type: 'pointerleave', fn: leave },
    { target: pie, type: 'pointerdown', fn: down },
    { target: pie, type: 'click', fn: click },
  ]);

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
}
