# Split Component - Architecture Notes

This document explains the design decisions behind `src/components/split.js` for anyone working on or extending the component.

## Structure

Two Alpine.js directives work together:

- **`h-split`** - the container. Owns the shared `panels` array, runs the layout engine, and persists sizes to `localStorage`. All shared state lives here.
- **`h-split-panel`** - a single panel. Creates and manages its gutter element, holds per-panel state, owns its own `min`/`max`/CSS-var resolution via `resolveBounds()`, and communicates back to the container through the `el._h_split` API object.

Data flows one way: each panel calls methods on `el._h_split`. The container never reaches into a panel's internals, it only iterates the `panels` array it owns and, per layout pass, calls each panel's own `resolveBounds(total)` so the panel re-derives its bounds against the total the container computed (the percentage specs and CSS vars stay panel-side).

```
h-split (container)
│  panels[]        ← pushed/popped by h-split-panel
│  layout()        ← the sizing engine
│  el._h_split     ← API surface exposed to panels
│
├── h-split-panel (panel A)
│     panel object  ← registered via addPanel()
│     gutter element
│
└── h-split-panel (panel B)
      panel object
      gutter element
```

---

## Layout Engine

Panel sizes are stored as absolute pixel values (`panel.size`). The engine runs inside a `requestAnimationFrame` callback (scheduled by `queueLayout`) and follows these steps every time:

1. Compute `total = usableSize()` - the container width/height minus the combined width/height of the gutters currently in the DOM. Counting real gutters rather than `visible - 1` keeps a `data-gutterless` panel from reserving space it does not use.
2. Call `panel.resolveBounds(total)` on each visible panel to re-resolve any percentage `min`/`max` against the current `total` and rewrite the `--h-split-panel-min` / `--h-split-panel-max` CSS vars. This runs every pass so a percentage bound tracks the container as it resizes (a fixed px baked in once would pin the panel and overflow on shrink).
3. Run the **init block** (once, or whenever `initialized === false`) to assign starting sizes.
4. Clamp each panel's size to its `[min, max]` bounds.
5. Compute `delta = total − sum(panel.size)`.
6. Distribute `delta` equally among panels that still have room to grow or shrink. Panels that hit a bound drop out of the distribution. The remaining delta is shared again among the rest. This repeats until `delta < 0.01px` or no flexible panel remains.
7. Call `panel.apply()` on each visible panel, writing the size to `el.style.flexBasis`.
8. Record each panel's fraction (`savedFraction = size / total`).

### When `initialized` resets

`initialized = false` forces the init block on the next layout. It resets when:

- A panel is **added or removed** (structural change, declared sizes must be re-assigned).
- `resetInit()` is called by a panel's **show handler** (panels being re-shown need their `restoreFraction` applied).

It does **not** reset when a panel is hidden. The redistribution loop in step 5-6 already handles the remaining visible panels without needing a full re-init, and resetting would cause the init block to load stale `localStorage` sizes.

### Init block paths

The init block runs three paths in order:

1. **Restore path** (`anyRestore = true`) - one or more panels are being shown after being hidden and have set their `restoreFraction`. Each restored panel gets `fraction × total` pixels. Always-visible panels receive the remaining space in proportion to their `declaredSize` values. This path bypasses `localStorage` so stale stored sizes do not override the saved fractions.

2. **Persisted path** - `data-key` is set and `localStorage` has a matching entry (same count as visible panels). Stored fractional sizes are applied directly.

3. **Declared path** - panels with `data-size` set get their `declaredSize`. Auto panels (no `data-size`) share the remainder equally.

Whichever path ran, a panel that is already `collapsed` is then pinned to its `min`. This is what lets `data-collapse="true"` work at init - the panel directive calls `collapse()` just before registering, while `size` is still the declared one (so `prevSize` is a meaningful restore target rather than whatever an early layout pass handed a lone panel), and the init block must not hand the panel its declared or persisted size back.

There is no per-panel "was dragged" flag. Dragging and keyboard resizing only rewrite `size`, so a structural re-init returns every panel to its declared size, dragged or not.

### Percentage resolution: `min`/`max` vs `declaredSize`

`data-min`, `data-max`, and `data-size` all accept a percentage. They are resolved to pixels differently, on purpose:

- **`min` / `max` are re-resolved every layout pass** by `resolveBounds(total)` (step 2), because they drive the panel's CSS `min-width` / `max-width` floor and ceiling. If they were baked to pixels once at the initial width, shrinking the container below that stale floor would pin the panel and overflow horizontally (with a matching stale flat when growing). Keeping the raw spec string (`minRaw` / `maxRaw`) and re-deriving on resize makes a percentage track the container. The resolved minimum is also floored at the panel's own border plus padding along the axis, read from computed style on the same pass, so the layout never asks the browser for a box it cannot render and flex-shrink never takes the remainder out of the other panels.
- **`declaredSize` is resolved once at init** and thereafter superseded by persisted (`localStorage`) or dragged sizes. It only seeds the init block and the collapse fallback - the per-pass delta loop never reads it. Re-resolving it on every resize would fight the persisted-fraction restore path, so it is intentionally left static. Every percentage split in the repo also sets `data-key`, so persistence is the normal path, not an edge case.

Residual limitation: if authored percentage `min`s sum to more than 100% of the container, the flex min floor still wins and content can overflow. That is an authoring error - a percentage already degrades better than a fixed px (it scales down proportionally), so no runtime handling is added.

---

## Hide / Show and the Three-Fraction Fields

The most subtle part of the component. Three fields on each panel object cooperate across different timing boundaries:

| Field                | Written by                   | Read by               | Purpose                                                                               |
| -------------------- | ---------------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| `savedFraction`      | `layout()` after every apply | Hide handler          | Stable snapshot of the panel's proportion from the last consistent layout pass.       |
| `prevHiddenFraction` | Hide handler                 | Show handler          | Carries the fraction across the hidden period so it can be deposited on show.         |
| `restoreFraction`    | Show handler                 | `layout()` init block | Tells the next layout pass what fraction this panel should occupy. Cleared after use. |

### Why `savedFraction` is written by the layout, not a mutation handler

`getBoundingClientRect()` (called inside `containerSize()` and `gutterSize()`) forces a synchronous reflow. By the time a `MutationObserver` fires, all synchronous DOM changes in the same JS task have already been applied - including changes to _external_ elements such as a sidebar being hidden. The container may therefore have a different size than it had during the last layout, and any fraction computed in the mutation handler would be wrong relative to the sizes that were actually applied.

Writing `savedFraction` inside the rAF layout callback means the container size and the panel sizes are always from the same consistent state.

### Why multiple panels can be shown at once without conflict

Each show handler only deposits a `restoreFraction` and calls `resetInit()`. It does **not** touch any sibling sizes. All show handlers for panels that were hidden in the same JS task complete before the next rAF fires. The single layout pass then sees every `restoreFraction` simultaneously and distributes all panels in one atomic operation, regardless of how many are being restored or in what order their handlers ran.

---

## Resizing: drag and keyboard

Both input paths go through one `resize(next, sizeA, sizeB, delta)` function on the panel. It computes `minDelta` / `maxDelta` - the range that satisfies both this panel's and the next visible panel's `min`/`max` at once - clamps `delta` into it, writes both sizes, clears `collapsed` on the panel the move opened (a positive `clamped` opens this panel, a negative one the next) and calls `panelChange()` -> `queueLayout()`.

- **Drag.** The gutter receives `pointerdown`, captures the pointer and snapshots the starting pointer position and both sizes. Every `pointermove` calls `resize` with the delta from that snapshot, so the clamp is always relative to the drag start. `pointerup` and `pointercancel` release the capture and remove the listeners. The panel's `cleanup` ends an in-progress drag the same way so no listener outlives the directive.
- **Keyboard.** The gutter is a tab stop (`tabindex="0"`) unless locked. `keydown` maps the arrows along the split axis (`Left`/`Right` for a horizontal split, `Up`/`Down` for a vertical one) to a 10px step, 100px with `Shift`, and `Home`/`End` to `-Infinity`/`Infinity`, which the clamp turns into the furthest reachable position. Each press calls `resize` relative to the current sizes.

### Locking

`setLocked()` reads both `data-locked` on the split and on the panel, and writes the result to the gutter as `aria-disabled` and `tabindex` (`-1` when locked). The `aria-disabled:pointer-events-none` utility on the gutter blocks the pointer, and the key handler bails on `aria-disabled`. It runs once at init - Alpine applies `x-bind` before custom directives, so a bound `:data-locked` is already on the element and the observers alone would miss it - and again from the split's and the panel's attribute observers.

---

## Collapse / Expand

`collapse()` snaps the panel to its `min` and saves the pre-collapse size as `prevSize`. If the panel is already at `min` when collapsed, `prevSize` falls back to `declaredSize` so `expand()` has a meaningful restore target rather than restoring to `min` (a no-op). A panel collapsed at init through `data-collapse="true"` has no earlier size, so without a `data-size` its `expand()` target is its `min`.

`expand()` steals space from sibling panels in DOM order, taking as much as each sibling can give above its `min`, until the target size is reached or space runs out.

A drag or key press that cannot move the boundary, such as pushing a collapsed panel further shut, leaves `collapsed` alone, so `data-collapse` stays the source of truth and clearing it still expands. A move that does open the panel clears the flag while the attribute still reads `true`, and only the next `collapse()` re-arms `expand()`.

---

## Gutter Placement

Each panel owns a gutter element placed **after itself** in the DOM. The last panel (and hidden or `data-gutterless` panels) have their gutter removed. Insertion is deferred to a per-panel `requestAnimationFrame` so it runs before the layout rAF - both are scheduled before `queueLayout`'s rAF fires, preserving the insertion-before-layout ordering that `gutterSize()` depends on.

In the **border variant** the gutter is 1px wide/tall, and a `::before` pseudo-element extends outward to create a wider drag target. When an adjacent panel is narrower than half the pseudo-element's reach, the `data-edge` attribute shifts the pseudo-element to avoid it overflowing into the narrow panel. That reach (`handleSize`) is measured from the pseudo-element's computed style when the gutter is inserted and again whenever the variant changes. Switching to the handle variant also clears `data-edge`.

### Separator semantics

The gutter is a `role="separator"` with `aria-orientation` across the split axis (a horizontal split has a vertical divider) and an accessible name from `data-gutter-label` on its panel, defaulting to "Resize panel". `apply()` also writes `aria-valuenow` / `aria-valuemin` / `aria-valuemax`: the panel's share, in percent, of the space it divides with the next visible panel, and the smallest and largest share the two panels' bounds allow.
