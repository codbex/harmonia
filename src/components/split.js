import { findAncestorState } from '../common/ancestor';
export default function (Alpine) {
  Alpine.directive('h-split', (el, _, { cleanup, Alpine }) => {
    const panels = [];

    const state = Alpine.reactive({
      isHorizontal: el.getAttribute('data-orientation') === 'horizontal',
      isBorder: el.getAttribute('data-variant') === 'border',
    });

    const storageKey = el.getAttribute('data-key');

    const loadSizes = () => {
      if (!storageKey) return null;

      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    };

    let saveTimer = null;
    const SAVE_DELAY = 200;

    const saveSizes = () => {
      if (!storageKey) return;

      if (saveTimer) clearTimeout(saveTimer);

      saveTimer = setTimeout(() => {
        const usable = usableSize();
        if (usable <= 0) {
          // Skip when the container has no rendered size (hidden, zero-size, SSR/JSDOM).
          // Dividing by 0 would write NaN fractions to localStorage and break future restores.
          saveTimer = null;
          return;
        }
        const visible = panels.filter((p) => !p.hidden);
        const sizes = visible.map((p) => p.size / usable);
        localStorage.setItem(storageKey, JSON.stringify(sizes));
        saveTimer = null;
      }, SAVE_DELAY);
    };

    // Rendered width or height of a node along the split axis
    const measure = (node) => node.getBoundingClientRect()[state.isHorizontal ? 'width' : 'height'];

    // Total space available for panels - the container minus the gutters currently in the DOM
    // (hidden, gutterless and last panels have none).
    const usableSize = () => panels.reduce((total, p) => (p.gutter.parentElement ? total - measure(p.gutter) : total), measure(el));

    // Resolve a size spec (number, percentage string, or px string) to pixels
    // against an explicit total, so a percentage can be re-resolved on resize
    // without an extra usableSize() reflow (the caller already has the total).
    const resolveSpec = (value, total) => {
      if (value == null) return null;
      if (typeof value === 'number') return value;

      if (value.endsWith('%')) {
        return (parseFloat(value) / 100) * total;
      }

      return parseFloat(value);
    };

    // Public API: normalize a size value against the current usable size.
    const normalize = (value) => resolveSpec(value, usableSize());

    // Resets only on structural changes (panel added/removed) and when a panel's show
    // handler calls resetInit(). Intentionally NOT reset when a panel is hidden - the
    // redistribution loop already handles the layout without a full re-init, and
    // resetting would cause the init block to reload stale localStorage sizes.
    let initialized = false;

    const DELTA_ABS = 0.01;

    // Layout function: calculate and apply sizes to all visible panels
    const layout = () => {
      const visible = panels.filter((p) => !p.hidden);
      if (!visible.length) return;

      const total = usableSize();

      // Re-resolve each panel's %-based min/max (and rewrite its CSS floor/ceiling
      // vars) against the current total, so a shrinking container relaxes a stale
      // pixel floor instead of pinning the panel and overflowing.
      visible.forEach((p) => p.resolveBounds(total));

      if (!initialized) {
        initialized = true;

        const anyRestore = visible.some((p) => p.restoreFraction != null);

        if (anyRestore) {
          // One or more panels are being re-shown and have a restoreFraction set.
          // Handle all of them in one pass here rather than letting each show handler
          // manipulate siblings - that sequential approach causes each handler to see
          // the wrong sibling totals and progressively crushes the earlier panels.
          // Always-visible panels receive the remaining space proportional to their declaredSize.
          // This path bypasses localStorage so stale stored sizes don't override saved fractions.
          const restoreFractionSum = visible.reduce((sum, p) => sum + (p.restoreFraction ?? 0), 0);
          const remainingSpace = total * (1 - restoreFractionSum);
          const nonRestorePanels = visible.filter((p) => p.restoreFraction == null);
          const nonRestoreDeclaredTotal = nonRestorePanels.reduce((s, p) => s + (p.declaredSize ?? 0), 0);

          visible.forEach((p) => {
            if (p.restoreFraction != null) {
              p.size = p.restoreFraction * total;
              p.restoreFraction = null;
            } else if (nonRestoreDeclaredTotal > 0) {
              p.size = ((p.declaredSize ?? 0) / nonRestoreDeclaredTotal) * remainingSpace;
            } else {
              p.size = nonRestorePanels.length > 0 ? remainingSpace / nonRestorePanels.length : 0;
            }
          });
        } else {
          // Try restoring persisted sizes
          const stored = loadSizes();

          if (stored && stored.length === visible.length) {
            visible.forEach((p, i) => {
              p.size = stored[i] * total;
            });
          } else {
            // Panels with a declared size get set to it. Auto panels share what remains equally.
            const declared = visible.filter((p) => p.declaredSize != null);
            const declaredTotal = declared.reduce((sum, p) => sum + p.declaredSize, 0);
            const autoCount = visible.length - declared.length;
            const share = autoCount ? (total - declaredTotal) / autoCount : 0;

            visible.forEach((p) => {
              p.size = p.declaredSize ?? share;
            });
          }
        }

        // A panel collapsed before this pass (e.g. `data-collapse` set at init) stays at its min.
        visible.forEach((p) => {
          if (p.collapsed) p.size = p.min;
        });
      }

      // Ensure all panels have a starting size
      visible.forEach((p) => {
        if (p.size == null) {
          p.size = p.min;
        }

        p.size = Math.min(Math.max(p.size, p.min), p.max);
      });

      let delta = total - visible.reduce((sum, p) => sum + p.size, 0);

      // Panels allowed to change:
      let flexible = visible.filter((p) => {
        if (p.collapsed) return false;

        if (delta > 0) {
          return p.size < p.max;
        } else {
          return p.size > p.min;
        }
      });

      while (flexible.length && Math.abs(delta) > DELTA_ABS) {
        const share = delta / flexible.length;
        let consumed = 0;

        const nextFlexible = [];

        flexible.forEach((p) => {
          const proposed = p.size + share;
          const clamped = Math.min(Math.max(proposed, p.min), p.max);

          const actualChange = clamped - p.size;

          if (Math.abs(actualChange) > DELTA_ABS) {
            p.size = clamped;
            consumed += actualChange;
          }

          // Still can grow/shrink?
          if (delta > 0) {
            if (p.size < p.max) nextFlexible.push(p);
          } else {
            if (p.size > p.min) nextFlexible.push(p);
          }
        });

        delta -= consumed;
        flexible = nextFlexible;

        // If nothing was consumed, break to avoid infinite loop
        if (Math.abs(consumed) < DELTA_ABS) break;
      }

      visible.forEach((p) => p.apply());
      // Written here (inside the rAF callback, after sizes are final) so that
      // getBoundingClientRect in mutation handlers - which fire before rAF and can
      // reflect external DOM changes - never produces a stale denominator.
      if (total > 0)
        visible.forEach((p) => {
          p.savedFraction = p.size / total;
        });
    };

    let layoutFrame = null;

    const queueLayout = () => {
      if (layoutFrame) cancelAnimationFrame(layoutFrame);

      layoutFrame = requestAnimationFrame(() => {
        layout();
        saveSizes();
        layoutFrame = null;
      });
    };

    // Refresh gutter elements after add/remove or hide/show
    const refreshGutters = () => {
      const visible = panels.filter((p) => !p.hidden);
      const lastVisible = visible[visible.length - 1];
      panels.forEach((p) => p.setGutter(p === lastVisible));
    };

    el._h_split = {
      state,
      panels,
      addPanel(panel) {
        panels.push(panel);
        initialized = false;
        refreshGutters();
        queueLayout();
      },
      removePanel(panel) {
        const i = panels.indexOf(panel);
        if (i !== -1) panels.splice(i, 1);
        initialized = false;
        refreshGutters();
        queueLayout();
      },
      panelHidden() {
        // Does NOT reset `initialized` - see the comment on the `initialized` declaration.
        refreshGutters();
        queueLayout();
      },
      gutterHidden() {
        refreshGutters();
        queueLayout();
      },
      panelChange() {
        queueLayout();
      },
      resetInit() {
        // Called exclusively by show handlers so the next layout re-runs the init block
        // and picks up restoreFraction values deposited by one or more show handlers.
        initialized = false;
      },
      normalize,
      resolveSpec,
    };

    el.classList.add('flex', 'flex-1', 'min-w-0', 'min-h-0', 'data-[orientation=horizontal]:flex-row', 'data-[orientation=vertical]:flex-col');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-orientation') {
          state.isHorizontal = el.getAttribute('data-orientation') === 'horizontal';
          queueLayout();
        } else if (mutation.attributeName === 'data-variant') {
          state.isBorder = el.getAttribute('data-variant') === 'border';
          queueLayout();
        } else {
          panels.forEach((p) => p.setLocked());
        }
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-orientation', 'data-variant', 'data-locked'] });

    const containerObserver = new ResizeObserver(queueLayout);

    containerObserver.observe(el);

    cleanup(() => {
      if (layoutFrame) cancelAnimationFrame(layoutFrame);
      if (saveTimer) clearTimeout(saveTimer);
      containerObserver.disconnect();
      observer.disconnect();
    });
  });

  Alpine.directive('h-split-panel', (el, { original }, { effect, cleanup, Alpine }) => {
    const split = findAncestorState(Alpine, el, '_h_split');
    if (!split) {
      throw new Error(`${original} must be inside an split element`);
    }

    // The child combinator is used on purpose. With a descendant combinator, a panel of a nested
    // vertical split would also match the outer horizontal split and get a min-width
    // from the var that holds its min-height. See issue #118
    el.classList.add(
      'flex',
      'shrink',
      'grow-0',
      'box-border',
      'overflow-visible',
      '[[data-orientation=horizontal]>&]:min-w-(--h-split-panel-min)',
      '[[data-orientation=horizontal]>&]:max-w-(--h-split-panel-max)',
      '[[data-orientation=horizontal]>&]:min-h-0',
      '[[data-orientation=vertical]>&]:min-h-(--h-split-panel-min)',
      '[[data-orientation=vertical]>&]:max-h-(--h-split-panel-max)',
      '[[data-orientation=vertical]>&]:min-w-0'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'split-panel');

    let gutterless = el.getAttribute('data-gutterless') === 'true';

    const gutter = document.createElement('span');
    gutter.setAttribute('data-slot', 'split-gutter');
    gutter.setAttribute('role', 'separator');
    gutter.setAttribute('aria-label', el.getAttribute('data-gutter-label') || 'Resize panel');
    gutter.classList.add(
      'overflow-visible',
      'relative',
      'shrink-0',
      'touch-none',
      'outline-none',
      'hover:before:bg-primary-hover',
      'aria-disabled:pointer-events-none',
      'focus-visible:z-10',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'focus-visible:ring-ring/50',
      '[[data-orientation=horizontal]>&]:cursor-col-resize',
      '[[data-orientation=vertical]>&]:cursor-row-resize'
    );

    const borderClasses = [
      'bg-border',
      'hover:bg-primary-hover',
      'active:bg-primary-active',
      'before:absolute',
      'before:block',
      'before:bg-transparent',
      '[[data-orientation=horizontal]>&]:before:-translate-x-1/2',
      '[[data-orientation=horizontal]>&[data-edge=end]]:before:-translate-x-1',
      '[[data-orientation=horizontal]>&[data-edge=start]]:before:translate-x-0',
      '[[data-orientation=horizontal]>&]:before:left-1/2',
      '[[data-orientation=horizontal]>&]:w-px!',
      '[[data-orientation=horizontal]>&]:before:h-full',
      '[[data-orientation=horizontal]>&]:before:w-[calc(var(--spacing)*1)]',
      '[[data-orientation=vertical]>&]:before:-translate-y-1/2',
      '[[data-orientation=vertical]>&[data-edge=end]]:before:-translate-y-1',
      '[[data-orientation=vertical]>&[data-edge=start]]:before:translate-y-0',
      '[[data-orientation=vertical]>&]:before:top-1/2',
      '[[data-orientation=vertical]>&]:h-px!',
      '[[data-orientation=vertical]>&]:before:w-full',
      '[[data-orientation=vertical]>&]:before:h-[calc(var(--spacing)*1)]',
    ];
    const handleClasses = [
      'bg-transparent',
      'after:absolute',
      'after:block',
      'after:rounded-sm',
      'after:bg-background',
      'after:border-split-handle',
      'after:border-2',
      'after:shadow-xs',
      'after:top-1/2',
      'after:left-1/2',
      'after:-translate-x-1/2',
      'after:-translate-y-1/2',
      'hover:after:border-primary-hover',
      'active:after:border-primary-active',
      'before:absolute',
      'before:block',
      'before:top-1/2',
      'before:left-1/2',
      'before:-translate-x-1/2',
      'before:-translate-y-1/2',
      'before:rounded-sm',
      'before:from-transparent',
      'before:from-15%',
      'before:via-split-handle',
      'before:to-85%',
      'before:to-transparent',
      'hover:before:via-transparent',
      'active:before:bg-primary-active',
      'active:before:via-transparent',
      // Orientation classes
      '[[data-orientation=horizontal]>&]:before:h-full',
      '[[data-orientation=horizontal]>&]:before:w-0.5',
      '[[data-orientation=horizontal]>&]:before:bg-gradient-to-b',
      '[[data-orientation=vertical]>&]:before:h-0.5',
      '[[data-orientation=vertical]>&]:before:w-full',
      '[[data-orientation=vertical]>&]:before:bg-gradient-to-r',
      // Size classes
      '[[data-orientation=horizontal]>&]:w-4!',
      '[[data-orientation=horizontal]>&]:after:w-2.5',
      '[[data-orientation=horizontal]>&]:after:h-5',
      '[[data-orientation=vertical]>&]:h-4!',
      '[[data-orientation=vertical]>&]:after:w-5',
      '[[data-orientation=vertical]>&]:after:h-2.5',
    ];

    const initialSize = split._h_split.normalize(el.getAttribute('data-size'));

    // Raw min/max specs are kept so resolveBounds() can re-resolve a percentage
    // against the live container size on every layout pass (see resolveBounds).
    const minRaw = el.getAttribute('data-min');
    const maxRaw = el.getAttribute('data-max');

    let handleSize = 0;

    let layoutFrame = null;

    // The visible panel after this one, i.e. the one sharing this panel's gutter.
    const nextVisible = () => {
      const visible = split._h_split.panels.filter((p) => !p.hidden);
      return visible[visible.indexOf(panel) + 1];
    };

    const panel = {
      el,
      gutter,
      hidden: el.getAttribute('data-hidden') === 'true',
      declaredSize: initialSize,
      size: initialSize,
      // Placeholders until the first layout pass calls resolveBounds(total).
      min: 0,
      max: Infinity,
      collapsed: false,
      prevSize: null,
      prevHiddenFraction: null,
      savedFraction: null,
      restoreFraction: null,

      // Re-resolve %-based min/max against the current total and write the CSS
      // floor/ceiling vars from the fresh values. Called by the container's
      // layout() every pass so a percentage tracks the container as it resizes
      // (a fixed px baked in once would pin the panel and overflow on shrink).
      // Only min/max are responsive; declaredSize is resolved once at init and
      // thereafter superseded by persisted/dragged sizes (see the init block).
      // Note: if authored % mins sum to > 100% the flex min floor still wins and
      // content can overflow, but that is an authoring error and % already
      // degrades better than fixed px (it scales down proportionally).
      resolveBounds(total) {
        // The panel's own border and padding along the axis. Flex cannot render a box
        // smaller than that, so asking for one only makes flex-shrink take the remainder
        // out of the other panels.
        const style = getComputedStyle(el);
        const sides = split._h_split.state.isHorizontal ? ['Left', 'Right'] : ['Top', 'Bottom'];
        const frame = sides.reduce((sum, side) => sum + (parseFloat(style[`border${side}Width`]) || 0) + (parseFloat(style[`padding${side}`]) || 0), 0);
        this.min = Math.max(split._h_split.resolveSpec(minRaw, total) ?? 0, frame);
        this.max = split._h_split.resolveSpec(maxRaw, total) ?? Infinity;
        el.style.setProperty('--h-split-panel-min', `${this.min}px`);
        if (this.max < Infinity) {
          el.style.setProperty('--h-split-panel-max', `${this.max}px`);
        } else {
          // Remove (never leave stale) so max-w-(--h-split-panel-max) imposes nothing.
          el.style.removeProperty('--h-split-panel-max');
        }
      },

      apply() {
        el.style.flexBasis = `${this.size.toFixed(2)}px`;
        const next = nextVisible();
        if (!next) return;
        if (split._h_split.state.isBorder) {
          this.setHandleOffset(next);
        }
        this.setAriaValues(next);
      },

      setGutter(last) {
        if (this.hidden || gutterless || last) {
          // Cancel any pending deferred insertion so a stale rAF can't re-add the gutter
          // after removal (e.g. a panel is added, scheduling its insert, then a sibling is
          // hidden in the same frame making this the last visible panel before the insert fires).
          if (layoutFrame) {
            cancelAnimationFrame(layoutFrame);
            layoutFrame = null;
          }
          gutter.remove();
        } else {
          // Defer insertion so this rAF fires before the layout rAF. Both are scheduled
          // before queueLayout's rAF, so the gutter is in the DOM when layout calls
          // usableSize(), which reads its rendered dimensions via getBoundingClientRect.
          if (layoutFrame) cancelAnimationFrame(layoutFrame);
          layoutFrame = requestAnimationFrame(() => {
            el.after(gutter);
            handleSize = this.getHandleSize();
            layoutFrame = null;
          });
        }
      },

      setHandleOffset(next) {
        // In border variant the gutter's ::before pseudo-element extends outward beyond
        // the 1px gutter line to form a wider drag target. When an adjacent panel is
        // narrower than that reach, data-edge shifts the pseudo-element to avoid it
        // overflowing into the narrow panel.
        if (next.size < handleSize) {
          gutter.setAttribute('data-edge', 'end');
        } else if (this.size < handleSize) {
          gutter.setAttribute('data-edge', 'start');
        } else {
          gutter.removeAttribute('data-edge');
        }
      },

      // The separator's value is this panel's share of the space it splits with the
      // next panel, in percent. `min`/`max` are the shares the two panels' bounds allow.
      setAriaValues(next) {
        const pair = this.size + next.size;
        if (pair <= 0) return;
        const percent = (px) => String(Math.round((px / pair) * 100));
        gutter.setAttribute('aria-valuemin', percent(Math.max(this.min, pair - next.max)));
        gutter.setAttribute('aria-valuemax', percent(Math.min(this.max, pair - next.min)));
        gutter.setAttribute('aria-valuenow', percent(this.size));
      },

      getHandleSize() {
        if (split._h_split.state.isBorder) {
          const beforeStyle = window.getComputedStyle(gutter, '::before');
          return Number(beforeStyle[split._h_split.state.isHorizontal ? 'width' : 'height'].replace('px', '')) / 2;
        } else {
          return 0;
        }
      },

      // A gutter is disabled when either the split or the panel is locked. The
      // `aria-disabled:pointer-events-none` utility on the gutter blocks the pointer.
      setLocked() {
        const locked = split.getAttribute('data-locked') === 'true' || el.getAttribute('data-locked') === 'true';
        gutter.setAttribute('aria-disabled', locked);
        gutter.setAttribute('tabindex', locked ? '-1' : '0');
      },
    };

    const setVariant = () => {
      if (split._h_split.state.isBorder) {
        gutter.classList.remove(...handleClasses);
        gutter.classList.add(...borderClasses);
      } else {
        gutter.classList.remove(...borderClasses);
        gutter.classList.add(...handleClasses);
        gutter.removeAttribute('data-edge');
      }
      handleSize = panel.getHandleSize();
    };

    effect(setVariant);

    // The separator runs across the split axis. A horizontal split has a vertical divider.
    effect(() => {
      gutter.setAttribute('aria-orientation', split._h_split.state.isHorizontal ? 'vertical' : 'horizontal');
    });

    panel.setLocked();

    // Move the boundary shared with `next` by `delta` px (positive grows this panel).
    // Clamped so both panels stay within their `min`/`max`. `sizeA`/`sizeB` are the sizes
    // the delta is relative to - the drag-start snapshot for a drag and the current sizes
    // for a key press.
    const resize = (next, sizeA, sizeB, delta) => {
      const minDelta = Math.max(
        panel.min - sizeA, // how much this panel can shrink
        sizeB - next.max // how much the next panel can grow
      );
      const maxDelta = Math.min(
        panel.max - sizeA, // how much this panel can grow
        sizeB - next.min // how much the next panel can shrink
      );
      const clamped = Math.min(maxDelta, Math.max(minDelta, delta));

      panel.size = sizeA + clamped;
      next.size = sizeB - clamped;
      // Only a move that opens a collapsed panel un-collapses it, so a drag or key that
      // cannot move the boundary leaves `data-collapse` as the source of truth.
      if (clamped > 0) panel.collapsed = false;
      if (clamped < 0) next.collapsed = false;

      split._h_split.panelChange();
    };

    // Dragging
    let endDrag = null;

    const drag = (e) => {
      e.preventDefault();
      gutter.setPointerCapture(e.pointerId);

      const next = nextVisible();
      if (!next) return;

      const startPos = split._h_split.state.isHorizontal ? e.clientX : e.clientY;

      const startA = panel.size;
      const startB = next.size;

      const move = (e) => {
        const currentPos = split._h_split.state.isHorizontal ? e.clientX : e.clientY;
        resize(next, startA, startB, currentPos - startPos);
      };

      const up = () => {
        gutter.releasePointerCapture(e.pointerId);
        gutter.removeEventListener('pointermove', move);
        gutter.removeEventListener('pointerup', up);
        gutter.removeEventListener('pointercancel', up);
        endDrag = null;
      };

      endDrag = up;
      gutter.addEventListener('pointermove', move);
      gutter.addEventListener('pointerup', up);
      gutter.addEventListener('pointercancel', up);
    };

    gutter.addEventListener('pointerdown', drag);

    // Keyboard control. Arrows along the split axis move the boundary by a step (`Shift`
    // for a larger one), `Home`/`End` move it as far as the bounds allow it to.
    const KEY_STEP = 10;

    const onKeyDown = (e) => {
      if (gutter.getAttribute('aria-disabled') === 'true') return;
      const next = nextVisible();
      if (!next) return;

      const [back, forward] = split._h_split.state.isHorizontal ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
      const step = e.shiftKey ? KEY_STEP * 10 : KEY_STEP;
      let delta;
      switch (e.key) {
        case forward:
          delta = step;
          break;
        case back:
          delta = -step;
          break;
        case 'Home':
          delta = -Infinity;
          break;
        case 'End':
          delta = Infinity;
          break;
        default:
          return;
      }
      e.preventDefault();
      resize(next, panel.size, next.size, delta);
    };

    gutter.addEventListener('keydown', onKeyDown);

    const collapse = () => {
      if (panel.collapsed) return;

      // If the panel is already at its minimum, saving panel.size would make expand() restore
      // to the minimum - a no-op. Use declaredSize as a fallback for a meaningful target.
      panel.prevSize = panel.size > panel.min ? panel.size : panel.declaredSize;
      panel.size = panel.min;
      panel.collapsed = true;

      split._h_split.panelChange();
    };
    const expand = () => {
      if (!panel.collapsed) return;

      const target = panel.prevSize ?? panel.min;
      const delta = target - panel.size;

      const visible = split._h_split.panels.filter((p) => !p.hidden && p !== panel);

      let remaining = delta;

      for (const p of visible) {
        const available = p.size - p.min;
        const take = Math.min(available, remaining);

        p.size -= take;
        remaining -= take;

        if (remaining <= 0) break;
      }

      panel.size = target - remaining;
      panel.collapsed = false;

      split._h_split.panelChange();
    };

    const setState = () => el.classList.toggle('hidden', panel.hidden);

    setState();

    // Alpine applies `x-bind` before this directive runs, so an initial `data-collapse` is
    // already on the element and the observer below never sees it. Collapse before
    // registering, while `size` is still the declared one, so `expand()` restores to it
    // rather than to whatever an early layout pass handed the panel.
    if (el.getAttribute('data-collapse') === 'true') {
      collapse();
    }

    split._h_split.addPanel(panel);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-gutterless') {
          gutterless = el.getAttribute('data-gutterless') === 'true';
          split._h_split.gutterHidden();
        } else if (mutation.attributeName === 'data-hidden') {
          const newHidden = el.getAttribute('data-hidden') === 'true';
          if (!panel.hidden && newHidden) {
            // Snapshot the fraction from the last layout pass. The mutation handler itself
            // must not call usableSize() here because getBoundingClientRect reflects any
            // simultaneous external DOM changes (e.g. a sidebar hiding), producing a
            // denominator that doesn't match the panel.size values from the last layout.
            panel.prevHiddenFraction = panel.savedFraction;
          } else if (panel.hidden && !newHidden) {
            // Deposit the fraction and signal a re-init. Do not manipulate sibling sizes
            // here - if multiple panels are shown in the same tick, each handler runs
            // sequentially but the layout rAF fires only once after all of them complete,
            // seeing every restoreFraction at once and distributing correctly.
            if (panel.prevHiddenFraction != null) {
              panel.restoreFraction = panel.prevHiddenFraction;
            }
            split._h_split.resetInit();
          }
          panel.hidden = newHidden;
          setState();
          split._h_split.panelHidden();
        } else if (mutation.attributeName === 'data-locked') {
          panel.setLocked();
        } else {
          if (el.getAttribute('data-collapse') === 'true') {
            collapse();
          } else {
            expand();
          }
        }
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-hidden', 'data-locked', 'data-collapse', 'data-gutterless'] });

    cleanup(() => {
      if (layoutFrame) cancelAnimationFrame(layoutFrame);
      if (endDrag) endDrag();
      gutter.remove();
      gutter.removeEventListener('pointerdown', drag);
      gutter.removeEventListener('keydown', onKeyDown);
      split._h_split.removePanel(panel);
      observer.disconnect();
    });
  });
}
