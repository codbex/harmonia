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
