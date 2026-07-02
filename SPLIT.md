# Split Component - Architecture Notes

This document explains the design decisions behind `src/components/split.js` for anyone working on or extending the component.

## Structure

Two Alpine.js directives work together:

- **`h-split`** - the container. Owns the shared `panels` array, runs the layout engine, and persists sizes to `localStorage`. All shared state lives here.
- **`h-split-panel`** - a single panel. Creates and manages its gutter element, holds per-panel state, and communicates back to the container through the `el._h_split` API object.

Data flows one way: each panel calls methods on `el._h_split`; the container never reaches into individual panels directly, it only iterates the `panels` array it owns.

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

1. Compute `total = usableSize()` - the container width/height minus the combined width/height of all in-DOM gutters.
2. Run the **init block** (once, or whenever `initialized === false`) to assign starting sizes.
3. Clamp each panel's size to its `[min, max]` bounds.
4. Compute `delta = total − sum(panel.size)`.
5. Distribute `delta` equally among panels that still have room to grow or shrink. Panels that hit a bound drop out of the distribution; the remaining delta is shared again among the rest. This repeats until `delta < 0.01px` or no flexible panel remains.
6. Call `panel.apply()` on each visible panel, writing the size to `el.style.flexBasis`.
7. Record each panel's fraction (`savedFraction = size / total`).

### When `initialized` resets

`initialized = false` forces the init block on the next layout. It resets when:

- A panel is **added or removed** (structural change; declared sizes must be re-assigned).
- `resetInit()` is called by a panel's **show handler** (panels being re-shown need their `restoreFraction` applied).

It does **not** reset when a panel is hidden. The redistribution loop in step 4-5 already handles the remaining visible panels without needing a full re-init, and resetting would cause the init block to load stale `localStorage` sizes.

### Init block paths

The init block runs three paths in order:

1. **Restore path** (`anyRestore = true`) - one or more panels are being shown after being hidden and have set their `restoreFraction`. Each restored panel gets `fraction × total` pixels. Always-visible panels receive the remaining space in proportion to their `declaredSize` values. This path bypasses `localStorage` so stale stored sizes do not override the saved fractions.

2. **Persisted path** - `data-key` is set and `localStorage` has a matching entry (same count as visible panels). Stored fractional sizes are applied directly.

3. **Declared path** - panels with `data-size` set get their `declaredSize`. Auto panels (no `data-size`) share the remainder equally.

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

## Dragging

The gutter receives `pointerdown`. On drag start the handler captures:

- The starting pointer position and the sizes of the panel and its next visible neighbour.
- `minDelta` / `maxDelta` - the range that satisfies both panels' `min`/`max` constraints simultaneously.

`pointermove` updates both panels by the clamped delta and calls `panelChange()` → `queueLayout()`. `pointerup` releases pointer capture and removes the listeners.

---

## Collapse / Expand

`collapse()` snaps the panel to its `min` and saves the pre-collapse size as `prevSize`. If the panel is already at `min` when collapsed, `prevSize` falls back to `declaredSize` so `expand()` has a meaningful restore target rather than restoring to `min` (a no-op).

`expand()` steals space from sibling panels in DOM order, taking as much as each sibling can give above its `min`, until the target size is reached or space runs out.

---

## Gutter Placement

Each panel owns a gutter element placed **after itself** in the DOM. The last panel (and hidden or `data-gutterless` panels) have their gutter removed. Insertion is deferred to a per-panel `requestAnimationFrame` so it runs before the layout rAF - both are scheduled before `queueLayout`'s rAF fires, preserving the insertion-before-layout ordering that `gutterSize()` depends on.

In the **border variant** the gutter is 1px wide/tall, and a `::before` pseudo-element extends outward to create a wider drag target. When an adjacent panel is narrower than half the pseudo-element's reach, the `data-edge` attribute shifts the pseudo-element to avoid it overflowing into the narrow panel.
