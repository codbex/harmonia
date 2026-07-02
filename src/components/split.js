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

    const sizeProp = () => (state.isHorizontal ? 'width' : 'height');

    const containerSize = () => (state.isHorizontal ? el.getBoundingClientRect().width : el.getBoundingClientRect().height);

    const gutterSize = () => {
      const panel = panels.find((p) => p.gutter.parentElement);
      if (panel) {
        return panel.gutter.getBoundingClientRect()[sizeProp()] ?? 0;
      }
      return 0;
    };

    // Total space available for panels (excluding hidden panels and gutters)
    const usableSize = () => {
      const visiblePanels = panels.filter((p) => !p.hidden);
      const gutters = Math.max(0, visiblePanels.length - 1);
      return containerSize() - gutters * gutterSize();
    };

    // Normalize a size value: number, percentage string, or null
    const normalize = (value) => {
      if (value == null) return null;
      if (typeof value === 'number') return value;

      if (value.endsWith('%')) {
        return (parseFloat(value) / 100) * usableSize();
      }

      return parseFloat(value);
    };

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
              p.explicit = true;
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
              p.size = stored[i] * usableSize();
              p.explicit = true;
            });
          } else {
            // Compute the total size of explicitly sized panels
            const explicitTotal = visible.filter((p) => p.explicit).reduce((sum, p) => sum + p.declaredSize, 0);

            // Compute & distribute remaining space for auto panels
            const autoPanels = visible.filter((p) => !p.explicit);
            const remaining = total - explicitTotal;
            const share = autoPanels.length ? remaining / autoPanels.length : 0;

            visible.forEach((p) => {
              if (p.explicit) {
                p.size = p.declaredSize;
              } else {
                p.size = share;
              }

              p.size = Math.min(Math.max(p.size ?? share, p.min), p.max);
            });
          }
        }
      }

      // Ensure all panels have a starting size
      visible.forEach((p) => {
        if (p.size == null) {
          p.size = p.min ?? 0;
        }

        p.size = Math.min(Math.max(p.size, p.min), p.max);
      });

      let currentTotal = visible.reduce((sum, p) => sum + p.size, 0);
      let delta = total - currentTotal;

      if (Math.abs(delta) < DELTA_ABS) {
        visible.forEach((p) => p.apply());
        if (total > 0)
          visible.forEach((p) => {
            p.savedFraction = p.size / total;
          });
        return;
      }

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
      const lastPanelIndex = panels.length - 1;
      panels.forEach((p, i) => p.setGutter(i === lastPanelIndex));
    };

    el._h_split = {
      state,
      panels,
      addPanel(panel) {
        panels.push(panel);
        if (panel.size == null) {
          panel.size = null; // keep null
        }
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
      saveSizes,
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
          panels.forEach((p) => p.setLocked(el.getAttribute('data-locked') === 'true'));
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

    el.classList.add(
      'flex',
      'shrink',
      'grow-0',
      'box-border',
      'overflow-visible',
      '[[data-orientation=horizontal]_&]:min-w-(--h-split-panel-min)',
      '[[data-orientation=horizontal]_&]:max-w-(--h-split-panel-max)',
      '[[data-orientation=horizontal]_&]:min-h-0',
      '[[data-orientation=vertical]_&]:min-h-(--h-split-panel-min)',
      '[[data-orientation=vertical]_&]:max-h-(--h-split-panel-max)',
      '[[data-orientation=vertical]_&]:min-w-0'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'split-panel');

    let gutterless = el.getAttribute('data-gutterless') === 'true';

    const gutter = document.createElement('span');
    gutter.setAttribute('data-slot', 'split-gutter');
    gutter.setAttribute('aria-disabled', el.getAttribute('data-locked') === 'true');
    gutter.setAttribute('tabindex', '-1');
    gutter.setAttribute('role', 'separator');
    gutter.classList.add(
      'overflow-visible',
      'relative',
      'shrink-0',
      'touch-none',
      'bg-border',
      'outline-none',
      'hover:bg-primary-hover',
      'active:bg-primary-active',
      'hover:before:bg-primary-hover',
      'aria-disabled:pointer-events-none',
      '[[data-orientation=horizontal]>&]:cursor-col-resize',
      '[[data-orientation=vertical]>&]:cursor-row-resize'
    );

    const borderClasses = [
      'bg-border',
      'outline-none',
      'hover:bg-primary-hover',
      'active:bg-primary-active',
      'before:absolute',
      'before:block',
      'before:bg-transparent',
      'hover:before:bg-primary-hover',
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
      'outline-none',
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
      'hover:before:bg-primary-hover',
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

    const setVariant = () => {
      if (split._h_split.state.isBorder) {
        gutter.classList.remove(...handleClasses);
        gutter.classList.add(...borderClasses);
      } else {
        gutter.classList.remove(...borderClasses);
        gutter.classList.add(...handleClasses);
      }
    };

    setVariant();

    effect(setVariant);

    const initialSize = split._h_split.normalize(el.getAttribute('data-size'));

    let handleSize = 0;

    let layoutFrame = null;

    const panel = {
      el,
      gutter,
      hidden: el.getAttribute('data-hidden') === 'true',
      declaredSize: initialSize,
      size: initialSize,
      explicit: initialSize != null,
      min: split._h_split.normalize(el.getAttribute('data-min')) ?? 0,
      max: split._h_split.normalize(el.getAttribute('data-max')) ?? Infinity,
      collapsed: false,
      prevSize: null,
      prevHiddenFraction: null,
      savedFraction: null,
      restoreFraction: null,

      apply() {
        el.style.flexBasis = `${this.size.toFixed(2)}px`;
        if (split._h_split.state.isBorder) {
          this.setHandleOffset();
        }
      },

      setGutter(last) {
        if (this.hidden || gutterless || last) {
          gutter.remove();
        } else {
          // Defer insertion so this rAF fires before the layout rAF. Both are scheduled
          // before queueLayout's rAF, so the gutter is in the DOM when layout calls
          // gutterSize(), which reads its rendered dimensions via getBoundingClientRect.
          if (layoutFrame) cancelAnimationFrame(layoutFrame);
          layoutFrame = requestAnimationFrame(() => {
            el.after(gutter);
            handleSize = this.getHandleSize();
            layoutFrame = null;
          });
        }
      },

      setHandleOffset() {
        // In border variant the gutter's ::before pseudo-element extends outward beyond
        // the 1px gutter line to form a wider drag target. When an adjacent panel is
        // narrower than that reach, data-edge shifts the pseudo-element to avoid it
        // overflowing into the narrow panel.
        const panels = split._h_split.panels.filter((p) => !p.hidden);
        const index = panels.indexOf(panel);
        const next = panels[index + 1];
        if (!next) return;
        if (next.size < handleSize) {
          gutter.setAttribute('data-edge', 'end');
        } else if (this.size < handleSize) {
          gutter.setAttribute('data-edge', 'start');
        } else {
          gutter.removeAttribute('data-edge');
        }
      },

      getHandleSize() {
        if (split._h_split.state.isBorder) {
          const beforeStyle = window.getComputedStyle(gutter, '::before');
          return Number(beforeStyle[split._h_split.state.isHorizontal ? 'width' : 'height'].replace('px', '')) / 2;
        } else {
          return 0;
        }
      },

      setLocked(locked = false) {
        const panelLocked = el.getAttribute('data-locked') === 'true';
        gutter.setAttribute('aria-disabled', locked || panelLocked);
        if (locked) {
          gutter.classList.add('pointer-events-none');
        } else if (panelLocked) {
          gutter.classList.add('pointer-events-none');
        } else {
          gutter.classList.remove('pointer-events-none');
        }
      },
    };

    el.style.setProperty('--h-split-panel-min', `${panel.min}px`);
    if (panel.max < Infinity) {
      el.style.setProperty('--h-split-panel-max', `${panel.max}px`);
    }

    split._h_split.addPanel(panel);

    // Dragging
    const drag = (e) => {
      e.preventDefault();
      gutter.setPointerCapture(e.pointerId);

      const panels = split._h_split.panels.filter((p) => !p.hidden);
      const index = panels.indexOf(panel);
      const next = panels[index + 1];
      if (!next) return;

      const startPos = split._h_split.state.isHorizontal ? e.clientX : e.clientY;

      const startA = panel.size;
      const startB = next.size;

      const minDelta = Math.max(
        panel.min - startA, // how much panel A can shrink
        startB - next.max // how much panel B can grow
      );

      const maxDelta = Math.min(
        panel.max - startA, // how much panel A can grow
        startB - next.min // how much panel B can shrink
      );

      const move = (e) => {
        const currentPos = split._h_split.state.isHorizontal ? e.clientX : e.clientY;
        const delta = currentPos - startPos;

        const clamped = Math.min(maxDelta, Math.max(minDelta, delta));

        panel.size = startA + clamped;
        next.size = startB - clamped;

        panel.explicit = false;

        if (panel.collapsed) {
          panel.collapsed = false;
        }
        if (next.collapsed) {
          next.collapsed = false;
        }

        split._h_split.panelChange();
      };

      const up = () => {
        gutter.releasePointerCapture(e.pointerId);
        gutter.removeEventListener('pointermove', move);
        gutter.removeEventListener('pointerup', up);
      };

      gutter.addEventListener('pointermove', move);
      gutter.addEventListener('pointerup', up);
    };

    gutter.addEventListener('pointerdown', drag);

    const collapse = () => {
      if (panel.collapsed) return;

      // If the panel is already at its minimum, saving panel.size would make expand() restore
      // to the minimum - a no-op. Use declaredSize as a fallback for a meaningful target.
      panel.prevSize = panel.size > (panel.min ?? 0) ? panel.size : panel.declaredSize;
      panel.size = panel.min ?? 0;
      panel.collapsed = true;
      panel.explicit = true;

      split._h_split.panelChange();
    };
    const expand = () => {
      if (!panel.collapsed) return;

      const target = panel.prevSize ?? panel.min ?? 0;
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
      panel.explicit = true;

      split._h_split.panelChange();
    };

    const setState = () => {
      if (panel.hidden) {
        el.classList.add('hidden');
      } else {
        el.classList.remove('hidden');
      }
      split._h_split.panelHidden();
    };

    setState();

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
      gutter.remove();
      gutter.removeEventListener('pointerdown', drag);
      split._h_split.removePanel(panel);
      observer.disconnect();
    });
  });
}
