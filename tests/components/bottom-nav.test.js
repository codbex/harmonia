import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import bottomNavPlugin, { bottomNavDockedPositions, bottomNavFloatingClasses, bottomNavHiddenClasses, bottomNavPositions, bottomNavSafeAreaClasses, getBottomNavPosition, isBottomNavScrollEnabled } from '../../src/components/bottom-nav.js';
import { FAB_SCROLL_THRESHOLD } from '../../src/components/fab.js';
import { mountDirective } from '../test-utils.js';

// happy-dom delivers MutationObserver records asynchronously, so a class or
// attribute change driven by an attribute write is only visible after a macrotask.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function mount(directive, el, bindings, contextOverrides) {
  return mountDirective(bottomNavPlugin, directive, el, { original: `x-${directive}`, ...bindings }, contextOverrides);
}

// The bar always throws without these two, so every test starts from a valid one.
function makeNav({ position, labels, hideOnScroll, floating } = {}) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main');
  if (position !== undefined) nav.setAttribute('data-position', position);
  if (labels !== undefined) nav.setAttribute('data-labels', labels);
  if (hideOnScroll !== undefined) nav.setAttribute('data-hide-on-scroll', hideOnScroll);
  if (floating !== undefined) nav.setAttribute('data-floating', floating);
  document.body.appendChild(nav);
  return nav;
}

// The list and item directives locate their ancestors through the real DOM, so a
// mounted bar has to sit above them. The bar's own state marker is all they read.
function makeTree({ expression = '', itemExpression = '', navAttrs, linkTag = 'button' } = {}) {
  const nav = makeNav(navAttrs);
  mount('h-bottom-nav', nav, { expression });

  const list = document.createElement('ul');
  nav.appendChild(list);
  mount('h-bottom-nav-list', list, {});

  const item = document.createElement('li');
  list.appendChild(item);

  const link = document.createElement(linkTag);
  item.appendChild(link);

  const label = document.createElement('span');
  link.appendChild(label);

  return { nav, list, item, link, label, expression, itemExpression };
}

// Resolves the bar's active expression and the item's own value from a lookup, so
// a test can drive the comparison the item makes without a real Alpine scope.
function evaluateLaterFrom(values) {
  return (expr) => (cb) => cb(values[expr]);
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

// happy-dom does no layout, so give the scroller a geometry far from its end and
// let direction be what decides.
function makeScroller() {
  const scroller = document.createElement('div');
  Object.defineProperty(scroller, 'clientHeight', { value: 200, configurable: true });
  Object.defineProperty(scroller, 'scrollHeight', { value: 5000, configurable: true });
  document.body.appendChild(scroller);
  return scroller;
}

function scrollTo(scroller, offset) {
  scroller.scrollTop = offset;
  scroller.dispatchEvent(new Event('scroll'));
  flushFrames();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('bottomNavPositions', () => {
  it('has the two docking modes plus a static one', () => {
    expect(Object.keys(bottomNavPositions).sort()).toEqual(['fixed', 'static', 'sticky']);
  });

  it('names both docking modes', () => {
    expect(bottomNavDockedPositions).toEqual(['sticky', 'fixed']);
    for (const mode of bottomNavDockedPositions) {
      expect(bottomNavPositions, mode).toHaveProperty(mode);
    }
  });

  it('keeps a sticky bar in flow, so it needs no horizontal inset', () => {
    expect(bottomNavPositions.sticky).toEqual(['sticky', 'bottom-0']);
  });

  // The bar claims no stacking level of its own, so it layers by DOM order and
  // anything with a z-index of its own (overlays, a floating action button) wins.
  it('sets no z-index in either docking mode', () => {
    for (const mode of bottomNavDockedPositions) {
      expect(
        bottomNavPositions[mode].filter((cls) => cls.startsWith('z-')),
        mode
      ).toEqual([]);
    }
  });

  it('docks the bar to the bottom edge across the full width', () => {
    expect(bottomNavPositions.fixed).toEqual(['fixed', 'inset-x-0', 'bottom-0']);
  });

  it('applies no positioning at all for static', () => {
    expect(bottomNavPositions.static).toEqual([]);
  });

  // Floating is a visual treatment. Coupling an offset to it here would decide,
  // on the consumer's behalf, where a floating bar sits.
  it('positions a floating bar exactly like any other, leaving the offset to the consumer', () => {
    for (const [mode, classes] of Object.entries(bottomNavPositions)) {
      for (const cls of classes) {
        expect(cls, `${mode}: ${cls}`).not.toContain('floating');
      }
    }
  });
});

describe('getBottomNavPosition', () => {
  it('returns the requested position', () => {
    expect(getBottomNavPosition('fixed')).toBe(bottomNavPositions.fixed);
  });

  it('falls back to unpositioned for an unknown or missing position', () => {
    expect(getBottomNavPosition('nope')).toBe(bottomNavPositions.static);
    expect(getBottomNavPosition()).toBe(bottomNavPositions.static);
  });
});

describe('bottomNavHiddenClasses', () => {
  it('pins the off-screen class contract', () => {
    expect(bottomNavHiddenClasses).toContain('translate-y-full');
    expect(bottomNavHiddenClasses).toContain('pointer-events-none');
  });

  it('needs no fade for a docked bar, which is flush with the edge', () => {
    expect(bottomNavHiddenClasses).not.toContain('opacity-0');
  });

  it('fades a floating bar, whose inset would otherwise stay on screen', () => {
    expect(bottomNavHiddenClasses).toContain('data-[floating=true]:opacity-0');
  });

  // A translate utility animates the 'translate' property, not 'transform'.
  // Transitioning the wrong one leaves the bar snapping between shown and hidden
  // with nothing in between, so the two have to agree.
  it('slides with a translate utility, which is what the transition must name', () => {
    expect(bottomNavHiddenClasses.some((cls) => cls.startsWith('translate-'))).toBe(true);
    expect(bottomNavHiddenClasses.some((cls) => cls.includes('transform'))).toBe(false);
  });
});

describe('h-bottom-nav transition', () => {
  // Every property the hidden state changes has to be in the transition list, or
  // that part of the hide happens instantly.
  it('transitions every property the off-screen state animates', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    const transition = [...nav.classList].find((cls) => cls.startsWith('transition-['));
    expect(transition, 'the bar should declare an explicit transition list').toBeDefined();
    const properties = transition.slice('transition-['.length, -1).split(',');
    expect(properties).toContain('translate');
    expect(properties).toContain('opacity');
  });

  it('honors a reduced motion preference', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    expect(nav.classList.contains('motion-reduce:transition-none')).toBe(true);
  });
});

describe('bottomNavFloatingClasses', () => {
  it('trades the top border for a full one, a radius and an elevation', () => {
    expect(bottomNavFloatingClasses).toContain('data-[floating=true]:border');
    expect(bottomNavFloatingClasses).toContain('data-[floating=true]:rounded-lg');
    expect(bottomNavFloatingClasses).toContain('data-[floating=true]:shadow-xs');
  });

  it('keeps the single top border for a docked bar', () => {
    expect(bottomNavFloatingClasses).toContain('[&:not([data-floating=true])]:border-t');
    expect(bottomNavFloatingClasses).not.toContain('border-t');
  });

  it('adds no spacing of its own, leaving placement to the consumer', () => {
    for (const cls of bottomNavFloatingClasses) {
      expect(cls, cls).not.toMatch(/:m[xytrbl]?-/);
    }
  });
});

describe('bottomNavSafeAreaClasses', () => {
  it('reserves the home indicator area only for a docked bar', () => {
    expect(bottomNavSafeAreaClasses).toEqual(['data-[position=sticky]:pb-[env(safe-area-inset-bottom)]', 'data-[position=fixed]:pb-[env(safe-area-inset-bottom)]']);
  });

  it('covers every docking mode, so neither loses the inset', () => {
    for (const mode of bottomNavDockedPositions) {
      expect(
        bottomNavSafeAreaClasses.some((cls) => cls.startsWith(`data-[position=${mode}]:`)),
        mode
      ).toBe(true);
    }
  });
});

describe('isBottomNavScrollEnabled', () => {
  it('treats "true" and an expression as enabled', () => {
    expect(isBottomNavScrollEnabled('true')).toBe(true);
    expect(isBottomNavScrollEnabled('$refs.panel')).toBe(true);
  });

  it('treats a missing, empty or "false" value as disabled', () => {
    for (const value of [null, undefined, '', 'false']) {
      expect(isBottomNavScrollEnabled(value)).toBe(false);
    }
  });
});

describe('h-bottom-nav directive', () => {
  it('registers every directive of the component', () => {
    const { alpine } = mount('h-bottom-nav', makeNav(), {});
    for (const name of ['h-bottom-nav', 'h-bottom-nav-list', 'h-bottom-nav-item', 'h-bottom-nav-link', 'h-bottom-nav-label']) {
      expect(alpine._directives[name], name).toBeDefined();
    }
  });

  it('sets data-slot to bottom-nav', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    expect(nav.getAttribute('data-slot')).toBe('bottom-nav');
  });

  it('carries the shared header surface tokens', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    expect(nav.classList.contains('bg-object-header')).toBe(true);
    expect(nav.classList.contains('text-object-header-foreground')).toBe(true);
  });

  // Sizing through the class keeps the height readable from
  // '--bottom-nav-height', which is what a surrounding layout offsets against.
  it('takes its height from the shared bottom nav height class', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    expect(nav.classList.contains('h-bottom-nav')).toBe(true);
    expect([...nav.classList].some((cls) => /^h-\d/.test(cls))).toBe(false);
  });

  it('separates itself from the content above with a top border unless floating', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    expect(nav.classList.contains('[&:not([data-floating=true])]:border-t')).toBe(true);
  });

  it('becomes a detached card when floating', () => {
    const nav = makeNav({ floating: 'true' });
    mount('h-bottom-nav', nav, {});
    // The classes are variant-guarded, so they ride along on every bar and CSS
    // decides. What matters is that the floating treatment is present at all.
    expect(nav.classList.contains('data-[floating=true]:border')).toBe(true);
    expect(nav.classList.contains('data-[floating=true]:rounded-lg')).toBe(true);
    expect(nav.classList.contains('data-[floating=true]:shadow-xs')).toBe(true);
  });

  it('fills the width it is given, floating or not', () => {
    for (const floating of [undefined, 'true']) {
      const nav = makeNav({ floating });
      mount('h-bottom-nav', nav, {});
      expect(nav.classList.contains('w-full'), `floating=${floating}`).toBe(true);
    }
  });

  it('exposes a group so items can react to bar level attributes', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    expect(nav.classList.contains('group/bottom-nav')).toBe(true);
  });

  it('must be a nav element', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Main');
    expect(() => mount('h-bottom-nav', el, {})).toThrow(/must be a nav element/);
  });

  it('must have an accessible name, since a page can hold more than one nav', () => {
    expect(() => mount('h-bottom-nav', document.createElement('nav'), {})).toThrow(/aria-label/);
  });

  it('is unpositioned by default so a layout can place it', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    expect(nav.getAttribute('data-position')).toBe('static');
    expect(nav.classList.contains('fixed')).toBe(false);
    expect(nav.classList.contains('sticky')).toBe(false);
    expect(nav.classList.contains('bottom-0')).toBe(false);
  });

  it('sticks itself to the bottom on request, keeping its place in flow', () => {
    const nav = makeNav({ position: 'sticky' });
    mount('h-bottom-nav', nav, {});
    expect(nav.classList.contains('sticky')).toBe(true);
    expect(nav.classList.contains('bottom-0')).toBe(true);
    expect(nav.classList.contains('fixed')).toBe(false);
  });

  it('docks itself to the viewport on request', () => {
    const nav = makeNav({ position: 'fixed' });
    mount('h-bottom-nav', nav, {});
    expect(nav.classList.contains('fixed')).toBe(true);
    expect(nav.classList.contains('inset-x-0')).toBe(true);
    expect(nav.classList.contains('bottom-0')).toBe(true);
    expect(nav.classList.contains('sticky')).toBe(false);
  });

  it('swaps cleanly between the two docking modes', async () => {
    const nav = makeNav({ position: 'sticky' });
    mount('h-bottom-nav', nav, {});
    nav.setAttribute('data-position', 'fixed');
    await flush();
    expect(nav.classList.contains('fixed')).toBe(true);
    expect(nav.classList.contains('inset-x-0')).toBe(true);
    expect(nav.classList.contains('sticky')).toBe(false);
    nav.setAttribute('data-position', 'sticky');
    await flush();
    expect(nav.classList.contains('sticky')).toBe(true);
    expect(nav.classList.contains('fixed')).toBe(false);
    expect(nav.classList.contains('inset-x-0')).toBe(false);
  });

  it('positions a floating bar exactly like any other, whichever mode is set', () => {
    for (const position of ['sticky', 'fixed']) {
      const plain = makeNav({ position });
      const floating = makeNav({ position, floating: 'true' });
      mount('h-bottom-nav', plain, {});
      mount('h-bottom-nav', floating, {});
      for (const cls of getBottomNavPosition(position)) {
        expect(floating.classList.contains(cls), `${position}: ${cls}`).toBe(plain.classList.contains(cls));
      }
    }
  });

  it('keeps an explicit position instead of overwriting it with the default', () => {
    const nav = makeNav({ position: 'fixed' });
    mount('h-bottom-nav', nav, {});
    expect(nav.getAttribute('data-position')).toBe('fixed');
  });

  it('reserves the safe area only for a docked bar', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    for (const cls of bottomNavSafeAreaClasses) {
      expect(nav.classList.contains(cls), cls).toBe(true);
    }
  });

  it('docks itself when data-position is set after mount', async () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    nav.setAttribute('data-position', 'fixed');
    await flush();
    expect(nav.classList.contains('fixed')).toBe(true);
  });

  it('removes all positioning when switching back to static', async () => {
    const nav = makeNav({ position: 'fixed' });
    mount('h-bottom-nav', nav, {});
    nav.setAttribute('data-position', 'static');
    await flush();
    expect(nav.classList.contains('fixed')).toBe(false);
    expect(nav.classList.contains('bottom-0')).toBe(false);
    expect(nav.classList.contains('inset-x-0')).toBe(false);
  });

  it('exposes the active expression for its items', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, { expression: 'tab' });
    expect(nav._h_bottom_nav.expression).toBe('tab');
  });

  it('assigns a value back through the expression without stringifying it', () => {
    const nav = makeNav();
    const evaluate = vi.fn();
    mount('h-bottom-nav', nav, { expression: 'tab' }, { evaluate });
    nav._h_bottom_nav.setValue('home');
    expect(evaluate).toHaveBeenCalledTimes(1);
    const [expression, extras] = evaluate.mock.calls[0];
    // The value travels in a scope rather than interpolated into the source, so a
    // string value cannot be read back as an identifier.
    expect(expression).not.toContain('home');
    expect(Object.values(extras.scope)).toEqual(['home']);
  });

  it('writes nothing when the bar has no expression', () => {
    const nav = makeNav();
    const evaluate = vi.fn();
    mount('h-bottom-nav', nav, { expression: '' }, { evaluate });
    nav._h_bottom_nav.setValue('home');
    expect(evaluate).not.toHaveBeenCalled();
  });

  it('disconnects its observer on cleanup', () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const { ctx } = mount('h-bottom-nav', makeNav(), {});
    ctx.cleanup.mock.calls[0][0]();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });
});

describe('h-bottom-nav-list directive', () => {
  it('sets data-slot to bottom-nav-list', () => {
    const { list } = makeTree();
    expect(list.getAttribute('data-slot')).toBe('bottom-nav-list');
  });

  it('spreads the destinations evenly across the bar', () => {
    const { list } = makeTree();
    expect(list.classList.contains('flex')).toBe(true);
    expect(list.classList.contains('justify-around')).toBe(true);
    expect(list.classList.contains('items-stretch')).toBe(true);
  });

  // The height belongs to the bar, which sets it from '--bottom-nav-height'. The
  // list just fills it, so overriding that variable resizes both together.
  it('fills the height of the bar rather than setting one of its own', () => {
    const { list } = makeTree();
    expect(list.classList.contains('h-full')).toBe(true);
    expect([...list.classList].some((cls) => /^h-\d/.test(cls))).toBe(false);
  });

  it('inherits the floating card radius, so a destination cannot square it off', () => {
    const { list } = makeTree();
    expect(list.classList.contains('group-data-[floating=true]/bottom-nav:rounded-lg')).toBe(true);
    expect(list.classList.contains('group-data-[floating=true]/bottom-nav:overflow-hidden')).toBe(true);
  });

  it('drops the default list styling', () => {
    const { list } = makeTree();
    expect(list.classList.contains('list-none')).toBe(true);
    expect(list.classList.contains('p-0')).toBe(true);
  });

  it('must be a ul element', () => {
    const nav = makeNav();
    mount('h-bottom-nav', nav, {});
    const el = document.createElement('div');
    nav.appendChild(el);
    expect(() => mount('h-bottom-nav-list', el, {})).toThrow(/must be a ul element/);
  });

  it('must be inside a bottom navigation', () => {
    const el = document.createElement('ul');
    document.body.appendChild(el);
    expect(() => mount('h-bottom-nav-list', el, {})).toThrow(/x-h-bottom-nav element/);
  });
});

describe('h-bottom-nav-item directive', () => {
  it('sets data-slot to bottom-nav-item', () => {
    const { item } = makeTree();
    mount('h-bottom-nav-item', item, {});
    expect(item.getAttribute('data-slot')).toBe('bottom-nav-item');
  });

  it('takes an equal share of the bar', () => {
    const { item } = makeTree();
    mount('h-bottom-nav-item', item, {});
    expect(item.classList.contains('flex-1')).toBe(true);
    expect(item.classList.contains('min-w-0')).toBe(true);
  });

  it('exposes a group so the link can react to the active state', () => {
    const { item } = makeTree();
    mount('h-bottom-nav-item', item, {});
    expect(item.classList.contains('group/bottom-nav-item')).toBe(true);
  });

  it('must be a li element', () => {
    const { list } = makeTree();
    const el = document.createElement('div');
    list.appendChild(el);
    expect(() => mount('h-bottom-nav-item', el, {})).toThrow(/must be a li element/);
  });

  it('must be a direct child of the list', () => {
    const { list } = makeTree();
    const wrapper = document.createElement('div');
    const el = document.createElement('li');
    wrapper.appendChild(el);
    list.appendChild(wrapper);
    expect(() => mount('h-bottom-nav-item', el, {})).toThrow(/direct child/);
  });

  it('marks itself active when its value matches the bar', () => {
    const { item } = makeTree({ expression: 'tab' });
    mount('h-bottom-nav-item', item, { expression: "'home'" }, { evaluateLater: evaluateLaterFrom({ tab: 'home', "'home'": 'home' }) });
    expect(item.getAttribute('data-active')).toBe('true');
  });

  it('stays inactive when its value does not match', () => {
    const { item } = makeTree({ expression: 'tab' });
    mount('h-bottom-nav-item', item, { expression: "'search'" }, { evaluateLater: evaluateLaterFrom({ tab: 'home', "'search'": 'search' }) });
    expect(item.hasAttribute('data-active')).toBe(false);
  });

  it('compares values without coercing them, so 0 and "0" stay distinct', () => {
    const { item } = makeTree({ expression: 'tab' });
    mount('h-bottom-nav-item', item, { expression: '0' }, { evaluateLater: evaluateLaterFrom({ tab: '0', 0: 0 }) });
    expect(item.hasAttribute('data-active')).toBe(false);
  });

  it('records its value for the link to write back', () => {
    const { item } = makeTree({ expression: 'tab' });
    mount('h-bottom-nav-item', item, { expression: "'home'" }, { evaluateLater: evaluateLaterFrom({ tab: 'search', "'home'": 'home' }) });
    expect(item._h_bottom_nav_item.value).toBe('home');
  });

  it('leaves data-active alone when the bar has no expression', () => {
    const { item } = makeTree({ expression: '' });
    item.setAttribute('data-active', 'true');
    mount('h-bottom-nav-item', item, { expression: "'home'" }, { evaluateLater: evaluateLaterFrom({ "'home'": 'home' }) });
    expect(item.getAttribute('data-active')).toBe('true');
  });

  it('leaves data-active alone when the item has no value', () => {
    const { item } = makeTree({ expression: 'tab' });
    item.setAttribute('data-active', 'true');
    mount('h-bottom-nav-item', item, { expression: '' }, { evaluateLater: evaluateLaterFrom({ tab: 'home' }) });
    expect(item.getAttribute('data-active')).toBe('true');
  });
});

describe('h-bottom-nav-link directive', () => {
  // Mounts the whole chain so the link finds a real item and bar above it.
  function mountLink({ expression = 'tab', itemExpression = "'home'", active = 'search', navAttrs, linkTag = 'button' } = {}) {
    const tree = makeTree({ expression, navAttrs, linkTag });
    mount('h-bottom-nav-item', tree.item, { expression: itemExpression }, { evaluateLater: evaluateLaterFrom({ [expression]: active, [itemExpression]: 'home' }) });
    const mounted = mount('h-bottom-nav-link', tree.link, {});
    return { ...tree, ctx: mounted.ctx };
  }

  it('sets data-slot to bottom-nav-link', () => {
    const { link } = mountLink();
    expect(link.getAttribute('data-slot')).toBe('bottom-nav-link');
  });

  it('stacks the icon over the label', () => {
    const { link } = mountLink();
    expect(link.classList.contains('flex')).toBe(true);
    expect(link.classList.contains('flex-col')).toBe(true);
    expect(link.classList.contains('items-center')).toBe(true);
  });

  it('anchors a nested badge indicator', () => {
    const { link } = mountLink();
    expect(link.classList.contains('relative')).toBe(true);
  });

  // The selector reaches any descendant, not just a direct child, so an icon
  // wrapped for a badge indicator still gets the size.
  it('gives the icon the larger size the bar can carry, however deeply it sits', () => {
    const { link } = mountLink();
    expect(link.classList.contains('svg-defaults')).toBe(true);
    expect(link.classList.contains("[&_svg:not([class*='size-'])]:size-6")).toBe(true);
  });

  it('highlights itself from the active state on the item', () => {
    const { link } = mountLink();
    expect(link.classList.contains('group-data-[active=true]/bottom-nav-item:text-primary')).toBe(true);
  });

  it('is focusable with a visible outline', () => {
    const { link } = mountLink();
    expect(link.classList.contains('focus-outline')).toBe(true);
  });

  it('makes a button an explicit type=button', () => {
    const { link } = mountLink();
    expect(link.getAttribute('type')).toBe('button');
  });

  it('accepts an anchor and leaves its type alone', () => {
    const { link } = mountLink({ linkTag: 'a' });
    expect(link.hasAttribute('type')).toBe(false);
  });

  it('must be an anchor or a button', () => {
    const tree = makeTree();
    mount('h-bottom-nav-item', tree.item, {});
    const el = document.createElement('div');
    tree.item.appendChild(el);
    expect(() => mount('h-bottom-nav-link', el, {})).toThrow(/anchor or button/);
  });

  it('must be inside a bottom navigation item', () => {
    const el = document.createElement('button');
    document.body.appendChild(el);
    expect(() => mount('h-bottom-nav-link', el, {})).toThrow(/x-h-bottom-nav-item element/);
  });

  it('announces the active destination as the current page', () => {
    const { link } = mountLink({ active: 'home' });
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('leaves aria-current off an inactive destination', () => {
    const { link } = mountLink({ active: 'search' });
    expect(link.hasAttribute('aria-current')).toBe(false);
  });

  it('follows the active state when it changes after mount', async () => {
    const { item, link } = mountLink({ active: 'search' });
    item.setAttribute('data-active', 'true');
    await flush();
    expect(link.getAttribute('aria-current')).toBe('page');
    item.removeAttribute('data-active');
    await flush();
    expect(link.hasAttribute('aria-current')).toBe(false);
  });

  it('writes its value to the bar on click', () => {
    const evaluate = vi.fn();
    const tree = makeTree({ expression: 'tab' });
    // The bar has to be remounted with the spying evaluate, since setValue closes
    // over the one it was given.
    mount('h-bottom-nav', tree.nav, { expression: 'tab' }, { evaluate });
    mount('h-bottom-nav-item', tree.item, { expression: "'home'" }, { evaluateLater: evaluateLaterFrom({ tab: 'search', "'home'": 'home' }) });
    mount('h-bottom-nav-link', tree.link, {});
    tree.link.dispatchEvent(new Event('click', { bubbles: true }));
    expect(evaluate).toHaveBeenCalledTimes(1);
    expect(Object.values(evaluate.mock.calls[0][1].scope)).toEqual(['home']);
  });

  it('dispatches a bubbling change event carrying the value', () => {
    const { nav, link } = mountLink();
    const onChange = vi.fn();
    nav.addEventListener('change', onChange);
    link.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: 'home' });
  });

  it('stays quiet on click when the item has no value', () => {
    const tree = makeTree({ expression: 'tab' });
    mount('h-bottom-nav-item', tree.item, { expression: '' });
    mount('h-bottom-nav-link', tree.link, {});
    const onChange = vi.fn();
    tree.nav.addEventListener('change', onChange);
    tree.link.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('never prevents the default, so an anchor still navigates', () => {
    const { link } = mountLink({ linkTag: 'a' });
    const event = new Event('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('stops responding to clicks after cleanup', () => {
    const { nav, link, ctx } = mountLink();
    const onChange = vi.fn();
    nav.addEventListener('change', onChange);
    ctx.cleanup.mock.calls[0][0]();
    link.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disconnects its observer on cleanup', () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const { ctx } = mountLink();
    ctx.cleanup.mock.calls[0][0]();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });

  describe('accessible name in icon-only mode', () => {
    let error;

    beforeEach(() => {
      error = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      error.mockRestore();
    });

    it('reports a destination with no name when the labels are hidden', () => {
      mountLink({ navAttrs: { labels: 'false' } });
      expect(error).toHaveBeenCalled();
    });

    it('accepts an aria-label', () => {
      const tree = makeTree({ expression: 'tab', navAttrs: { labels: 'false' } });
      tree.link.setAttribute('aria-label', 'Home');
      mount('h-bottom-nav-item', tree.item, {});
      mount('h-bottom-nav-link', tree.link, {});
      expect(error).not.toHaveBeenCalled();
    });

    it('accepts an aria-labelledby', () => {
      const tree = makeTree({ expression: 'tab', navAttrs: { labels: 'false' } });
      tree.link.setAttribute('aria-labelledby', 'heading');
      mount('h-bottom-nav-item', tree.item, {});
      mount('h-bottom-nav-link', tree.link, {});
      expect(error).not.toHaveBeenCalled();
    });

    it('says nothing while the labels are visible', () => {
      mountLink();
      expect(error).not.toHaveBeenCalled();
    });
  });
});

describe('h-bottom-nav-label directive', () => {
  it('sets data-slot to bottom-nav-label', () => {
    const el = document.createElement('span');
    mount('h-bottom-nav-label', el, {});
    expect(el.getAttribute('data-slot')).toBe('bottom-nav-label');
  });

  it('keeps a long label on one line', () => {
    const el = document.createElement('span');
    mount('h-bottom-nav-label', el, {});
    expect(el.classList.contains('truncate')).toBe(true);
    expect(el.classList.contains('text-center')).toBe(true);
  });

  it('folds away in icon-only mode', () => {
    const el = document.createElement('span');
    mount('h-bottom-nav-label', el, {});
    expect(el.classList.contains('group-data-[labels=false]/bottom-nav:hidden')).toBe(true);
  });
});

describe('h-bottom-nav hide on scroll', () => {
  let nav;
  let scroller;

  beforeEach(() => {
    stubFrames();
    scroller = makeScroller();
    nav = makeNav({ position: 'fixed' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mountWatching(value = '$refs.panel', target = scroller) {
    nav.setAttribute('data-hide-on-scroll', value);
    return mount('h-bottom-nav', nav, {}, { evaluate: () => target });
  }

  it('attaches nothing without the attribute', () => {
    mount('h-bottom-nav', nav, {}, { evaluate: () => scroller });
    expect(nav.classList.contains('duration-200')).toBe(false);
    scrollTo(scroller, 400);
    expect(nav.classList.contains('translate-y-full')).toBe(false);
  });

  it('stays put when the attribute is empty or false', () => {
    for (const value of ['', 'false']) {
      const node = makeNav();
      node.setAttribute('data-hide-on-scroll', value);
      mount('h-bottom-nav', node, {}, { evaluate: () => scroller });
      scrollTo(scroller, 400);
      expect(node.classList.contains('translate-y-full'), `"${value}" should not enable it`).toBe(false);
      scrollTo(scroller, 0);
    }
  });

  it('applies the slide timing when enabled', () => {
    mountWatching();
    expect(nav.classList.contains('duration-200')).toBe(true);
    expect(nav.classList.contains('ease-out')).toBe(true);
  });

  it('slides away on scroll down', () => {
    mountWatching();
    scrollTo(scroller, 400);
    bottomNavHiddenClasses.forEach((cls) => expect(nav.classList.contains(cls), cls).toBe(true));
  });

  it('ignores a scroll smaller than the threshold', () => {
    mountWatching();
    scrollTo(scroller, FAB_SCROLL_THRESHOLD - 1);
    expect(nav.classList.contains('translate-y-full')).toBe(false);
  });

  it('comes back on scroll up', () => {
    mountWatching();
    scrollTo(scroller, 400);
    scrollTo(scroller, 200);
    bottomNavHiddenClasses.forEach((cls) => expect(nav.classList.contains(cls), cls).toBe(false));
  });

  it('comes back at the top even when the last move was down', () => {
    mountWatching();
    scrollTo(scroller, 400);
    scrollTo(scroller, 0);
    expect(nav.classList.contains('translate-y-full')).toBe(false);
  });

  it('watches the page when the value is "true"', () => {
    const view = nav.ownerDocument.defaultView;
    const add = vi.spyOn(view, 'addEventListener');
    nav.setAttribute('data-hide-on-scroll', 'true');
    mount('h-bottom-nav', nav, {});
    expect(add).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    add.mockRestore();
  });

  it('watches the element from the expression, not the page', () => {
    mountWatching();
    window.dispatchEvent(new Event('scroll'));
    flushFrames();
    expect(nav.classList.contains('translate-y-full')).toBe(false);
    scrollTo(scroller, 400);
    expect(nav.classList.contains('translate-y-full')).toBe(true);
  });

  it('registers the listener passively', () => {
    const add = vi.spyOn(scroller, 'addEventListener');
    mountWatching();
    expect(add).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    add.mockRestore();
  });

  it('reports an expression that is not a scrollable element', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    nav.setAttribute('data-hide-on-scroll', '$refs.nope');
    mount('h-bottom-nav', nav, {}, { evaluate: () => 'not-an-element' });
    expect(error).toHaveBeenCalled();
    expect(nav.classList.contains('duration-200')).toBe(false);
    error.mockRestore();
  });

  it('leaves the tab order and the accessibility tree while away', () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(nav.hasAttribute('inert')).toBe(true);
    expect(nav.getAttribute('aria-hidden')).toBe('true');
    scrollTo(scroller, 200);
    expect(nav.hasAttribute('inert')).toBe(false);
    expect(nav.hasAttribute('aria-hidden')).toBe(false);
  });

  it('never uses hidden, which would stop the slide animating', () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(nav.classList.contains('hidden')).toBe(false);
  });

  it('coalesces a burst of scroll events into one frame', () => {
    mountWatching();
    scroller.scrollTop = 400;
    scroller.dispatchEvent(new Event('scroll'));
    scroller.dispatchEvent(new Event('scroll'));
    scroller.dispatchEvent(new Event('scroll'));
    expect(frameCallbacks).toHaveLength(1);
    flushFrames();
    expect(nav.classList.contains('translate-y-full')).toBe(true);
  });

  it('starts watching when the attribute is set after mount', async () => {
    mount('h-bottom-nav', nav, {}, { evaluate: () => scroller });
    nav.setAttribute('data-hide-on-scroll', '$refs.panel');
    await flush();
    expect(nav.classList.contains('duration-200')).toBe(true);
    scrollTo(scroller, 400);
    expect(nav.classList.contains('translate-y-full')).toBe(true);
  });

  it('stops watching and restores itself when the attribute is removed', async () => {
    mountWatching();
    scrollTo(scroller, 400);
    expect(nav.classList.contains('translate-y-full')).toBe(true);
    nav.removeAttribute('data-hide-on-scroll');
    await flush();
    bottomNavHiddenClasses.forEach((cls) => expect(nav.classList.contains(cls), cls).toBe(false));
    expect(nav.classList.contains('duration-200')).toBe(false);
    expect(nav.hasAttribute('inert')).toBe(false);
    scrollTo(scroller, 800);
    expect(nav.classList.contains('translate-y-full')).toBe(false);
  });

  it('stops responding after cleanup', () => {
    const { ctx } = mountWatching();
    ctx.cleanup.mock.calls[0][0]();
    scrollTo(scroller, 400);
    expect(nav.classList.contains('translate-y-full')).toBe(false);
  });

  it('cancels a pending frame on cleanup', () => {
    const { ctx } = mountWatching();
    scroller.scrollTop = 400;
    scroller.dispatchEvent(new Event('scroll'));
    ctx.cleanup.mock.calls[0][0]();
    flushFrames();
    expect(nav.classList.contains('translate-y-full')).toBe(false);
  });
});
