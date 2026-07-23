import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import splitPlugin from '../../src/components/split.js';
import { mountDirective } from '../test-utils.js';

describe('h-split', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-orientation', 'horizontal');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('min-w-0')).toBe(true);
    expect(el.classList.contains('min-h-0')).toBe(true);
  });

  it('initializes _h_split state on element', () => {
    const el = document.createElement('div');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split).toBeDefined();
    expect(el._h_split.panels).toBeInstanceOf(Array);
    expect(typeof el._h_split.addPanel).toBe('function');
    expect(typeof el._h_split.removePanel).toBe('function');
  });

  it('calls cleanup', () => {
    const el = document.createElement('div');
    const { ctx } = mountDirective(splitPlugin, 'h-split', el, {});
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('state reflects horizontal orientation', () => {
    const el = document.createElement('div');
    el.setAttribute('data-orientation', 'horizontal');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split.state.isHorizontal).toBe(true);
  });

  it('state reflects vertical orientation', () => {
    const el = document.createElement('div');
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split.state.isHorizontal).toBe(false);
  });

  it('state reflects border variant', () => {
    const el = document.createElement('div');
    el.setAttribute('data-variant', 'border');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split.state.isBorder).toBe(true);
  });
});

describe('h-split-panel', () => {
  function createSplitPanelSetup() {
    const container = document.createElement('div');
    const split = document.createElement('div');
    split._h_split = {
      state: { isHorizontal: true, isBorder: false },
      panels: [],
      addPanel: vi.fn(),
      removePanel: vi.fn(),
      panelHidden: vi.fn(),
      gutterHidden: vi.fn(),
      panelChange: vi.fn(),
      resetInit: vi.fn(),
      normalize: vi.fn().mockReturnValue(null),
      saveSizes: vi.fn(),
    };
    const panel = document.createElement('div');
    split.appendChild(panel);
    container.appendChild(split);
    document.body.appendChild(container);
    return { container, split, panel };
  }

  it('applies base classes', () => {
    const { panel } = createSplitPanelSetup();
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(panel.classList.contains('flex')).toBe(true);
    expect(panel.classList.contains('shrink')).toBe(true);
    expect(panel.getAttribute('data-slot')).toBe('split-panel');
    expect(panel.getAttribute('tabindex')).toBe('-1');
  });

  it('calls addPanel on the split parent', () => {
    const { panel, split } = createSplitPanelSetup();
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(split._h_split.addPanel).toHaveBeenCalled();
  });

  it('calls cleanup', () => {
    const { panel } = createSplitPanelSetup();
    const { ctx } = mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('throws if not inside a split element', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(splitPlugin, 'h-split-panel', el, { original: 'x-h-split-panel' })).toThrow();
  });

  it('applies hidden class on init when data-hidden is true', () => {
    const { panel } = createSplitPanelSetup();
    panel.setAttribute('data-hidden', 'true');
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(panel.classList.contains('hidden')).toBe(true);
  });

  it('does not apply hidden class on init when data-hidden is not set', () => {
    const { panel } = createSplitPanelSetup();
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(panel.classList.contains('hidden')).toBe(false);
  });
});

describe('h-split gutter visibility', () => {
  // Gutter insertion/removal is deferred to requestAnimationFrame. Run rAF callbacks
  // synchronously (they may schedule further frames) so the DOM settles within the test.
  let rafCbs;
  let nextId;

  beforeEach(() => {
    rafCbs = new Map();
    nextId = 0;
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      const id = ++nextId;
      rafCbs.set(id, cb);
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id) => {
      rafCbs.delete(id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  const flushRaf = () => {
    for (let i = 0; i < 50 && rafCbs.size; i++) {
      const pending = [...rafCbs.values()];
      rafCbs.clear();
      pending.forEach((cb) => cb());
    }
  };

  // Mount a real h-split container plus real h-split-panel children (sharing the DOM tree,
  // so the panels resolve the container's _h_split via findClosest). Does NOT flush rAF -
  // callers flush when they want the deferred gutter insertions to settle.
  const mountSplit = (panelAttrs) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountDirective(splitPlugin, 'h-split', container, {});

    const panels = panelAttrs.map((attrs) => {
      const panel = document.createElement('div');
      Object.entries(attrs).forEach(([k, v]) => panel.setAttribute(k, v));
      container.appendChild(panel);
      mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
      return panel;
    });

    return { container, panels };
  };

  const gutters = (container) => container.querySelectorAll('span[data-slot="split-gutter"]');

  it('renders a gutter after every panel except the last visible one', () => {
    const { container } = mountSplit([{}, {}]);
    flushRaf();
    // Two visible panels: one gutter (after the first panel).
    expect(gutters(container).length).toBe(1);
  });

  it('does not render a gutter on the last visible panel when a trailing panel is hidden on init', () => {
    const { container } = mountSplit([{}, { 'data-hidden': 'true' }]);
    flushRaf();
    // Only one panel is visible, so no gutter should be rendered at all.
    expect(gutters(container).length).toBe(0);
  });

  it('removes the gutter when a trailing panel is hidden at runtime', async () => {
    const { container, panels } = mountSplit([{}, {}]);
    flushRaf();
    expect(gutters(container).length).toBe(1);

    panels[1].setAttribute('data-hidden', 'true');
    await new Promise((r) => setTimeout(r, 0)); // let the MutationObserver microtask run
    flushRaf();
    expect(gutters(container).length).toBe(0);
  });

  it('does not re-add a gutter when a panel is hidden before its deferred insertion fires', async () => {
    // Real-browser frame race: the first panel's gutter insertion is scheduled but has not
    // yet painted when the sibling is hidden. The stale insert must not resurrect the gutter.
    const { container, panels } = mountSplit([{}, {}]);
    // Intentionally do NOT flush - the insert rAF is still pending, as in a real frame.
    panels[1].setAttribute('data-hidden', 'true');
    await new Promise((r) => setTimeout(r, 0)); // MutationObserver microtask
    flushRaf(); // pending insert (now stale) fires here
    expect(gutters(container).length).toBe(0);
  });
});

describe('h-split responsive percentage bounds', () => {
  // Regression harness for the resize bug: a %-based min/max must be re-resolved
  // against the live container width on every layout pass, not baked once to px.
  // happy-dom never runs layout, so we (1) stub getBoundingClientRect to a fixed
  // width, (2) run requestAnimationFrame synchronously so queueLayout's layout()
  // fires inside the test, and (3) capture the ResizeObserver to fire it manually.
  let observers;
  let OriginalResizeObserver;

  beforeEach(() => {
    observers = [];
    OriginalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = class {
      constructor(cb) {
        this.cb = cb;
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        observers.push(this);
      }
    };
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      cb();
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
  });

  afterEach(() => {
    global.ResizeObserver = OriginalResizeObserver;
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  const widthOf = (el, width) => {
    el.getBoundingClientRect = () => ({ width, height: 0, top: 0, left: 0, right: width, bottom: 0 });
  };

  // Mount a real h-split (width-stubbed) with real h-split-panel children. Only
  // one panel is left visible (as in the reported scenario, details closed) so
  // there are no gutters and usableSize() equals the stubbed container width.
  const mountSplit = (width, panelAttrs) => {
    const container = document.createElement('div');
    container.setAttribute('data-orientation', 'horizontal'); // so containerSize() reads width
    document.body.appendChild(container);
    widthOf(container, width);
    mountDirective(splitPlugin, 'h-split', container, {});

    const panels = panelAttrs.map((attrs) => {
      const panel = document.createElement('div');
      Object.entries(attrs).forEach(([k, v]) => panel.setAttribute(k, v));
      container.appendChild(panel);
      mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
      return panel;
    });

    // The last mounted panel's addPanel triggered a synchronous layout; find the
    // matching panel state object via the container's shared panels array.
    const state = (i) => container._h_split.panels[i];
    return { container, panels, state };
  };

  it('resolves a percentage min to px against the initial width and writes the CSS floor var', () => {
    const { panels, state } = mountSplit(1000, [{ 'data-min': '40%' }]);
    expect(state(0).min).toBe(400);
    expect(panels[0].style.getPropertyValue('--h-split-panel-min')).toBe('400px');
  });

  it('re-resolves the percentage min when the container shrinks (the reported bug)', () => {
    const { container, panels, state } = mountSplit(1000, [{ 'data-min': '40%' }]);
    expect(state(0).min).toBe(400);

    // Shrink the container and fire the ResizeObserver callback (queueLayout -> layout).
    widthOf(container, 300);
    observers[0].cb();

    // Pre-fix this stayed 400px and pinned the panel, overflowing the container.
    expect(state(0).min).toBe(120);
    expect(panels[0].style.getPropertyValue('--h-split-panel-min')).toBe('120px');
  });

  it('re-resolves a percentage max and updates the CSS ceiling var on resize', () => {
    const { container, panels, state } = mountSplit(1000, [{ 'data-max': '50%' }]);
    expect(state(0).max).toBe(500);
    expect(panels[0].style.getPropertyValue('--h-split-panel-max')).toBe('500px');

    widthOf(container, 400);
    observers[0].cb();

    expect(state(0).max).toBe(200);
    expect(panels[0].style.getPropertyValue('--h-split-panel-max')).toBe('200px');
  });

  it('never leaves a stale max ceiling var when the panel has no data-max', () => {
    const { container, panels, state } = mountSplit(1000, [{ 'data-min': '40%' }]);
    expect(state(0).max).toBe(Infinity);
    expect(panels[0].style.getPropertyValue('--h-split-panel-max')).toBe('');

    widthOf(container, 300);
    observers[0].cb();

    expect(state(0).max).toBe(Infinity);
    expect(panels[0].style.getPropertyValue('--h-split-panel-max')).toBe('');
  });

  it('passes a pixel min through unchanged across a resize', () => {
    const { container, panels, state } = mountSplit(1000, [{ 'data-min': '120px' }]);
    expect(state(0).min).toBe(120);
    expect(panels[0].style.getPropertyValue('--h-split-panel-min')).toBe('120px');

    widthOf(container, 300);
    observers[0].cb();

    expect(state(0).min).toBe(120);
    expect(panels[0].style.getPropertyValue('--h-split-panel-min')).toBe('120px');
  });

  it('keeps declaredSize resolved-once (does not re-resolve its percentage on resize)', () => {
    // Asymmetry guard: min/max track the container width, but declaredSize (from a
    // percentage data-size) is resolved once at init and then superseded by
    // persisted/dragged sizes. Re-resolving it every resize would fight persistence.
    const { container, state } = mountSplit(1000, [{ 'data-size': '30%', 'data-min': '10%' }]);
    expect(state(0).declaredSize).toBe(300);
    expect(state(0).min).toBe(100);

    widthOf(container, 500);
    observers[0].cb();

    // min re-resolved to the new width; declaredSize stayed at its init value.
    expect(state(0).min).toBe(50);
    expect(state(0).declaredSize).toBe(300);
  });
});
