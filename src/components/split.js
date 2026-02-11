export default function (Alpine) {
  Alpine.directive('h-split', (el, {}, { cleanup, Alpine }) => {
    const panels = [];

    const state = Alpine.reactive({
      isHorizontal: el.getAttribute('data-orientation') === 'horizontal',
      isBorder: el.getAttribute('data-variant') === 'border',
    });

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

    const layout = () => {
      const visible = panels.filter((p) => !p.hidden);
      if (!visible.length) return;

      const totalSpace = usableSize();

      // Step 1: Clamp explicit panel sizes to their min/max
      const sizes = visible.map((p) => {
        if (p.explicit) return Math.min(Math.max(p.size, p.min), p.max);
        return null; // auto panel
      });

      // Step 2: Compute remaining space for auto panels
      const usedSpace = sizes.reduce((sum, s) => sum + (s ?? 0), 0);
      const remainingSpace = totalSpace - usedSpace;

      // Step 3: Distribute remaining space evenly among auto panels
      const autoPanels = visible.filter((p, i) => sizes[i] === null);
      if (autoPanels.length) {
        const share = remainingSpace / autoPanels.length;
        autoPanels.forEach((p) => {
          sizes[visible.indexOf(p)] = Math.min(Math.max(share, p.min), p.max);
        });
      }

      // Step 4: Apply all sizes
      visible.forEach((p, i) => {
        p.size = sizes[i];
        p.apply();
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
        if (!panel.size) {
          panel.size = 0;
        }
        refreshGutters();
        layout();
      },
      removePanel(panel) {
        const i = panels.indexOf(panel);
        if (i !== -1) panels.splice(i, 1);
        refreshGutters();
        layout();
      },
      panelHidden() {
        refreshGutters();
        layout();
      },
      normalize,
    };

    el.classList.add('flex', 'data-[orientation=horizontal]:flex-row', 'data-[orientation=vertical]:flex-col');

    const observer = new MutationObserver(() => {
      state.isHorizontal = el.getAttribute('data-orientation') === 'horizontal';
      state.isBorder = el.getAttribute('data-variant') === 'border';
      layout();
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-orientation', 'data-variant', 'data-locked'] });

    const containerObserver = new ResizeObserver(layout);

    containerObserver.observe(el);

    cleanup(() => {
      containerObserver.disconnect();
      observer.disconnect();
    });
  });

  Alpine.directive('h-split-panel', (el, { original }, { effect, cleanup, Alpine }) => {
    const split = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_split'));
    if (!split) {
      throw new Error(`${original} must be inside an split element`);
    }

    el.classList.add('size-full', 'shrink-0', 'grow-0', 'box-border');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'split-panel');

    const gutter = document.createElement('div');
    gutter.setAttribute('data-slot', 'split-gutter');
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
      'before:absolute',
      'before:top-1/2',
      'before:left-1/2',
      'before:-translate-x-1/2',
      'before:-translate-y-1/2',
      'before:block',
      'before:bg-transparent',
      'hover:before:bg-primary-hover',
      '[[data-locked=true]>&]:pointer-events-none',
      '[[data-orientation=horizontal]>&]:cursor-col-resize',
      '[[data-orientation=vertical]>&]:cursor-row-resize'
    );

    const borderClasses = [
      'bg-border',
      'outline-none',
      'hover:bg-primary-hover',
      'active:bg-primary-active',
      'before:absolute',
      'before:top-1/2',
      'before:left-1/2',
      'before:-translate-x-1/2',
      'before:-translate-y-1/2',
      'before:block',
      'before:bg-transparent',
      'hover:before:bg-primary-hover',
      '[[data-orientation=horizontal]>&]:!w-px',
      '[[data-orientation=horizontal]>&]:before:h-full',
      '[[data-orientation=horizontal]>&]:before:w-[calc(var(--spacing)*1.25)]',
      '[[data-orientation=vertical]>&]:!h-px',
      '[[data-orientation=vertical]>&]:before:w-full',
      '[[data-orientation=vertical]>&]:before:h-[calc(var(--spacing)*1.25)]',
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
      size: initialSize,
      explicit: initialSize != null,
      min: split._h_split.normalize(el.getAttribute('data-min')) ?? 0,
      max: split._h_split.normalize(el.getAttribute('data-max')) ?? Infinity,

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

        panel.apply();
        next.apply();
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

    const observer = new MutationObserver(() => {
      panel.hidden = el.getAttribute('data-hidden') === 'true';
      if (panel.hidden) {
        el.classList.add('hidden');
      } else {
        el.classList.remove('hidden');
      }
      split._h_split.panelHidden();
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-hidden'] });

    cleanup(() => {
      gutter.remove();
      gutter.removeEventListener('pointerdown', drag);
      split._h_split.removePanel(panel);
      observer.disconnect();
    });
  });
}
