# Harmonia improvement requests - from the Eclipse Dirigible integration

Feedback gathered while migrating the Eclipse Dirigible platform (its application
shells and code-generation templates) from Harmonia `1.24.2` to `2.1.0`. Both
projects are built by the same team; this list captures the framework gaps the
migration hit, with the workaround used and a concrete proposal, so Harmonia
itself can absorb them and the workarounds can be dropped later.

Ordered roughly by impact.

## 1. Charts: add `polarArea` and `radar` types

**Gap.** Native charts cover `bar`, `line`, `pie`, `doughnut`, `scatter`. There
is no `polarArea` and no `radar`.

**Why it matters.** Dirigible's report/chart feature (and its intent DSL) accepts
`bar | line | pie | doughnut | polarArea | radar`. The first four map cleanly onto
`x-h-chart-*`, but `polarArea`/`radar` have no native equivalent, so the platform
cannot fully drop its Chart.js dependency - a mixed Chart.js + Harmonia setup is
the only alternative, which defeats the migration.

**Workaround.** Migration of the report charts to `x-h-chart-*` is **blocked/deferred**;
Chart.js is retained for now.

**Proposal.** Add `x-h-chart-polar-area` (or `x-h-chart-polararea`) and
`x-h-chart-radar`, config-compatible with the existing chart family
(`series` + `labels`, theme-aware, accessible figure + hidden table).

## 2. Charts: an export / print API

**Gap.** Charts render as DOM/CSS (`createElement`, conic-gradient pie - no
`<canvas>`/`<svg>` root) and expose no way to get an image or drive printing.

**Why it matters.** The platform's report "Print" snapshots the chart with
`canvas.toDataURL('image/png')` into a print window. With DOM/CSS charts there is
no canvas to snapshot, so that print path cannot be reproduced when migrating to
`x-h-chart-*`.

**Workaround.** None yet - another reason the chart migration is deferred.

**Proposal.** A small export/print surface on the chart element, e.g. a
`chart.toImage()` / `toDataURL()` method (rasterize the rendered DOM) or a
`chart.print()` helper that opens a print view with the chart + Harmonia CSS.

## 3. Lucide plugin: react to a changing `data-lucide`

**Gap.** `x-h-lucide` reads the icon name **once** at init. A bound
`:data-lucide` whose value later changes does not re-render (the tip in the docs
confirms this and suggests re-creating the element).

**Why it matters.** Icons that flip at runtime (a chart/table toggle button, a
play/pause control, a theme sun/moon) are natural with a single bound
`:data-lucide` - but that silently freezes on the first value.

**Workaround.** Every toggled icon was rewritten as **two `<svg x-h-lucide>`
elements switched with `x-show`** (or re-created via `x-if`). Correct, but verbose
and easy to get wrong (an `<i x-h-lucide>` with another directive throws).

**Proposal.** Make `:data-lucide` reactive - re-render the icon when the bound
name changes - matching the behaviour `x-h-icon` already has for its reactive
`data-icon`. That would let a single placeholder cover the dynamic-name case.

## 4. Pickers: a first-class read-only / display mode

**Gap.** Date / Datetime / Time pickers have no documented read-only or
display-only mode. Only a `disabled` inner input works (via the
`has-[input:disabled]` styling), which greys the control out.

**Why it matters.** Generated forms have a preview / read-only mode where every
field is shown non-editable. A greyed-out (`disabled`) picker reads as "unavailable"
rather than "this is the value" - a plain read-only display of the formatted value
would be clearer.

**Workaround.** `disabled` is set on the picker's inner `<input>` in read-only
generation.

**Proposal.** A `readonly` (or `data-readonly`) mode that renders the formatted
value non-interactively without the disabled/greyed styling - ideally shared
across date / datetime / time (and consistent with other form controls).

## 5. Built-in icon set: a few common names are missing

**Gap.** The built-in `x-h-icon` set has no `inbox`, `eye`, or `upload`.

**Why it matters.** These are common in CRUD/app chrome (an inbox empty state, a
row "preview/view" action, an upload affordance).

**Workaround.** `upload` was mapped to the existing built-in `import`; `inbox` and
`eye` were rendered via Lucide instead.

**Proposal.** Consider adding `inbox`, `eye` (and an explicit `upload` alias of
`import`) to the built-in icon set, so common app chrome does not need Lucide.

---

## Not a gap (recorded to avoid re-investigation): i18next plugin

The platform did **not** adopt `harmonia-i18next`, but this is **not** a Harmonia
shortcoming - the platform i18n is deeply tied to its own catalog model (it
aggregates each project's `i18n/<locale>/*.json` from the registry via an
extension service, loads namespaces on demand, and uses baked English literals for
the default language, skipping i18next entirely). A generic `window.i18next`
binder cannot own that pipeline, and both driving `window.i18next` would collide.
No change requested; noted so the question is not reopened.
