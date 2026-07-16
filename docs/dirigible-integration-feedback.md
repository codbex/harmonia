# Harmonia improvement requests - surfaced by the Eclipse Dirigible integration

These are **general Harmonia capabilities** - things any consumer of the library
benefits from - that the Eclipse Dirigible integration happened to surface while
migrating from Harmonia `1.24.2` to `2.1.0`. Both projects are built by the same
team, but each request below is written as a reusable framework feature: the
"Who it helps" line states the general case, and "Dirigible example" is only the
concrete motivator, not the sole beneficiary. Each item also lists the workaround
used today so it can be dropped once Harmonia absorbs the feature.

Ordered roughly by impact.

## 1. Charts: add `polarArea` and `radar` types

**Gap.** Native charts cover `bar`, `line`, `pie`, `doughnut`, `scatter`. There
is no `polarArea` and no `radar`.

**Who it helps.** Any consumer building dashboards/analytics: `polarArea` and
`radar` are part of the standard chart vocabulary (Chart.js, ECharts, D3 all have
them). Their absence forces those consumers to keep a second charting library
just for two chart types.

**Dirigible example.** Its report feature accepts
`bar | line | pie | doughnut | polarArea | radar`; the first four map onto
`x-h-chart-*`, but the last two have no equivalent, so Chart.js cannot be dropped.

**Workaround.** Chart migration to `x-h-chart-*` is deferred; Chart.js is kept.

**Proposal.** Add `x-h-chart-polar-area` and `x-h-chart-radar`, config-compatible
with the existing chart family (`series` + `labels`, theme-aware, accessible
figure + hidden data table).

## 2. Charts: an export / print API

**Gap.** Charts render as DOM/CSS (`createElement`, conic-gradient pie - no
`<canvas>`/`<svg>` root) and expose no way to get an image or drive printing.

**Who it helps.** Practically every charting consumer eventually needs "download
this chart as an image" or "print this report" - a share/export button is table
stakes for dashboards. With a canvas library it is `toDataURL()`; with Harmonia's
DOM charts there is currently no equivalent, so no consumer can offer it.

**Dirigible example.** Its report "Print" snapshots the chart with
`canvas.toDataURL('image/png')` into a print window - impossible to reproduce on
DOM/CSS charts.

**Workaround.** None - another reason the chart migration is deferred.

**Proposal.** A small export/print surface on the chart element, e.g.
`chart.toImage()` / `toDataURL()` (rasterize the rendered DOM) or a
`chart.print()` helper that opens a print view with the chart + Harmonia CSS.

## 3. Lucide plugin: react to a changing `data-lucide`

**Gap.** `x-h-lucide` reads the icon name **once** at init; a bound
`:data-lucide` whose value later changes does not re-render (the docs confirm this
and suggest re-creating the element).

**Who it helps.** Any reactive UI with state-driven icons - toggle buttons,
status indicators, expand/collapse chevrons, theme switchers. In a reactive
library the natural expectation is that binding the name updates the icon; the
read-once behaviour is a surprise every consumer has to learn and work around.

**Dirigible example.** A chart/table toggle, a play/pause control, and a theme
sun/moon each had to be rewritten as two `<svg x-h-lucide>` elements switched with
`x-show`, because a single bound `:data-lucide` froze on its first value.

**Workaround.** Two `<svg x-h-lucide>` + `x-show` per toggled icon (or `x-if`
re-creation).

**Proposal.** Make `:data-lucide` reactive (re-render on change), matching the
reactive `data-icon` that `x-h-icon` already supports, so one placeholder covers
the dynamic-name case.

## 4. Pickers: a first-class read-only / display mode

**Gap.** Date / Datetime / Time pickers have no documented read-only or
display-only mode; only a `disabled` inner input works (via `has-[input:disabled]`),
which greys the control out.

**Who it helps.** Any app with view-vs-edit states: detail pages, view-only forms,
permission-gated fields, audit/history screens. A `disabled` control signals
"unavailable" rather than "here is the value", so every consumer showing a
read-only date wants a cleaner display mode. (The same argument applies to the
other form controls, for consistency.)

**Dirigible example.** Generated forms have a preview mode where all fields are
non-editable; a greyed-out picker reads wrong there.

**Workaround.** `disabled` on the picker's inner `<input>`.

**Proposal.** A `readonly` (or `data-readonly`) mode that shows the formatted
value non-interactively without the disabled/greyed styling, ideally shared across
date / datetime / time and consistent with other controls.

## 5. Built-in icon set: a few common names are missing

**Gap.** The built-in `x-h-icon` set has no `inbox`, `eye`, or `upload`.

**Who it helps.** Any CRUD/app UI: an inbox/empty state, a row "preview/view"
action, an upload affordance are everyday chrome. Missing them forces consumers to
pull in Lucide (an extra dependency + bundle) just for basic icons.

**Dirigible example.** `upload` was mapped to the existing built-in `import`;
`inbox` and `eye` were rendered via Lucide instead.

**Proposal.** Add `inbox`, `eye` (and an explicit `upload` alias of `import`) to
the built-in set so common app chrome does not require Lucide.

---

## Not a gap (recorded to avoid re-investigation): i18next plugin

A consumer with its own catalog pipeline may reasonably not adopt
`harmonia-i18next` - this is **not** a Harmonia shortcoming, so no change is
requested. In Dirigible's case the platform i18n aggregates each project's
`i18n/<locale>/*.json` from a registry via an extension service, loads namespaces
on demand, and uses baked-in literals for the default language (skipping i18next
entirely). A generic `window.i18next` binder cannot own that pipeline, and both
driving `window.i18next` would collide. Noted only so the question is not reopened.
