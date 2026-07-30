import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fabPlugin, { FAB_SCROLL_THRESHOLD, fabHiddenClasses, fabNeedsLabel, fabPositions, fabScrollOffset, fabScrollTiming, fabShapes, fabSizes, getFabPosition, getFabShape, getFabSize, isFabScrollTarget } from '../../src/components/fab.js';
import { mountDirective } from '../test-utils.js';

// happy-dom delivers MutationObserver records asynchronously, so a class change
// driven by an attribute write is only visible after a macrotask.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function mount(el, contextOverrides, expression) {
  return mountDirective(fabPlugin, 'h-fab', el, { original: 'x-h-fab', ...(expression === undefined ? {} : { expression }) }, contextOverrides);
}

function labelledFab() {
  const el = document.createElement('button');
  el.setAttribute('aria-label', 'Create');
  document.body.appendChild(el);
  return el;
}

// happy-dom does no layout, so clientHeight and scrollHeight are always 0 and
// every target would look scrolled to the bottom. Give the scroller a geometry
// far from its end so direction is what decides.
function makeScroller({ clientHeight = 200, scrollHeight = 5000 } = {}) {
  const scroller = document.createElement('div');
  Object.defineProperty(scroller, 'clientHeight', { value: clientHeight, configurable: true });
  Object.defineProperty(scroller, 'scrollHeight', { value: scrollHeight, configurable: true });
  document.body.appendChild(scroller);
  return scroller;
}

// The scroll handler defers its work to the next frame, so collect the scheduled
// callbacks and run them on demand.
let frameCallbacks = [];
function stubFrames() {
  frameCallbacks = [];
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    frameCallbacks.push(cb);
    return frameCallbacks.length;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
}
function flushFrames() {
  const pending = frameCallbacks;
  frameCallbacks = [];
  pending.forEach((cb) => cb());
}

function scrollTo(scroller, offset) {
  scroller.scrollTop = offset;
  scroller.dispatchEvent(new Event('scroll'));
  flushFrames();
}

describe('fabSizes', () => {
  it('has the four documented sizes', () => {
    expect(Object.keys(fabSizes).sort()).toEqual(['default', 'extended', 'lg', 'sm']);
  });

  it('maps every size to an array of class strings', () => {
    for (const value of Object.values(fabSizes)) {
      expect(Array.isArray(value)).toBe(true);
      expect(value.length).toBeGreaterThan(0);
      value.forEach((cls) => expect(typeof cls).toBe('string'));
    }
  });

  it('grows the circle with each step up in size', () => {
    expect(fabSizes.sm).toContain('size-10');
    expect(fabSizes.default).toContain('size-12');
    expect(fabSizes.lg).toContain('size-14');
  });

  it('makes extended a pill with room for a label rather than a circle', () => {
    expect(fabSizes.extended).toContain('h-10');
    expect(fabSizes.extended).toContain('px-4');
    expect(fabSizes.extended).toContain('gap-2');
    expect(fabSizes.extended).not.toContain('size-12');
  });

  it('scales the icon with the button', () => {
    expect(fabSizes.sm).toContain("[&>svg:not([class*='size-'])]:size-5");
    expect(fabSizes.default).toContain("[&>svg:not([class*='size-'])]:size-6");
    expect(fabSizes.lg).toContain("[&>svg:not([class*='size-'])]:size-8");
    expect(fabSizes.extended).toContain("[&>svg:not([class*='size-'])]:size-4");
  });
});

describe('fabPositions', () => {
  it('has the two bottom corners plus static', () => {
    expect(Object.keys(fabPositions).sort()).toEqual(['bottom-left', 'bottom-right', 'static']);
  });

  it('pins each corner above content with a 16dp offset', () => {
    expect(fabPositions['bottom-right']).toEqual(['fixed', 'bottom-4', 'right-4', 'z-50']);
    expect(fabPositions['bottom-left']).toEqual(['fixed', 'bottom-4', 'left-4', 'z-50']);
  });

  it('applies no positioning at all for static', () => {
    expect(fabPositions.static).toEqual([]);
  });
});

describe('fabShapes', () => {
  it('has a round shape and a default one', () => {
    expect(Object.keys(fabShapes).sort()).toEqual(['default', 'round']);
  });

  it('swaps the control radius for a full one when round', () => {
    expect(fabShapes.round).toEqual(['rounded-full']);
    expect(fabShapes.default).toEqual(['rounded-control']);
  });
});

describe('getFabShape', () => {
  it('returns the requested shape', () => {
    expect(getFabShape('round')).toBe(fabShapes.round);
  });

  it('falls back to the default shape for an unknown or missing value', () => {
    expect(getFabShape('nope')).toBe(fabShapes.default);
    expect(getFabShape()).toBe(fabShapes.default);
  });
});

describe('getFabSize', () => {
  it('returns the requested size', () => {
    expect(getFabSize('lg')).toBe(fabSizes.lg);
    expect(getFabSize('extended')).toBe(fabSizes.extended);
  });

  it('falls back to the default circle for an unknown or missing size', () => {
    expect(getFabSize('nope')).toBe(fabSizes.default);
    expect(getFabSize()).toBe(fabSizes.default);
  });
});

describe('getFabPosition', () => {
  it('returns the requested corner', () => {
    expect(getFabPosition('bottom-left')).toBe(fabPositions['bottom-left']);
  });

  it('falls back to unpositioned for an unknown or missing position', () => {
    expect(getFabPosition('nope')).toBe(fabPositions.static);
    expect(getFabPosition()).toBe(fabPositions.static);
  });
});

describe('fabNeedsLabel', () => {
  it('requires an accessible name for the icon-only circles', () => {
    for (const size of ['sm', 'default', 'lg']) {
      expect(fabNeedsLabel(size)).toBe(true);
    }
  });

  it('does not require one for extended, which has a visible label', () => {
    expect(fabNeedsLabel('extended')).toBe(false);
  });
});

describe('h-fab directive', () => {
  let el;

  beforeEach(() => {
    el = labelledFab();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers the h-fab directive', () => {
    const { alpine } = mount(el);
    expect(alpine._directives['h-fab']).toBeDefined();
  });

  it('sets data-slot to fab', () => {
    mount(el);
    expect(el.getAttribute('data-slot')).toBe('fab');
  });

  it('does not override an existing data-slot', () => {
    el.setAttribute('data-slot', 'custom-trigger');
    mount(el);
    expect(el.getAttribute('data-slot')).toBe('custom-trigger');
  });

  it('reuses the shared button base classes', () => {
    mount(el);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.classList.contains('disabled:opacity-disabled')).toBe(true);
    expect(el.classList.contains('focus-outline')).toBe(true);
  });

  it('keeps the shared control radius by default', () => {
    mount(el);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(false);
  });

  it('becomes fully round on request', () => {
    el.setAttribute('data-shape', 'round');
    mount(el);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(false);
  });

  it('rounds the extended pill into stadium ends too', () => {
    el.setAttribute('data-size', 'extended');
    el.setAttribute('data-shape', 'round');
    mount(el);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(false);
  });

  it('is elevated', () => {
    mount(el);
    expect(el.classList.contains('shadow-md')).toBe(true);
  });

  it('drops the shadow classes a variant would otherwise impose', () => {
    mount(el);
    expect(el.classList.contains('shadow-button')).toBe(false);
  });

  it('keeps its elevation on the transparent variant, which flattens a button', () => {
    el.setAttribute('data-variant', 'transparent');
    mount(el);
    expect(el.classList.contains('shadow-none')).toBe(false);
    expect(el.classList.contains('shadow-md')).toBe(true);
  });

  it('keeps its elevation after a variant change at runtime', async () => {
    mount(el);
    el.setAttribute('data-variant', 'transparent');
    await flush();
    expect(el.classList.contains('shadow-none')).toBe(false);
    expect(el.classList.contains('shadow-md')).toBe(true);
  });

  it('defaults to the default variant', () => {
    mount(el);
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('bg-primary')).toBe(false);
  });

  it('accepts every button variant', () => {
    const representative = {
      default: 'bg-secondary',
      primary: 'bg-primary',
      positive: 'bg-positive',
      negative: 'bg-negative',
      warning: 'bg-warning',
      information: 'bg-information',
      outline: 'bg-background',
      transparent: 'bg-transparent',
      link: 'text-primary',
    };
    for (const [variant, cls] of Object.entries(representative)) {
      const node = labelledFab();
      node.setAttribute('data-variant', variant);
      mount(node);
      expect(node.classList.contains(cls), `${variant} should apply ${cls}`).toBe(true);
    }
  });

  it('defaults to the medium circle', () => {
    mount(el);
    expect(el.classList.contains('size-12')).toBe(true);
  });

  it('applies the requested size', () => {
    el.setAttribute('data-size', 'lg');
    mount(el);
    expect(el.classList.contains('size-14')).toBe(true);
    expect(el.classList.contains('size-12')).toBe(false);
  });

  it('is unpositioned by default', () => {
    mount(el);
    expect(el.classList.contains('fixed')).toBe(false);
    expect(el.classList.contains('bottom-4')).toBe(false);
    expect(el.classList.contains('z-50')).toBe(false);
  });

  it('pins itself to the requested corner', () => {
    el.setAttribute('data-position', 'bottom-left');
    mount(el);
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('bottom-4')).toBe(true);
    expect(el.classList.contains('left-4')).toBe(true);
    expect(el.classList.contains('z-50')).toBe(true);
  });

  it('calls cleanup', () => {
    const { ctx } = mount(el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('disconnects its observer on cleanup', () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const { ctx } = mount(el);
    ctx.cleanup.mock.calls[0][0]();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });
});

describe('h-fab accessible name', () => {
  let error;

  beforeEach(() => {
    error = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    error.mockRestore();
    document.body.innerHTML = '';
  });

  it('warns when a circular fab has no accessible name', () => {
    mount(document.createElement('button'));
    expect(error).toHaveBeenCalled();
  });

  it('accepts aria-labelledby instead of aria-label', () => {
    const el = document.createElement('button');
    el.setAttribute('aria-labelledby', 'heading');
    mount(el);
    expect(error).not.toHaveBeenCalled();
  });

  it('does not warn for extended, which has a visible label', () => {
    const el = document.createElement('button');
    el.setAttribute('data-size', 'extended');
    el.textContent = 'Compose';
    mount(el);
    expect(error).not.toHaveBeenCalled();
  });
});

describe('h-fab reactivity', () => {
  let el;

  beforeEach(() => {
    el = labelledFab();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('swaps size classes when data-size changes', async () => {
    mount(el);
    el.setAttribute('data-size', 'lg');
    await flush();
    expect(el.classList.contains('size-14')).toBe(true);
    expect(el.classList.contains('size-12')).toBe(false);
  });

  it('swaps variant classes when data-variant changes', async () => {
    mount(el);
    el.setAttribute('data-variant', 'negative');
    await flush();
    expect(el.classList.contains('bg-negative')).toBe(true);
    expect(el.classList.contains('bg-primary')).toBe(false);
  });

  it('pins itself when data-position is set after mount', async () => {
    mount(el);
    el.setAttribute('data-position', 'bottom-right');
    await flush();
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('bottom-4')).toBe(true);
    expect(el.classList.contains('right-4')).toBe(true);
  });

  it('moves between corners without leaving the old offsets behind', async () => {
    el.setAttribute('data-position', 'bottom-right');
    mount(el);
    el.setAttribute('data-position', 'bottom-left');
    await flush();
    expect(el.classList.contains('left-4')).toBe(true);
    expect(el.classList.contains('right-4')).toBe(false);
    expect(el.classList.contains('bottom-4')).toBe(true);
  });

  it('removes all positioning when switching to static', async () => {
    el.setAttribute('data-position', 'bottom-right');
    mount(el);
    el.setAttribute('data-position', 'static');
    await flush();
    expect(el.classList.contains('fixed')).toBe(false);
    expect(el.classList.contains('bottom-4')).toBe(false);
    expect(el.classList.contains('z-50')).toBe(false);
  });

  it('rounds itself when data-shape changes', async () => {
    mount(el);
    el.setAttribute('data-shape', 'round');
    await flush();
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(false);
  });

  it('returns to the control radius when data-shape is cleared', async () => {
    el.setAttribute('data-shape', 'round');
    mount(el);
    el.removeAttribute('data-shape');
    await flush();
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(false);
  });
});

describe('fab scroll helpers', () => {
  it('accepts a window or an element as a scroll target', () => {
    expect(isFabScrollTarget({ scrollY: 0 })).toBe(true);
    expect(isFabScrollTarget({ scrollTop: 0 })).toBe(true);
  });

  it('rejects anything that cannot be scrolled', () => {
    for (const value of [null, undefined, 'panel', 42, {}]) {
      expect(isFabScrollTarget(value)).toBe(false);
    }
  });

  it('reads the offset from either kind of target', () => {
    expect(fabScrollOffset({ scrollY: 120 })).toBe(120);
    expect(fabScrollOffset({ scrollTop: 80 })).toBe(80);
  });

  it('clamps the negative offset iOS reports while rubber-banding', () => {
    expect(fabScrollOffset({ scrollY: -60 })).toBe(0);
    expect(fabScrollOffset({ scrollTop: -60 })).toBe(0);
  });

  it('reports zero for a target it cannot read', () => {
    expect(fabScrollOffset(null)).toBe(0);
  });

  it('pins the off-screen class contract', () => {
    expect(fabHiddenClasses).toEqual(['translate-y-full', 'opacity-0', 'pointer-events-none']);
  });

  it('slows the slide down from the button default', () => {
    expect(fabScrollTiming).toEqual(['duration-200', 'ease-out']);
  });
});

describe('h-fab hide on scroll', () => {
  let el;
  let scroller;

  beforeEach(() => {
    stubFrames();
    scroller = makeScroller();
    el = labelledFab();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  // The scrolling element arrives through the directive expression, which the
  // mock resolves with the injected 'evaluate'.
  function mountWatching(node = el, target = scroller) {
    node.setAttribute('data-hide-on-scroll', 'true');
    return mount(node, { evaluate: () => target }, '$refs.panel');
  }

  it('attaches nothing without the attribute', () => {
    mount(el, { evaluate: () => scroller }, '$refs.panel');
    expect(el.classList.contains('duration-200')).toBe(false);
    scrollTo(scroller, 400);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('takes only "true" as enabled, like the other boolean attributes', () => {
    for (const value of ['', 'false', 'yes', 'True']) {
      const node = labelledFab();
      node.setAttribute('data-hide-on-scroll', value);
      mount(node, { evaluate: () => scroller }, '$refs.panel');
      expect(node.classList.contains('duration-200'), `"${value}" should not enable it`).toBe(false);
      scrollTo(scroller, 400);
      expect(node.classList.contains('translate-y-full'), `"${value}" should not enable it`).toBe(false);
      scrollTo(scroller, 0);
    }
  });

  it('applies the slide timing when enabled', () => {
    mountWatching();
    expect(el.classList.contains('duration-200')).toBe(true);
    expect(el.classList.contains('ease-out')).toBe(true);
  });

  it('slides away on scroll down', () => {
    mountWatching();
    scrollTo(scroller, 400);
    fabHiddenClasses.forEach((cls) => expect(el.classList.contains(cls), cls).toBe(true));
  });

  it('ignores a scroll smaller than the threshold', () => {
    mountWatching();
    scrollTo(scroller, FAB_SCROLL_THRESHOLD - 1);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('accumulates sub-threshold scrolls until they add up', () => {
    mountWatching();
    const step = FAB_SCROLL_THRESHOLD - 2;
    scrollTo(scroller, step);
    expect(el.classList.contains('translate-y-full')).toBe(false);
    scrollTo(scroller, step * 2);
    expect(el.classList.contains('translate-y-full')).toBe(true);
  });

  it('comes back on scroll up', () => {
    mountWatching();
    scrollTo(scroller, 400);
    scrollTo(scroller, 200);
    fabHiddenClasses.forEach((cls) => expect(el.classList.contains(cls), cls).toBe(false));
  });

  it('comes back at the top even when the last move was down', () => {
    mountWatching();
    scrollTo(scroller, 400);
    scrollTo(scroller, 0);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('stays away when a downward scroll reaches the bottom of the range', () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(el.classList.contains('translate-y-full')).toBe(true);
    scrollTo(scroller, 4800);
    expect(el.classList.contains('translate-y-full')).toBe(true);
  });

  it('comes back on scroll up from the bottom of the range', () => {
    mountWatching();
    scrollTo(scroller, 4800);
    expect(el.classList.contains('translate-y-full')).toBe(true);
    scrollTo(scroller, 4600);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('does not slide away when an overscroll rebounds', () => {
    mountWatching();
    scrollTo(scroller, -50);
    scrollTo(scroller, 0);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('watches the element from the expression, not the page', () => {
    mountWatching();
    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(el.classList.contains('translate-y-full')).toBe(false);
    scrollTo(scroller, 400);
    expect(el.classList.contains('translate-y-full')).toBe(true);
  });

  it('watches a scroller that is only a sibling of the button', () => {
    const wrapper = document.createElement('div');
    const panel = makeScroller();
    const fab = document.createElement('button');
    fab.setAttribute('aria-label', 'Add');
    wrapper.append(panel, fab);
    document.body.appendChild(wrapper);
    mountWatching(fab, panel);
    scrollTo(panel, 400);
    expect(fab.classList.contains('translate-y-full')).toBe(true);
  });

  it('watches the page when there is no expression', () => {
    const view = el.ownerDocument.defaultView;
    const add = vi.spyOn(view, 'addEventListener');
    el.setAttribute('data-hide-on-scroll', 'true');
    mount(el);
    expect(add).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    add.mockRestore();
  });

  it('registers the listener passively', () => {
    const add = vi.spyOn(scroller, 'addEventListener');
    mountWatching();
    expect(add).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    add.mockRestore();
  });

  it('reports an expression that is not a scrollable element', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    el.setAttribute('data-hide-on-scroll', 'true');
    mount(el, { evaluate: () => 'not-an-element' }, '$refs.nope');
    expect(error).toHaveBeenCalled();
    expect(el.classList.contains('duration-200')).toBe(false);
    error.mockRestore();
  });

  it('leaves the tab order and the accessibility tree while away', () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(el.hasAttribute('inert')).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    scrollTo(scroller, 200);
    expect(el.hasAttribute('inert')).toBe(false);
    expect(el.hasAttribute('aria-hidden')).toBe(false);
  });

  it('never uses hidden, which would stop the slide animating', () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(el.classList.contains('hidden')).toBe(false);
  });

  it('coalesces a burst of scroll events into one frame', () => {
    mountWatching();
    scroller.scrollTop = 400;
    scroller.dispatchEvent(new Event('scroll'));
    scroller.dispatchEvent(new Event('scroll'));
    scroller.dispatchEvent(new Event('scroll'));
    expect(frameCallbacks).toHaveLength(1);
    flushFrames();
    expect(el.classList.contains('translate-y-full')).toBe(true);
  });

  it('starts watching when the attribute is set after mount', async () => {
    mount(el, { evaluate: () => scroller }, '$refs.panel');
    el.setAttribute('data-hide-on-scroll', 'true');
    await flush();
    expect(el.classList.contains('duration-200')).toBe(true);
    scrollTo(scroller, 400);
    expect(el.classList.contains('translate-y-full')).toBe(true);
  });

  it('stops watching and restores itself when the attribute is removed', async () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(el.classList.contains('translate-y-full')).toBe(true);
    el.removeAttribute('data-hide-on-scroll');
    await flush();
    fabHiddenClasses.forEach((cls) => expect(el.classList.contains(cls), cls).toBe(false));
    expect(el.classList.contains('duration-200')).toBe(false);
    expect(el.hasAttribute('inert')).toBe(false);
    scrollTo(scroller, 800);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('stops watching and restores itself when the attribute is set to false', async () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(el.classList.contains('translate-y-full')).toBe(true);
    el.setAttribute('data-hide-on-scroll', 'false');
    await flush();
    fabHiddenClasses.forEach((cls) => expect(el.classList.contains(cls), cls).toBe(false));
    expect(el.classList.contains('duration-200')).toBe(false);
    scrollTo(scroller, 800);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('stops responding after cleanup', () => {
    const { ctx } = mountWatching();
    ctx.cleanup.mock.calls[0][0]();
    scrollTo(scroller, 400);
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });

  it('cancels a pending frame on cleanup', () => {
    const { ctx } = mountWatching();
    scroller.scrollTop = 400;
    scroller.dispatchEvent(new Event('scroll'));
    ctx.cleanup.mock.calls[0][0]();
    flushFrames();
    expect(el.classList.contains('translate-y-full')).toBe(false);
  });
});
