export default function (Alpine) {
  Alpine.directive('h-split', (el, {}, { cleanup, Alpine }) => {
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
        const visible = panels.filter((p) => !p.hidden);
        const sizes = visible.map((p) => p.size / usableSize());
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

    const usableSize = () => {
      const visiblePanels = panels.filter((p) => !p.hidden);
      const gutters = Math.max(0, visiblePanels.length - 1);
      return containerSize() - gutters * gutterSize();
    };

    const normalize = (value) => {
      if (value == null) return null;
      if (typeof value === 'number') return value;

      if (value.endsWith('%')) {
        return (parseFloat(value) / 100) * usableSize();
      }

      return parseFloat(value);
    };

    let initialized = false;

    const DELTA_ABS = 0.01;

    const layout = () => {
      const visible = panels.filter((p) => !p.hidden);
      if (!visible.length) return;

      const total = usableSize();

      if (!initialized) {
        initialized = true;

        const visible = panels.filter((p) => !p.hidden);

        // Try restoring persisted sizes
        const stored = loadSizes();

        if (stored && stored.length === visible.length) {
          visible.forEach((p, i) => {
            p.size = stored[i] * usableSize();
            p.explicit = true;
          });
        } else {
          const explicitTotal = visible.filter((p) => p.explicit).reduce((sum, p) => sum + p.declaredSize, 0);

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

      // Ensure all panels have a starting size
      visible.forEach((p) => {
        if (p.size == null) {
          p.size = p.min ?? 0;
        }

        // Clamp to bounds
        p.size = Math.min(Math.max(p.size, p.min), p.max);
      });

      let currentTotal = visible.reduce((sum, p) => sum + p.size, 0);
      let delta = total - currentTotal;

      if (Math.abs(delta) < DELTA_ABS) {
        visible.forEach((p) => p.apply());
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
      saveSizes();
    };

    let layoutFrame = null;

    const queueLayout = () => {
      if (layoutFrame) cancelAnimationFrame(layoutFrame);

      layoutFrame = requestAnimationFrame(() => {
        layout();
        layoutFrame = null;
      });
    };

    const refreshGutters = () => {
      panels.forEach((p, i) => p.setGutter(i === panels.length - 1));
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
        initialized = false;
        refreshGutters();
        queueLayout();
      },
      panelChange() {
        queueLayout();
        saveSizes();
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
    const split = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_split'));
    if (!split) {
      throw new Error(`${original} must be inside an split element`);
    }

    el.classList.add('flex', 'shrink', 'grow-0', 'box-border', 'min-w-0', 'min-h-0', 'overflow-visible');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'split-panel');

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
      '[[data-orientation=horizontal]>&]:before:left-1/2',
      '[[data-orientation=horizontal]>&]:!w-px',
      '[[data-orientation=horizontal]>&]:before:h-full',
      '[[data-orientation=horizontal]>&]:before:w-[calc(var(--spacing)*1)]',
      '[[data-orientation=vertical]>&]:before:-translate-y-1/2',
      '[[data-orientation=vertical]>&]:before:top-1/2',
      '[[data-orientation=vertical]>&]:!h-px',
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
      '[[data-orientation=horizontal]>&]:!w-4',
      '[[data-orientation=horizontal]>&]:after:w-2.5',
      '[[data-orientation=horizontal]>&]:after:h-5',
      '[[data-orientation=vertical]>&]:!h-4',
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

      apply() {
        el.style.flexBasis = `${this.size.toFixed(2)}px`;
      },

      setGutter(last) {
        if (this.hidden || last) {
          gutter.remove();
        } else if (!gutter.parentElement) {
          el.after(gutter);
        }
      },

      setLocked(locked = false) {
        const isLocked = el.getAttribute('data-locked') === 'true' || locked;
        gutter.setAttribute('aria-disabled', isLocked);
      },
    };

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

        panel.apply();
        next.apply();
      };

      const up = () => {
        gutter.releasePointerCapture(e.pointerId);
        gutter.removeEventListener('pointermove', move);
        gutter.removeEventListener('pointerup', up);
        split._h_split.saveSizes();
      };

      gutter.addEventListener('pointermove', move);
      gutter.addEventListener('pointerup', up);
    };

    gutter.addEventListener('pointerdown', drag);

    const collapse = () => {
      if (panel.collapsed) return;

      panel.prevSize = panel.size;
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

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-hidden') {
          panel.hidden = el.getAttribute('data-hidden') === 'true';
          if (panel.hidden) {
            el.classList.add('hidden');
          } else {
            el.classList.remove('hidden');
          }
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

    observer.observe(el, { attributes: true, attributeFilter: ['data-hidden', 'data-locked', 'data-collapse'] });

    cleanup(() => {
      gutter.remove();
      gutter.removeEventListener('pointerdown', drag);
      split._h_split.removePanel(panel);
      observer.disconnect();
    });
  });
}
