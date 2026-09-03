import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import tabsPlugin from '../../src/components/tabs.js';
import { mountDirective } from '../test-utils.js';

afterEach(() => {
  document.body.innerHTML = '';
});

// MutationObserver callbacks are async microtasks, so state driven by one is only
// visible after a flush.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function keydown(el, key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

// Builds the x-h-tabs > x-h-tab-list > x-h-tab-item > x-h-tab chain the
// directives require, in tree order because the item mounts before its children
// and a tab registers with its list at mount. `floating` is left null by
// default so the chain has no tab bar at all, which is the shape a list that
// skips the bar produces and which must read as docked.
function createTabs({ orientation = 'horizontal', floating = null, count = 3, selected = 0, disabled = [], ariaDisabled = [], action = false } = {}) {
  const root = document.createElement('div');
  root.setAttribute('data-orientation', orientation);
  document.body.appendChild(root);
  const rootMount = mountDirective(tabsPlugin, 'h-tabs', root);

  let bar = null;
  let barMount = null;
  let parent = root;
  if (floating !== null) {
    bar = document.createElement('div');
    // A docked bar is written by omitting the attribute, matching real markup.
    if (floating === true) bar.setAttribute('data-floating', 'true');
    else if (floating !== false) bar.setAttribute('data-floating', floating);
    root.appendChild(bar);
    barMount = mountDirective(tabsPlugin, 'h-tab-bar', bar);
    parent = bar;
  }

  const list = document.createElement('div');
  parent.appendChild(list);
  const listMount = mountDirective(tabsPlugin, 'h-tab-list', list, { original: 'x-h-tab-list' });

  const items = [];
  const itemMounts = [];
  const tabs = [];
  const tabMounts = [];
  const actions = [];
  const actionMounts = [];
  for (let i = 0; i < count; i++) {
    const { item, mount: itemMount } = mountTabItemInto(list);
    items.push(item);
    itemMounts.push(itemMount);
    const tab = document.createElement('button');
    tab.setAttribute('id', `tab-${i}`);
    tab.setAttribute('aria-controls', `panel-${i}`);
    if (selected === i) tab.setAttribute('aria-selected', 'true');
    if (disabled.includes(i)) tab.disabled = true;
    if (ariaDisabled.includes(i)) tab.setAttribute('aria-disabled', 'true');
    item.appendChild(tab);
    tabMounts.push(mountDirective(tabsPlugin, 'h-tab', tab, { original: 'x-h-tab' }));
    tabs.push(tab);
    // Mounted after its tab, which is the common order and the case where the
    // tab may already hold the stop.
    if (action) {
      const { action: el, mount } = mountActionInto(item);
      actions.push(el);
      actionMounts.push(mount);
    }
  }

  return { root, bar, list, items, tabs, actions, rootMount, barMount, listMount, itemMounts, tabMounts, actionMounts };
}

// Inserts an item wrapper into a list and mounts the directive on it, before its
// children since Alpine walks outer-in. `before` is a sibling item.
function mountTabItemInto(list, { before = null } = {}) {
  const item = document.createElement('div');
  list.insertBefore(item, before);
  const mount = mountDirective(tabsPlugin, 'h-tab-item', item, { original: 'x-h-tab-item' });
  return { item, mount };
}

// Appends a labelled button action to an item and mounts the directive on it.
function mountActionInto(item, { label = 'close tab' } = {}) {
  const action = document.createElement('button');
  if (label !== null) action.setAttribute('aria-label', label);
  item.appendChild(action);
  const mount = mountDirective(tabsPlugin, 'h-tab-action', action, { original: 'x-h-tab-action' });
  return { action, mount };
}

// Mounts a single extra tab, in its own item, into an existing list, so DOM
// position can be chosen independently of mount order. `before` is an item.
function mountTabInto(list, id, { before = null } = {}) {
  const { item } = mountTabItemInto(list, { before });
  const tab = document.createElement('button');
  tab.setAttribute('id', id);
  tab.setAttribute('aria-controls', `${id}-panel`);
  item.appendChild(tab);
  const mount = mountDirective(tabsPlugin, 'h-tab', tab, { original: 'x-h-tab' });
  return { tab, mount, item };
}

const tabIndexes = (tabs) => tabs.map((tab) => tab.getAttribute('tabindex'));

describe('h-tabs', () => {
  it('applies base classes and data-slot', () => {
    const { root } = createTabs();
    expect(root.classList.contains('flex')).toBe(true);
    expect(root.getAttribute('data-slot')).toBe('tabs');
  });

  it('includes horizontal and vertical orientation classes', () => {
    const { root } = createTabs();
    expect(root.classList.contains('data-[orientation=horizontal]:flex-col')).toBe(true);
    expect(root.classList.contains('data-[orientation=vertical]:flex-row')).toBe(true);
  });

  it('exposes the resolved orientation as reactive state', () => {
    expect(createTabs({ orientation: 'horizontal' }).root._h_tabs.vertical).toBe(false);
    expect(createTabs({ orientation: 'vertical' }).root._h_tabs.vertical).toBe(true);
  });

  it('treats a missing orientation as horizontal', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    mountDirective(tabsPlugin, 'h-tabs', root);
    expect(root._h_tabs.vertical).toBe(false);
  });

  it('updates the orientation state when data-orientation changes', async () => {
    const { root } = createTabs({ orientation: 'horizontal' });
    root.setAttribute('data-orientation', 'vertical');
    await flush();
    expect(root._h_tabs.vertical).toBe(true);
  });

  it('disconnects the orientation observer on cleanup', () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const { rootMount } = createTabs();
    disconnect.mockClear();
    rootMount.ctx.cleanup.mock.calls[0][0]();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });
});

describe('h-tab-bar', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tab-bar', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tab-bar');
  });

  it('exposes the resolved floating flag as reactive state', () => {
    expect(createTabs({ floating: true }).bar._h_tab_bar.floating).toBe(true);
    expect(createTabs({ floating: false }).bar._h_tab_bar.floating).toBe(false);
  });

  // Only the literal 'true' floats, so anything else has to read as docked.
  it('treats a non-true data-floating as docked', () => {
    expect(createTabs({ floating: 'false' }).bar._h_tab_bar.floating).toBe(false);
    expect(createTabs({ floating: 'yes' }).bar._h_tab_bar.floating).toBe(false);
  });

  it('updates the floating state when data-floating changes', async () => {
    const { bar } = createTabs({ floating: false });
    bar.setAttribute('data-floating', 'true');
    await flush();
    expect(bar._h_tab_bar.floating).toBe(true);
  });

  it('disconnects the floating observer on cleanup', () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const { barMount } = createTabs({ floating: true });
    disconnect.mockClear();
    barMount.ctx.cleanup.mock.calls[0][0]();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });

  it.each([
    { orientation: 'horizontal', floating: false, present: ['flex-row', 'h-10', 'data-[size=sm]:h-8', 'inset-shadow-[0_-.063rem_var(--border)]'], absent: ['flex-col', 'inset-shadow-[-.063rem_0_var(--border)]'] },
    { orientation: 'horizontal', floating: true, present: ['flex-row'], absent: ['flex-col', 'h-10', 'data-[size=sm]:h-8', 'inset-shadow-[0_-.063rem_var(--border)]'] },
    { orientation: 'vertical', floating: false, present: ['flex-col', 'inset-shadow-[-.063rem_0_var(--border)]'], absent: ['flex-row', 'h-10', 'data-[size=sm]:h-8'] },
    { orientation: 'vertical', floating: true, present: ['flex-col'], absent: ['flex-row', 'h-10', 'inset-shadow-[-.063rem_0_var(--border)]'] },
  ])('applies the $orientation floating=$floating class set', ({ orientation, floating, present, absent }) => {
    const { bar } = createTabs({ orientation, floating });
    for (const cls of present) expect(bar.classList.contains(cls), cls).toBe(true);
    for (const cls of absent) expect(bar.classList.contains(cls), cls).toBe(false);
  });

  it('swaps its class set when the orientation changes at runtime', async () => {
    const { root, bar } = createTabs({ orientation: 'horizontal', floating: false });
    root.setAttribute('data-orientation', 'vertical');
    await flush();
    expect(bar.classList.contains('flex-col')).toBe(true);
    expect(bar.classList.contains('flex-row')).toBe(false);
    expect(bar.classList.contains('h-10')).toBe(false);
  });

  it('swaps its class set when data-floating changes at runtime', async () => {
    const { bar } = createTabs({ orientation: 'horizontal', floating: false });
    bar.setAttribute('data-floating', 'true');
    await flush();
    expect(bar.classList.contains('inset-shadow-[0_-.063rem_var(--border)]')).toBe(false);
    expect(bar.classList.contains('h-10')).toBe(false);
    expect(bar.classList.contains('flex-row')).toBe(true);
  });
});

describe('h-tab-list', () => {
  it('applies base classes and attributes', () => {
    const { list } = createTabs();
    expect(list.classList.contains('flex')).toBe(true);
    expect(list.classList.contains('scrollbar-none')).toBe(true);
    expect(list.getAttribute('role')).toBe('tablist');
    expect(list.getAttribute('data-slot')).toBe('tab-list');
  });

  it('throws without an x-h-tabs ancestor', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab-list', el, { original: 'x-h-tab-list' })).toThrow(/x-h-tabs/);
  });

  it('mirrors the orientation onto aria-orientation', () => {
    expect(createTabs({ orientation: 'horizontal' }).list.getAttribute('aria-orientation')).toBe('horizontal');
    expect(createTabs({ orientation: 'vertical' }).list.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('updates aria-orientation when the root orientation changes', async () => {
    const { root, list } = createTabs({ orientation: 'horizontal' });
    root.setAttribute('data-orientation', 'vertical');
    await flush();
    expect(list.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('removes its listeners on cleanup', () => {
    const { list, listMount } = createTabs();
    const removeEventListener = vi.spyOn(list, 'removeEventListener');
    listMount.ctx.cleanup.mock.calls[0][0]();
    expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith('focusin', expect.any(Function));
  });

  it.each([
    { orientation: 'horizontal', present: ['flex-row', 'overflow-x-scroll'], absent: ['flex-col', 'overflow-y-scroll', 'h-fit'] },
    { orientation: 'vertical', present: ['flex-col', 'overflow-y-scroll', 'h-fit'], absent: ['flex-row', 'overflow-x-scroll'] },
  ])('applies the $orientation axis classes', ({ orientation, present, absent }) => {
    const { list } = createTabs({ orientation });
    for (const cls of present) expect(list.classList.contains(cls), cls).toBe(true);
    for (const cls of absent) expect(list.classList.contains(cls), cls).toBe(false);
  });

  it('swaps the axis classes when the orientation changes at runtime', async () => {
    const { root, list } = createTabs({ orientation: 'horizontal' });
    root.setAttribute('data-orientation', 'vertical');
    await flush();
    expect(list.classList.contains('flex-col')).toBe(true);
    expect(list.classList.contains('flex-row')).toBe(false);
    expect(list.classList.contains('overflow-y-scroll')).toBe(true);
    expect(list.classList.contains('overflow-x-scroll')).toBe(false);
    expect(list.classList.contains('h-fit')).toBe(true);
  });

  it('tightens the gap only when the bar floats', () => {
    const docked = createTabs({ floating: false }).list;
    expect(docked.classList.contains('gap-2')).toBe(true);
    expect(docked.classList.contains('gap-1')).toBe(false);
    const floating = createTabs({ floating: true }).list;
    expect(floating.classList.contains('gap-1')).toBe(true);
    expect(floating.classList.contains('gap-2')).toBe(false);
  });

  it('swaps the gap when data-floating changes at runtime', async () => {
    const { bar, list } = createTabs({ floating: false });
    bar.setAttribute('data-floating', 'true');
    await flush();
    expect(list.classList.contains('gap-1')).toBe(true);
    expect(list.classList.contains('gap-2')).toBe(false);
  });

  it('reads as docked with no tab bar in the chain', () => {
    expect(createTabs().list.className).toBe(createTabs({ floating: false }).list.className);
  });
});

describe('h-tab-item', () => {
  it('applies base classes and attributes', () => {
    const { items } = createTabs({ count: 1 });
    const el = items[0];
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('svg-defaults')).toBe(true);
    expect(el.getAttribute('role')).toBe('presentation');
    expect(el.getAttribute('data-slot')).toBe('tab-item');
  });

  it('throws when the element is interactive', () => {
    const { list } = createTabs({ count: 0 });
    for (const tag of ['button', 'a']) {
      const el = document.createElement(tag);
      list.appendChild(el);
      expect(() => mountDirective(tabsPlugin, 'h-tab-item', el, { original: 'x-h-tab-item' })).toThrow(/must not be an interactive element/);
    }
  });

  it('throws without an x-h-tab-list ancestor', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab-item', el, { original: 'x-h-tab-item' })).toThrow(/x-h-tab-list/);
  });

  it('throws without an x-h-tabs ancestor', () => {
    // A tab list attaches _h_tab_list without needing a tabs root, so an item
    // can find its list and still be outside the root.
    const list = document.createElement('div');
    document.body.appendChild(list);
    list._h_tab_list = { register() {}, unregister() {}, selectionChanged() {} };
    const el = document.createElement('div');
    list.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab-item', el, { original: 'x-h-tab-item' })).toThrow(/x-h-tabs/);
  });

  it('is valid with no tab inside, since an x-if may not have rendered one yet', () => {
    const { list } = createTabs({ count: 0 });
    expect(() => mountTabItemInto(list)).not.toThrow();
  });

  it('draws the focus ring and the disabled dimming for its tab', () => {
    const { items } = createTabs({ count: 1 });
    expect(items[0].classList.contains('has-[[data-slot=tab]:focus-visible]:inset-ring-ring/50')).toBe(true);
    expect(items[0].classList.contains('has-[[data-slot=tab]:focus-visible]:inset-ring-[calc(var(--spacing)*0.75)]')).toBe(true);
    expect(items[0].classList.contains('has-[[data-slot=tab]:disabled]:opacity-disabled')).toBe(true);
    expect(items[0].classList.contains('has-[[data-slot=tab][aria-disabled=true]]:opacity-disabled')).toBe(true);
  });

  // Each state owns every property it writes, so the absent lists are what catch
  // a stale class surviving a state change.
  it.each([
    {
      orientation: 'horizontal',
      floating: false,
      present: ['border-0', 'px-2', 'h-full', 'has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[0_-.125rem_var(--primary)]', 'hover:inset-shadow-[0_-.188rem_var(--border)]'],
      absent: ['border', 'rounded-md', 'px-3', 'w-full', 'h-8', 'has-[[data-slot=tab][aria-selected=true]]:bg-background', 'has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[-.125rem_0_var(--primary)]'],
    },
    {
      orientation: 'horizontal',
      floating: true,
      present: ['border', 'border-transparent', 'rounded-md', 'px-2', 'h-full', 'has-[[data-slot=tab][aria-selected=true]]:bg-background', 'has-[[data-slot=tab][aria-selected=true]]:border-border'],
      absent: ['border-0', 'px-3', 'w-full', 'h-8', 'has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[0_-.125rem_var(--primary)]'],
    },
    {
      orientation: 'vertical',
      floating: false,
      present: ['border-0', 'px-3', 'w-full', 'h-8', 'has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[-.125rem_0_var(--primary)]', 'hover:inset-shadow-[-.188rem_0_var(--border)]'],
      absent: ['border', 'rounded-md', 'px-2', 'h-full', 'has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[0_-.125rem_var(--primary)]'],
    },
    {
      orientation: 'vertical',
      floating: true,
      present: ['border', 'border-transparent', 'rounded-md', 'px-2', 'w-full', 'h-8', 'has-[[data-slot=tab][aria-selected=true]]:bg-background'],
      absent: ['border-0', 'px-3', 'h-full', 'has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[-.125rem_0_var(--primary)]'],
    },
  ])('applies the $orientation floating=$floating class set', ({ orientation, floating, present, absent }) => {
    const { items } = createTabs({ orientation, floating, count: 1 });
    for (const cls of present) expect(items[0].classList.contains(cls), cls).toBe(true);
    for (const cls of absent) expect(items[0].classList.contains(cls), cls).toBe(false);
  });

  it('swaps its class set when the orientation changes at runtime', async () => {
    const { root, items } = createTabs({ orientation: 'horizontal', floating: false, count: 1 });
    root.setAttribute('data-orientation', 'vertical');
    await flush();
    expect(items[0].classList.contains('px-3')).toBe(true);
    expect(items[0].classList.contains('px-2')).toBe(false);
    expect(items[0].classList.contains('h-8')).toBe(true);
    expect(items[0].classList.contains('h-full')).toBe(false);
    expect(items[0].classList.contains('has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[-.125rem_0_var(--primary)]')).toBe(true);
    expect(items[0].classList.contains('has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[0_-.125rem_var(--primary)]')).toBe(false);
  });

  it('swaps its class set when data-floating changes at runtime', async () => {
    const { bar, items } = createTabs({ orientation: 'horizontal', floating: false, count: 1 });
    bar.setAttribute('data-floating', 'true');
    await flush();
    expect(items[0].classList.contains('rounded-md')).toBe(true);
    expect(items[0].classList.contains('border')).toBe(true);
    expect(items[0].classList.contains('border-0')).toBe(false);
    expect(items[0].classList.contains('has-[[data-slot=tab][aria-selected=true]]:inset-shadow-[0_-.125rem_var(--primary)]')).toBe(false);
  });

  it('reads as docked with no tab bar in the chain', () => {
    expect(createTabs({ count: 1 }).items[0].className).toBe(createTabs({ floating: false, count: 1 }).items[0].className);
  });

  it('forwards a click on its own padding to the tab', () => {
    const { items, tabs } = createTabs({ count: 1 });
    const select = vi.fn();
    tabs[0].addEventListener('click', select);
    items[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(select).toHaveBeenCalledOnce();
  });

  it('does not forward a click that came from a child', () => {
    const { items, tabs } = createTabs({ count: 1, action: true });
    const select = vi.fn();
    tabs[0].addEventListener('click', select);
    // A click bubbling up from an action targets the action, not the item, so
    // the forward must not double it into a tab activation.
    items[0].querySelector('[data-slot=tab-action]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(select).not.toHaveBeenCalled();
  });

  it('forwards nothing when it has no tab', () => {
    const { list } = createTabs({ count: 0 });
    const { item } = mountTabItemInto(list);
    expect(() => item.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).not.toThrow();
  });

  it('removes its click listener on cleanup', () => {
    const { items, itemMounts } = createTabs({ count: 1 });
    const removeEventListener = vi.spyOn(items[0], 'removeEventListener');
    itemMounts[0].ctx.cleanup.mock.calls[0][0]();
    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});

describe('h-tab', () => {
  it('applies base classes and attributes', () => {
    const { tabs } = createTabs({ count: 1 });
    const el = tabs[0];
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('self-stretch')).toBe(true);
    expect(el.getAttribute('role')).toBe('tab');
    expect(el.getAttribute('data-slot')).toBe('tab');
  });

  // The item owns the surface, the colours and the focus ring, so the tab
  // carrying any of them would double them up or fight the item's state maps.
  it('takes none of the item surface or state classes', () => {
    const { tabs } = createTabs({ count: 1 });
    for (const cls of ['px-2', 'px-3', 'h-full', 'py-1', 'text-muted-foreground', 'focus-visible:inset-ring-ring/50', 'disabled:opacity-disabled', 'aria-disabled:opacity-disabled', 'transition-[color,box-shadow]']) {
      expect(tabs[0].classList.contains(cls), cls).toBe(false);
    }
  });

  it('throws if no id attribute', () => {
    const { list } = createTabs({ count: 0 });
    const { item } = mountTabItemInto(list);
    const el = document.createElement('button');
    el.setAttribute('aria-controls', 'panel-1');
    item.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).toThrow();
  });

  it('throws if no aria-controls attribute', () => {
    const { list } = createTabs({ count: 0 });
    const { item } = mountTabItemInto(list);
    const el = document.createElement('button');
    el.setAttribute('id', 'tab-1');
    item.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).toThrow();
  });

  it('throws without an x-h-tab-list ancestor', () => {
    const el = document.createElement('button');
    el.setAttribute('id', 'tab-1');
    el.setAttribute('aria-controls', 'panel-1');
    document.body.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).toThrow(/x-h-tab-list/);
  });

  it('throws without an x-h-tab-item ancestor', () => {
    const { list } = createTabs({ count: 0 });
    const el = document.createElement('button');
    el.setAttribute('id', 'tab-1');
    el.setAttribute('aria-controls', 'panel-1');
    list.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).toThrow(/x-h-tab-item/);
  });

  it('throws when its item already contains a tab', () => {
    const { items } = createTabs({ count: 1 });
    const el = document.createElement('button');
    el.setAttribute('id', 'second');
    el.setAttribute('aria-controls', 'second-panel');
    items[0].appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).toThrow(/only contain one tab/);
  });

  it('releases its item on cleanup so a replacement tab can mount', () => {
    const { items, tabMounts } = createTabs({ count: 1 });
    tabMounts[0].ctx.cleanup.mock.calls[0][0]();
    expect(items[0]._h_tab_item.tab).toBe(null);
    const el = document.createElement('button');
    el.setAttribute('id', 'replacement');
    el.setAttribute('aria-controls', 'replacement-panel');
    items[0].appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).not.toThrow();
  });

  it('defaults aria-selected to false', () => {
    const { tabs } = createTabs({ count: 2, selected: 0 });
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('leaves an explicit aria-selected value alone', () => {
    const { list } = createTabs({ count: 0 });
    for (const value of ['true', 'false']) {
      const { item } = mountTabItemInto(list);
      const el = document.createElement('button');
      el.setAttribute('id', `tab-${value}`);
      el.setAttribute('aria-controls', `panel-${value}`);
      el.setAttribute('aria-selected', value);
      item.appendChild(el);
      mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' });
      expect(el.getAttribute('aria-selected')).toBe(value);
    }
  });
});

describe('h-tab roving tab stop', () => {
  it('puts the tab stop on the selected tab', () => {
    const { tabs } = createTabs({ count: 3, selected: 1 });
    expect(tabIndexes(tabs)).toEqual(['-1', '0', '-1']);
  });

  it('falls back to the first tab when none is selected', () => {
    const { tabs } = createTabs({ count: 3, selected: -1 });
    expect(tabIndexes(tabs)).toEqual(['0', '-1', '-1']);
  });

  it('gives the stop to the first selected tab when several are selected', () => {
    const { list } = createTabs({ count: 0 });
    const tabs = [];
    for (let i = 0; i < 3; i++) {
      const { item } = mountTabItemInto(list);
      const tab = document.createElement('button');
      tab.setAttribute('id', `tab-${i}`);
      tab.setAttribute('aria-controls', `panel-${i}`);
      if (i > 0) tab.setAttribute('aria-selected', 'true');
      item.appendChild(tab);
      mountDirective(tabsPlugin, 'h-tab', tab, { original: 'x-h-tab' });
      tabs.push(tab);
    }
    expect(tabIndexes(tabs)).toEqual(['-1', '0', '-1']);
  });

  it('never gives the stop to a disabled tab', () => {
    const { tabs } = createTabs({ count: 3, selected: 1, disabled: [1] });
    expect(tabIndexes(tabs)).toEqual(['0', '-1', '-1']);
  });

  it('gives the stop to a selected aria-disabled tab, which is still announced', () => {
    const { tabs } = createTabs({ count: 3, selected: 0, ariaDisabled: [0] });
    expect(tabIndexes(tabs)).toEqual(['0', '-1', '-1']);
  });

  it('leaves every tab out of the tab order when all are disabled', () => {
    const { tabs } = createTabs({ count: 2, selected: -1, disabled: [0, 1] });
    expect(tabIndexes(tabs)).toEqual(['-1', '-1']);
  });

  it('moves the stop when aria-selected changes', async () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[2].setAttribute('aria-selected', 'true');
    await flush();
    expect(tabIndexes(tabs)).toEqual(['-1', '-1', '0']);
  });

  it('moves the stop when the tab holding it becomes disabled', async () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].disabled = true;
    tabs[0].setAttribute('disabled', '');
    await flush();
    expect(tabs[0].getAttribute('tabindex')).toBe('-1');
    expect(tabs[1].getAttribute('tabindex')).toBe('0');
  });

  it('re-syncs the stop on focusin', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[2].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(tabIndexes(tabs)).toEqual(['-1', '-1', '0']);
  });
});

describe('h-tab registration', () => {
  it('navigates in DOM order, not mount order', () => {
    const { list, items, tabs } = createTabs({ count: 2, selected: 0 });
    // Mounted last, but inserted between the two existing items. In mount order
    // it would come after tabs[1]; in DOM order it sits between them, which is
    // what the arrows must follow.
    const { tab: middle, item: middleItem } = mountTabInto(list, 'inserted-middle', { before: items[1] });
    expect([...list.children]).toEqual([items[0], middleItem, items[1]]);
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(middle);
    keydown(middle, 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('skips a tab that unregistered on cleanup', () => {
    const { tabs, tabMounts } = createTabs({ count: 3, selected: 0 });
    tabMounts[1].ctx.cleanup.mock.calls[0][0]();
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[2]);
  });

  it('hands the stop on when the tab holding it unregisters', () => {
    const { tabs, tabMounts } = createTabs({ count: 3, selected: 0 });
    expect(tabs[0].getAttribute('tabindex')).toBe('0');
    tabMounts[0].ctx.cleanup.mock.calls[0][0]();
    expect(tabs[1].getAttribute('tabindex')).toBe('0');
  });

  it('stops observing an unregistered tab', async () => {
    const { tabs, tabMounts } = createTabs({ count: 3, selected: 0 });
    tabMounts[2].ctx.cleanup.mock.calls[0][0]();
    tabs[2].setAttribute('aria-selected', 'true');
    await flush();
    // The removed tab no longer takes part, so the stop stays put.
    expect(tabs[0].getAttribute('tabindex')).toBe('0');
    expect(tabs[2].getAttribute('tabindex')).toBe('-1');
  });
});

describe('h-tab-list keyboard navigation', () => {
  it('moves focus with right and left arrows when horizontal', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
    keydown(tabs[1], 'ArrowLeft');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('wraps around at both ends when horizontal', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowLeft');
    expect(document.activeElement).toBe(tabs[2]);
    keydown(tabs[2], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('moves focus with down and up arrows when vertical', () => {
    const { tabs } = createTabs({ orientation: 'vertical', count: 3, selected: 0 });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowDown');
    expect(document.activeElement).toBe(tabs[1]);
    keydown(tabs[1], 'ArrowUp');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('ignores off-axis arrows without preventing default', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    const event = keydown(tabs[0], 'ArrowDown');
    expect(document.activeElement).toBe(tabs[0]);
    expect(event.defaultPrevented).toBe(false);

    const vertical = createTabs({ orientation: 'vertical', count: 3, selected: 0 });
    vertical.tabs[0].focus();
    const verticalEvent = keydown(vertical.tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(vertical.tabs[0]);
    expect(verticalEvent.defaultPrevented).toBe(false);
  });

  it('follows the axis after the orientation changes at runtime', async () => {
    const { root, tabs } = createTabs({ count: 3, selected: 0 });
    root.setAttribute('data-orientation', 'vertical');
    await flush();
    tabs[0].focus();
    keydown(tabs[0], 'ArrowDown');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('supports the legacy arrow key names', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    keydown(tabs[0], 'Right');
    expect(document.activeElement).toBe(tabs[1]);
    keydown(tabs[1], 'Left');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('moves focus to the first and last tab with Home and End', () => {
    const { tabs } = createTabs({ count: 3, selected: 1 });
    tabs[1].focus();
    keydown(tabs[1], 'End');
    expect(document.activeElement).toBe(tabs[2]);
    keydown(tabs[2], 'Home');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('skips disabled tabs', () => {
    const { tabs } = createTabs({ count: 3, selected: 0, disabled: [1] });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[2]);
  });

  it('moves onto an aria-disabled tab', () => {
    const { tabs } = createTabs({ count: 3, selected: 0, ariaDisabled: [1] });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('lands on an aria-disabled tab for Home and End', () => {
    const { tabs } = createTabs({ count: 4, selected: 1, ariaDisabled: [0, 3] });
    tabs[1].focus();
    keydown(tabs[1], 'Home');
    expect(document.activeElement).toBe(tabs[0]);
    keydown(tabs[0], 'End');
    expect(document.activeElement).toBe(tabs[3]);
  });

  // Selection is the author's to make, so their handler is what has to be
  // stopped. pointer-events-none cannot do it, since Enter and Space on a button
  // reach the handler through a synthetic click that hit-testing never sees.
  it('does not let a click on an aria-disabled tab reach the author handler', () => {
    const { tabs } = createTabs({ count: 2, selected: 0, ariaDisabled: [1] });
    const select = vi.fn();
    tabs[1].addEventListener('click', select);
    tabs[1].click();
    expect(select).not.toHaveBeenCalled();
  });

  it('still lets a click on an enabled tab reach the author handler', () => {
    const { tabs } = createTabs({ count: 2, selected: 0 });
    const select = vi.fn();
    tabs[1].addEventListener('click', select);
    tabs[1].click();
    expect(select).toHaveBeenCalledOnce();
  });

  it('is reachable by the arrow keys but still cannot be activated', () => {
    const { tabs } = createTabs({ count: 2, selected: 0, ariaDisabled: [1] });
    const select = vi.fn();
    tabs[1].addEventListener('click', select);
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
    // The browser turns Enter on a focused button into a click, which happy-dom
    // does not synthesize, so the click stands in for the key press.
    tabs[1].click();
    expect(select).not.toHaveBeenCalled();
  });

  it('skips disabled tabs for Home and End', () => {
    const { tabs } = createTabs({ count: 4, selected: 1, disabled: [0, 3] });
    tabs[1].focus();
    keydown(tabs[1], 'Home');
    expect(document.activeElement).toBe(tabs[1]);
    keydown(tabs[1], 'End');
    expect(document.activeElement).toBe(tabs[2]);
  });

  it('navigates from a keydown on an element inside a tab', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    const action = document.createElement('span');
    tabs[0].appendChild(action);
    keydown(action, 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('ignores a keydown that did not come from a tab', () => {
    const { list, tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    const event = keydown(list, 'ArrowRight');
    expect(document.activeElement).toBe(tabs[0]);
    expect(event.defaultPrevented).toBe(false);
  });

  it('moves the tab stop along with focus', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(tabIndexes(tabs)).toEqual(['-1', '0', '-1']);
  });

  it('does not change the selection', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('leaves Enter and Space to the native button, so activation stays manual', () => {
    // happy-dom does not synthesize the click a real browser fires for these keys
    // on a button, so this asserts only that the component keeps out of the way.
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    for (const key of ['Enter', ' ']) {
      const event = keydown(tabs[0], key);
      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(tabs[0]);
    }
  });

  it('prevents default for the keys it consumes', () => {
    const { tabs } = createTabs({ count: 3, selected: 0 });
    tabs[0].focus();
    for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End']) {
      expect(keydown(document.activeElement, key).defaultPrevented, key).toBe(true);
    }
  });
});

// happy-dom runs no layout, so the scroll metrics (prototype getters that always
// return zero) are stubbed per element as own properties. scrollLeft/scrollTop
// need no stub, since happy-dom's accessors store assigned values, but no scroll
// event fires on assignment, so tests dispatch it themselves.
const setMetrics = (el, props) => {
  for (const [key, value] of Object.entries(props)) {
    Object.defineProperty(el, key, { value, configurable: true });
  }
};

const setRect = (el, rect) => {
  const box = { top: 0, bottom: 0, left: 0, right: 0, ...rect };
  box.width = box.right - box.left;
  box.height = box.bottom - box.top;
  el.getBoundingClientRect = () => box;
};

describe('h-tab-list overflow fade', () => {
  const fadeClasses = ['fade-x-8', 'fade-l-8', 'fade-r-8', 'fade-y-8', 'fade-t-8', 'fade-b-8'];
  let observers;
  let OriginalResizeObserver;
  let cancelFrame;

  beforeEach(() => {
    observers = [];
    OriginalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
        this.observe = vi.fn();
        this.unobserve = vi.fn();
        this.disconnect = vi.fn();
        observers.push(this);
      }
    };
    cancelFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', (callback) => {
      callback();
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', cancelFrame);
  });

  afterEach(() => {
    global.ResizeObserver = OriginalResizeObserver;
    vi.unstubAllGlobals();
  });

  it('shows no fade when the list does not overflow', () => {
    const { list } = createTabs();
    setMetrics(list, { scrollWidth: 200, clientWidth: 200 });
    list.dispatchEvent(new Event('scroll'));
    for (const cls of fadeClasses) {
      expect(list.classList.contains(cls), cls).toBe(false);
    }
  });

  it('fades only the end edge at the start of an overflowing list', () => {
    const { list } = createTabs();
    setMetrics(list, { scrollWidth: 400, clientWidth: 200 });
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-r-8')).toBe(true);
    expect(list.classList.contains('fade-l-8')).toBe(false);
    expect(list.classList.contains('fade-x-8')).toBe(false);
  });

  it('fades both edges with the single fade-x-8 class mid-scroll', () => {
    const { list } = createTabs();
    setMetrics(list, { scrollWidth: 400, clientWidth: 200 });
    list.scrollLeft = 100;
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-x-8')).toBe(true);
    expect(list.classList.contains('fade-l-8')).toBe(false);
    expect(list.classList.contains('fade-r-8')).toBe(false);
  });

  it('fades only the start edge at the end, within a one pixel epsilon', () => {
    const { list } = createTabs();
    setMetrics(list, { scrollWidth: 400, clientWidth: 200 });
    list.scrollLeft = 199.5;
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-l-8')).toBe(true);
    expect(list.classList.contains('fade-x-8')).toBe(false);
    expect(list.classList.contains('fade-r-8')).toBe(false);
  });

  it('uses the vertical fade classes when vertical', () => {
    const { list } = createTabs({ orientation: 'vertical' });
    setMetrics(list, { scrollHeight: 400, clientHeight: 200 });
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-b-8')).toBe(true);
    list.scrollTop = 100;
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-y-8')).toBe(true);
    expect(list.classList.contains('fade-b-8')).toBe(false);
    list.scrollTop = 200;
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-t-8')).toBe(true);
    expect(list.classList.contains('fade-y-8')).toBe(false);
  });

  it('recomputes the fades when the orientation changes at runtime', async () => {
    const { root, list } = createTabs();
    setMetrics(list, { scrollWidth: 400, clientWidth: 200, scrollHeight: 400, clientHeight: 200 });
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-r-8')).toBe(true);
    root.setAttribute('data-orientation', 'vertical');
    await flush();
    expect(list.classList.contains('fade-r-8')).toBe(false);
    expect(list.classList.contains('fade-b-8')).toBe(true);
  });

  it('updates the fades when a tab registers and when one unregisters', () => {
    const { list } = createTabs();
    setMetrics(list, { scrollWidth: 400, clientWidth: 200 });
    const { mount } = mountTabInto(list, 'extra');
    expect(list.classList.contains('fade-r-8')).toBe(true);
    setMetrics(list, { scrollWidth: 200 });
    mount.ctx.cleanup.mock.calls[0][0]();
    expect(list.classList.contains('fade-r-8')).toBe(false);
  });

  // The item is observed rather than the transparent tab button, since an action
  // mounted later by an x-if resizes the item, not the button.
  it('observes the list and every tab item for size changes', () => {
    const { list, items, tabMounts } = createTabs();
    expect(observers).toHaveLength(1);
    expect(observers[0].observe).toHaveBeenCalledWith(list);
    for (const item of items) {
      expect(observers[0].observe).toHaveBeenCalledWith(item);
    }
    tabMounts[0].ctx.cleanup.mock.calls[0][0]();
    expect(observers[0].unobserve).toHaveBeenCalledWith(items[0]);
  });

  it('updates the fades when the resize observer fires', () => {
    const { list } = createTabs();
    setMetrics(list, { scrollWidth: 400, clientWidth: 200 });
    observers[0].callback();
    expect(list.classList.contains('fade-r-8')).toBe(true);
  });

  it('removes the scroll listener, cancels the pending frame and disconnects the observer on cleanup', () => {
    const { list, listMount } = createTabs();
    cancelFrame.mockClear();
    listMount.ctx.cleanup.mock.calls[0][0]();
    expect(observers[0].disconnect).toHaveBeenCalled();
    expect(cancelFrame).toHaveBeenCalledWith(1);
    setMetrics(list, { scrollWidth: 400, clientWidth: 200 });
    list.dispatchEvent(new Event('scroll'));
    expect(list.classList.contains('fade-r-8')).toBe(false);
  });
});

// The reveal reads the item's box (the visual tab, actions included), so the
// rects are stubbed on the items rather than on the transparent tab buttons.
describe('h-tab-list selected tab reveal', () => {
  it('scrolls a newly selected tab into view at the nearest end edge', async () => {
    const { list, items, tabs } = createTabs({ count: 4, selected: 0 });
    setRect(list, { left: 0, right: 200 });
    setRect(items[2], { left: 250, right: 310 });
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[2].setAttribute('aria-selected', 'true');
    await flush();
    expect(list.scrollLeft).toBe(110);
  });

  it('scrolls a newly selected tab into view at the nearest start edge', async () => {
    const { list, items, tabs } = createTabs({ count: 4, selected: 3 });
    list.scrollLeft = 100;
    setRect(list, { left: 0, right: 200 });
    setRect(items[1], { left: -50, right: 10 });
    tabs[3].setAttribute('aria-selected', 'false');
    tabs[1].setAttribute('aria-selected', 'true');
    await flush();
    expect(list.scrollLeft).toBe(50);
  });

  it('does not scroll when the selected tab is already fully visible', async () => {
    const { list, items, tabs } = createTabs({ count: 3, selected: 0 });
    list.scrollLeft = 40;
    setRect(list, { left: 0, right: 200 });
    setRect(items[1], { left: 20, right: 80 });
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[1].setAttribute('aria-selected', 'true');
    await flush();
    expect(list.scrollLeft).toBe(40);
  });

  it('does not move the scroll when a disabled toggle re-fires selectionChanged', async () => {
    const { list, items, tabs } = createTabs({ count: 3, selected: 0 });
    setRect(list, { left: 0, right: 200 });
    setRect(items[0], { left: 250, right: 310 });
    list.scrollLeft = 40;
    tabs[1].disabled = true;
    await flush();
    expect(list.scrollLeft).toBe(40);
  });

  it('reveals a tab that mounts already selected', () => {
    const { list } = createTabs({ count: 0 });
    setRect(list, { left: 0, right: 200 });
    const { item } = mountTabItemInto(list);
    setRect(item, { left: 250, right: 310 });
    const tab = document.createElement('button');
    tab.setAttribute('id', 'late');
    tab.setAttribute('aria-controls', 'late-panel');
    tab.setAttribute('aria-selected', 'true');
    item.appendChild(tab);
    mountDirective(tabsPlugin, 'h-tab', tab, { original: 'x-h-tab' });
    expect(list.scrollLeft).toBe(110);
  });

  it('reveals along the vertical axis when vertical', async () => {
    const { list, items, tabs } = createTabs({ orientation: 'vertical', count: 4, selected: 0 });
    setRect(list, { top: 0, bottom: 100 });
    setRect(items[2], { top: 150, bottom: 180 });
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[2].setAttribute('aria-selected', 'true');
    await flush();
    expect(list.scrollTop).toBe(80);
  });

  it('does nothing on deselection and reveals the same tab when it is selected again', async () => {
    const { list, items, tabs } = createTabs({ count: 3, selected: 1 });
    setRect(list, { left: 0, right: 200 });
    setRect(items[1], { left: 250, right: 310 });
    list.scrollLeft = 40;
    tabs[1].setAttribute('aria-selected', 'false');
    await flush();
    expect(list.scrollLeft).toBe(40);
    tabs[1].setAttribute('aria-selected', 'true');
    await flush();
    expect(list.scrollLeft).toBe(150);
  });

  it('finishes the initial reveal on the first resize when layout was not ready at mount, and only then', () => {
    const observers = [];
    const OriginalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
        this.observe = vi.fn();
        this.unobserve = vi.fn();
        this.disconnect = vi.fn();
        observers.push(this);
      }
    };
    try {
      const { list, items } = createTabs({ count: 3, selected: 2 });
      // Every rect was zero at mount, so nothing scrolled.
      expect(list.scrollLeft).toBe(0);
      setRect(list, { left: 0, right: 200 });
      setRect(items[2], { left: 250, right: 310 });
      observers[0].callback();
      expect(list.scrollLeft).toBe(110);
      // Settled, so a later resize leaves the user's scroll position alone.
      list.scrollLeft = 40;
      observers[0].callback();
      expect(list.scrollLeft).toBe(40);
    } finally {
      global.ResizeObserver = OriginalResizeObserver;
    }
  });
});

describe('h-tab-action', () => {
  it('applies base classes and attributes', () => {
    const { actions } = createTabs({ count: 1, action: true });
    const el = actions[0];
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('p-0.5')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.classList.contains('focus-outline')).toBe(true);
    expect(el.classList.contains('aria-expanded:bg-secondary')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tab-action');
  });

  it('throws when not a button element', () => {
    const { items } = createTabs({ count: 1 });
    const el = document.createElement('span');
    items[0].appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab-action', el, { original: 'x-h-tab-action' })).toThrow(/button element/);
  });

  it('throws without an x-h-tab-item ancestor', () => {
    const el = document.createElement('button');
    document.body.appendChild(el);
    expect(() => mountDirective(tabsPlugin, 'h-tab-action', el, { original: 'x-h-tab-action' })).toThrow(/x-h-tab-item/);
  });

  // The old span action carried role="button" and hand-rolled activation. A
  // native button needs neither, so writing them again would be a regression.
  it('writes no role of its own', () => {
    const { actions } = createTabs({ count: 1, action: true });
    expect(actions[0].hasAttribute('role')).toBe(false);
  });

  it('adds no listeners, since a sibling button needs no propagation stop', () => {
    const { items } = createTabs({ count: 1 });
    const el = document.createElement('button');
    el.setAttribute('aria-label', 'close tab');
    items[0].appendChild(el);
    const addEventListener = vi.spyOn(el, 'addEventListener');
    mountDirective(tabsPlugin, 'h-tab-action', el, { original: 'x-h-tab-action' });
    expect(addEventListener).not.toHaveBeenCalled();
  });

  it('defaults type to button and keeps an author-set type', () => {
    const { actions } = createTabs({ count: 1, action: true });
    expect(actions[0].getAttribute('type')).toBe('button');

    const { items } = createTabs({ count: 1 });
    const el = document.createElement('button');
    el.setAttribute('aria-label', 'close tab');
    el.setAttribute('type', 'submit');
    items[0].appendChild(el);
    mountDirective(tabsPlugin, 'h-tab-action', el, { original: 'x-h-tab-action' });
    expect(el.getAttribute('type')).toBe('submit');
  });

  it('does not activate the tab with its click, being a sibling', () => {
    const { tabs, actions } = createTabs({ count: 1, action: true });
    const onTabClick = vi.fn();
    tabs[0].addEventListener('click', onTabClick);
    actions[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(onTabClick).not.toHaveBeenCalled();
  });

  it('allows several actions on one tab, all sharing the stop', () => {
    const { items, tabs } = createTabs({ count: 1 });
    const first = mountActionInto(items[0]).action;
    const second = mountActionInto(items[0], { label: 'open menu' }).action;
    expect(tabs[0].getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(second.getAttribute('tabindex')).toBe('0');
  });

  it('shares the tab stop with its tab', () => {
    const { actions } = createTabs({ count: 3, selected: 1, action: true });
    expect(actions.map((a) => a.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  // The tab mounts first and already holds the stop by the time its action
  // mounts, which is also the x-if case: an action inserted long after the
  // stop settled, with no register() to re-sync the list.
  it('adopts the stop its tab already holds', () => {
    const { tabs, actions } = createTabs({ count: 1, action: true });
    expect(tabs[0].getAttribute('tabindex')).toBe('0');
    expect(actions[0].getAttribute('tabindex')).toBe('0');
  });

  it('adopts the -1 of a tab not holding the stop', () => {
    const { items } = createTabs({ count: 2, selected: 0 });
    const { action } = mountActionInto(items[1]);
    expect(action.getAttribute('tabindex')).toBe('-1');
  });

  // An x-for can put the action before the tab. It mounts into an empty item,
  // and the tab's registration is what writes the stop it could not copy.
  it('receives the stop when it mounts before its tab', () => {
    const { list } = createTabs({ count: 0 });
    const { item } = mountTabItemInto(list);
    const { action } = mountActionInto(item);
    expect(action.getAttribute('tabindex')).toBe('-1');
    const tab = document.createElement('button');
    tab.setAttribute('id', 'leading');
    tab.setAttribute('aria-controls', 'leading-panel');
    tab.setAttribute('aria-selected', 'true');
    item.appendChild(tab);
    mountDirective(tabsPlugin, 'h-tab', tab, { original: 'x-h-tab' });
    expect(action.getAttribute('tabindex')).toBe('0');
  });

  it('leaves the stop sync on cleanup, so a removed action is not retouched', async () => {
    const { items, tabs, actions, actionMounts } = createTabs({ count: 2, selected: 0, action: true });
    actionMounts[0].ctx.cleanup.mock.calls[0][0]();
    expect(items[0]._h_tab_item.actions).not.toContain(actions[0]);
    actions[0].setAttribute('tabindex', 'stale');
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[1].setAttribute('aria-selected', 'true');
    await flush();
    expect(actions[0].getAttribute('tabindex')).toBe('stale');
    expect(actions[1].getAttribute('tabindex')).toBe('0');
  });

  it('follows the tab stop when the selection changes', async () => {
    const { tabs, actions } = createTabs({ count: 3, selected: 0, action: true });
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[2].setAttribute('aria-selected', 'true');
    await flush();
    expect(actions.map((a) => a.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
  });

  it('follows the tab stop when an arrow key moves focus', () => {
    const { tabs, actions } = createTabs({ count: 3, selected: 0, action: true });
    tabs[0].focus();
    keydown(tabs[0], 'ArrowRight');
    expect(actions.map((a) => a.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
  });

  it('errors when it has no accessible name', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { items } = createTabs({ count: 1 });
    mountActionInto(items[0], { label: null });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('accepts aria-labelledby as the accessible name', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { items } = createTabs({ count: 1 });
    const el = document.createElement('button');
    el.setAttribute('aria-labelledby', 'somewhere');
    items[0].appendChild(el);
    mountDirective(tabsPlugin, 'h-tab-action', el, { original: 'x-h-tab-action' });
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('never writes an aria-label of its own', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { items } = createTabs({ count: 1 });
    const { action } = mountActionInto(items[0], { label: null });
    expect(action.hasAttribute('aria-label')).toBe(false);
    error.mockRestore();
  });

  // The content is the author's: the docs already write their own close icon, so
  // injecting one would double it.
  it('appends nothing to its content', () => {
    const { items } = createTabs({ count: 1 });
    const empty = mountActionInto(items[0]).action;
    expect(empty.childNodes.length).toBe(0);

    const { items: more } = createTabs({ count: 1 });
    const withIcon = document.createElement('button');
    withIcon.setAttribute('aria-label', 'close tab');
    withIcon.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    more[0].appendChild(withIcon);
    mountDirective(tabsPlugin, 'h-tab-action', withIcon, { original: 'x-h-tab-action' });
    expect(withIcon.children.length).toBe(1);
  });

  it('leaves the tab list arrow keys working from a focused action', () => {
    const { tabs, actions } = createTabs({ count: 3, selected: 0, action: true });
    actions[0].focus();
    keydown(actions[0], 'ArrowRight');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('re-syncs the stop to its tab on focusin', () => {
    const { tabs, actions } = createTabs({ count: 3, selected: 0, action: true });
    actions[2].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(tabIndexes(tabs)).toEqual(['-1', '-1', '0']);
  });
});

describe('h-tab-list-actions', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tab-list-actions', el, { modifiers: [] });
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('gap-1.5')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tab-list-actions');
  });

  it('adds end alignment classes for end modifier', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tab-list-actions', el, { modifiers: ['end'] });
    expect(el.classList.contains('ml-auto')).toBe(true);
    expect(el.classList.contains('mr-1.5')).toBe(true);
  });

  it.each([
    { orientation: 'horizontal', floating: false, present: ['ml-auto', 'mr-1.5'], absent: ['mt-auto', 'mb-1.5'] },
    { orientation: 'horizontal', floating: true, present: ['ml-auto'], absent: ['mr-1.5', 'mt-auto'] },
    { orientation: 'vertical', floating: false, present: ['mt-auto', 'mb-1.5'], absent: ['ml-auto', 'mr-1.5'] },
    { orientation: 'vertical', floating: true, present: ['mt-auto'], absent: ['mb-1.5', 'ml-auto'] },
  ])('aligns end actions for $orientation floating=$floating', ({ orientation, floating, present, absent }) => {
    const { bar, list } = createTabs({ orientation, floating });
    const el = document.createElement('div');
    (bar ?? list).appendChild(el);
    mountDirective(tabsPlugin, 'h-tab-list-actions', el, { modifiers: ['end'] });
    for (const cls of present) expect(el.classList.contains(cls), cls).toBe(true);
    for (const cls of absent) expect(el.classList.contains(cls), cls).toBe(false);
  });
});

describe('h-tab-list-action', () => {
  it('applies base classes, the default variant and attributes', () => {
    const el = document.createElement('button');
    mountDirective(tabsPlugin, 'h-tab-list-action', el);
    expect(el.classList.contains('rounded-md')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tab-list-action');
    // A native button needs no role, so the directive does not set one.
    expect(el.hasAttribute('role')).toBe(false);
  });

  it('throws when not a button element', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(tabsPlugin, 'h-tab-list-action', el, { original: 'x-h-tab-list-action' })).toThrow(/button/);
  });

  it.each([
    { orientation: 'horizontal', floating: false, present: ['aspect-square', 'w-auto', 'h-[75%]'], absent: ['h-9', 'w-[80%]', 'h-full', 'w-full'] },
    { orientation: 'horizontal', floating: true, present: ['aspect-square', 'w-auto', 'h-full'], absent: ['h-[75%]', 'h-9', 'w-full'] },
    { orientation: 'vertical', floating: false, present: ['h-9', 'w-[80%]'], absent: ['aspect-square', 'w-auto', 'h-[75%]', 'w-full'] },
    { orientation: 'vertical', floating: true, present: ['h-9', 'w-full'], absent: ['w-[80%]', 'aspect-square', 'h-full'] },
  ])('sizes the action for $orientation floating=$floating', ({ orientation, floating, present, absent }) => {
    const { bar, list } = createTabs({ orientation, floating });
    const el = document.createElement('button');
    (bar ?? list).appendChild(el);
    mountDirective(tabsPlugin, 'h-tab-list-action', el);
    for (const cls of present) expect(el.classList.contains(cls), cls).toBe(true);
    for (const cls of absent) expect(el.classList.contains(cls), cls).toBe(false);
  });

  it('applies the variant named by data-variant', () => {
    const outline = document.createElement('button');
    mountDirective(tabsPlugin, 'h-tab-list-action', outline);
    const transparent = document.createElement('button');
    transparent.setAttribute('data-variant', 'transparent');
    mountDirective(tabsPlugin, 'h-tab-list-action', transparent);
    expect(transparent.className).not.toBe(outline.className);
  });
});

describe('h-tabs-content', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'panel-1');
    el.setAttribute('aria-labelledby', 'tab-1');
    mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' });
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('outline-none')).toBe(true);
    expect(el.getAttribute('role')).toBe('tabpanel');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('data-slot')).toBe('tabs-content');
  });

  it('shows an inset focus ring, since the panel is focusable', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'panel-1');
    el.setAttribute('aria-labelledby', 'tab-1');
    mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' });
    expect(el.classList.contains('focus-visible:inset-ring-ring/50')).toBe(true);
    expect(el.classList.contains('focus-visible:inset-ring-[calc(var(--spacing)*0.75)]')).toBe(true);
  });

  it('keeps an author-set tabindex so a panel with focusable content can opt out', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'panel-1');
    el.setAttribute('aria-labelledby', 'tab-1');
    el.setAttribute('tabindex', '-1');
    mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' });
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('throws if no id attribute', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-labelledby', 'tab-1');
    expect(() => mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' })).toThrow();
  });

  it('throws if no aria-labelledby attribute', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'panel-1');
    expect(() => mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' })).toThrow();
  });
});
